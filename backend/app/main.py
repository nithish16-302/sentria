import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from .routers import metrics, sentiment, forecast

app = FastAPI(
    title="Retail Analytics & Sentiment API",
    description="A comprehensive API for retail analytics and social media sentiment analysis",
    version="1.0.0"
)

# Configure CORS for production
allowed_origins = [
    "http://localhost:4200",
    "http://localhost:3000", 
    "https://*.vercel.app",
    "https://*.netlify.app",
    "https://*.railway.app"
]

if os.getenv("FRONTEND_URL"):
    allowed_origins.append(os.getenv("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins + ["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
app.include_router(sentiment.router, prefix="/sentiment", tags=["sentiment"])
app.include_router(forecast.router, prefix="/forecast", tags=["forecast"])

# Mount static directory if exists
try:
        app.mount("/static", StaticFiles(directory="static"), name="static")
except Exception:
        pass

INDEX_HTML = """
<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\" />
    <title>Retail Analytics Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 12px; }
        .card { background:#f5f5f5; padding:12px; border-radius:8px; box-shadow: 0 1px 3px rgba(0,0,0,.1);} 
        canvas { max-width: 100%; }
    </style>
</head>
<body>
    <h1>Retail Analytics Dashboard</h1>
    <section>
        <h2>Key Metrics</h2>
        <div id="metrics" class="grid"></div>
    </section>
    <section>
        <h2>Sentiment Trend</h2>
        <canvas id="sentimentChart" height="120"></canvas>
    </section>
    <section>
        <h2>Sales Forecast (Revenue)</h2>
        <canvas id="forecastChart" height="120"></canvas>
    </section>
    <script>
        const base = '';
        async function loadMetrics(){
            const r = await fetch(base + '/metrics/key');
            const d = await r.json();
            const container = document.getElementById('metrics');
            container.innerHTML = Object.entries(d).map(([k,v])=>`<div class='card'><strong>${k}</strong><br>${typeof v==='number'? v.toLocaleString(): v}</div>`).join('');
        }
        async function loadSentiment(){
            const r = await fetch(base + '/sentiment/trend');
            const d = await r.json();
            const labels = d.date.map(dt=> dt);
            const pos = d.Positive || d.POSITIVE || Array(labels.length).fill(0);
            const neg = d.Negative || d.NEGATIVE || Array(labels.length).fill(0);
            const neu = d.Neutral || d.NEUTRAL || Array(labels.length).fill(0);
            new Chart(document.getElementById('sentimentChart'), { type:'line', data:{ labels, datasets:[
                {label:'Positive', data: pos, borderColor:'green', fill:false},
                {label:'Negative', data: neg, borderColor:'red', fill:false},
                {label:'Neutral', data: neu, borderColor:'gray', fill:false}
            ]}, options:{ responsive:true, interaction:{mode:'index',intersect:false}, stacked:false }});
        }
        async function loadForecast(){
            const r = await fetch(base + '/forecast/sales?periods=30');
            const d = await r.json();
            const labels = d.ds.map(x=> x);
            const yhat = d.yhat;
            new Chart(document.getElementById('forecastChart'), { type:'line', data:{ labels, datasets:[
                {label:'Forecast', data: yhat, borderColor:'#1976d2', fill:false}
            ]}, options:{ responsive:true, interaction:{mode:'index',intersect:false}}});
        }
        loadMetrics(); loadSentiment(); loadForecast();
    </script>
</body>
</html>
"""

@app.get("/", response_class=HTMLResponse)
async def root():
        return HTMLResponse(INDEX_HTML)
