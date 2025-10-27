# Retail Analytics Angular Frontend

A modern, responsive Angular (standalone components) UI for metrics, sentiment trend, and sales forecast.

## Features
- Standalone components (Angular 17 style)
- Responsive CSS grid / flex layout
- Chart.js dynamic import for reduced initial bundle size
- Environment config for API base
- Reusable API service

## Components
- MetricsCardsComponent: Key metrics + completion & delivery placeholders
- SentimentTrendComponent: Multi-line sentiment counts
- SalesForecastComponent: Forecast line chart with adjustable future window

## Development
Install dependencies then start dev server.
```
npm install
npm start
```
Backend expected at http://127.0.0.1:8000

To change API base, edit `src/environments/environment.ts`.

## Build
```
npm run build
```
Artifacts in `dist/retail-analytics-ui`.
