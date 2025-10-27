# Backend API

FastAPI service exposing retail metrics, forecasting, and sentiment trend endpoints.

## Endpoints
- GET /metrics/key
- GET /metrics/order_completion_rate
- GET /metrics/time_to_delivery
- GET /forecast/sales?periods=30
- GET /sentiment/trend

## Run
Install dependencies then start server.
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
