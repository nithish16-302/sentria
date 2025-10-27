# Angular Frontend (Skeleton)

Run `ng new` outside this environment or initialize manually. Below is a suggested structure and sample service/component code you can place into an Angular CLI project.

## Suggested Components
- metrics-dashboard
- sentiment-trend
- sales-forecast

## API Base URL
Set environment.ts: `apiBase: 'http://localhost:8000'`

## Sample Service (metrics.service.ts)
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private base = 'http://localhost:8000';
  constructor(private http: HttpClient) {}
  getKeyMetrics(): Observable<any> { return this.http.get(`${this.base}/metrics/key`); }
  getOrderCompletionRate(): Observable<any> { return this.http.get(`${this.base}/metrics/order_completion_rate`); }
  getTimeToDelivery(): Observable<any> { return this.http.get(`${this.base}/metrics/time_to_delivery`); }
  getSentimentTrend(): Observable<any> { return this.http.get(`${this.base}/sentiment/trend`); }
  getSalesForecast(days=30): Observable<any> { return this.http.get(`${this.base}/forecast/sales?periods=${days}`); }
}
```

## Example Metrics Component Template
```html
<div *ngIf="metrics">
  <h2>Key Metrics</h2>
  <div class="grid">
    <div>Total Orders: {{ metrics.total_orders }}</div>
    <div>Total Revenue: {{ metrics.total_revenue | number:'1.0-2' }}</div>
    <div>Avg Items / Day: {{ metrics.average_items_per_day | number:'1.0-2' }}</div>
    <div>Avg Order Value: {{ metrics.average_order_value | number:'1.0-2' }}</div>
  </div>
</div>
```

## Charting
Use `ng2-charts` or `ngx-echarts` to render sentiment and forecast line charts. Map API data to datasets.
