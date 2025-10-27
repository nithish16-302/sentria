from fastapi import APIRouter, Query
from ..services.data_loader import load_sales
from datetime import timedelta
import pandas as pd

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except Exception:
    PROPHET_AVAILABLE = False

router = APIRouter()

@router.get("/sales")
async def forecast_sales(periods: int = Query(30, ge=1, le=180)):
    sales = load_sales().copy()
    # aggregate daily revenue
    daily = sales.groupby(sales['date'].dt.date)['sales_value'].sum().reset_index()
    daily.columns = ['ds','y']

    if PROPHET_AVAILABLE and len(daily) > 5:
        m = Prophet()
        m.fit(daily)
        future = m.make_future_dataframe(periods=periods)
        fc = m.predict(future)[['ds','yhat','yhat_lower','yhat_upper']]
        return fc.to_dict(orient='list')
    else:
        # simple naive forecast: last value repeated
        last_value = daily['y'].iloc[-1]
        last_date = pd.to_datetime(daily['ds'].iloc[-1])
        future_dates = [last_date + timedelta(days=i) for i in range(1, periods+1)]
        fc = pd.DataFrame({'ds': future_dates, 'yhat': [last_value]*periods, 'yhat_lower':[last_value]*periods, 'yhat_upper':[last_value]*periods})
        combined = pd.concat([daily.assign(yhat=daily['y'], yhat_lower=daily['y'], yhat_upper=daily['y']), fc])
        return combined.to_dict(orient='list')
