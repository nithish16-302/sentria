from fastapi import APIRouter
from ..services.data_loader import load_sentiment

router = APIRouter()

@router.get("/trend")
async def sentiment_trend():
    df = load_sentiment()
    df['date'] = df['timestamp'].dt.date
    trend = df.groupby(['date','sentiment_label']).size().unstack(fill_value=0)
    trend = trend.reset_index().sort_values('date')
    return trend.to_dict(orient='list')
