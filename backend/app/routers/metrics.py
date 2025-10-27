from fastapi import APIRouter
from ..services.data_loader import load_sales

router = APIRouter()

@router.get("/key")
async def key_metrics():
    sales = load_sales()
    total_orders = len(sales)  # each row is an order line (approx substitute)
    total_revenue = float(sales['sales_value'].sum())
    avg_items_per_day = float(sales.groupby(sales['date'].dt.date)['sales_volume'].sum().mean())
    avg_order_value = float(sales['sales_value'].mean())
    return {
        'total_orders': total_orders,
        'total_revenue': total_revenue,
        'average_items_per_day': avg_items_per_day,
        'average_order_value': avg_order_value
    }

@router.get("/order_completion_rate")
async def order_completion_rate():
    # Without explicit status data, simulate completion as 100%
    sales = load_sales()
    total_orders = len(sales)
    completed_orders = total_orders  # placeholder
    rate = completed_orders / total_orders if total_orders else 0
    return {"order_completion_rate": rate}

@router.get("/time_to_delivery")
async def time_to_delivery():
    # No delivery timestamps provided; return placeholder metrics.
    return {"avg_time_to_delivery_days": None, "note": "Delivery timestamps not in dataset"}
