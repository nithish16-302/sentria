import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_BASE = environment.production ? environment.apiBase : '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getKeyMetrics(): Observable<any> { return this.http.get(`${API_BASE}/metrics/key`); }
  getOrderCompletion(): Observable<any> { return this.http.get(`${API_BASE}/metrics/order_completion_rate`); }
  getDeliveryTime(): Observable<any> { return this.http.get(`${API_BASE}/metrics/time_to_delivery`); }
  getSentimentTrend(): Observable<any> { return this.http.get(`${API_BASE}/sentiment/trend`); }
  getSalesForecast(days:number=30): Observable<any> { return this.http.get(`${API_BASE}/forecast/sales?periods=${days}`); }
}
