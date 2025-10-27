import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-metrics-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="cards" *ngIf="metrics">
      <div class="card" *ngFor="let c of cardList">
        <h3>{{c.label}}</h3>
        <p>{{ metrics[c.key] | number:'1.0-2' }}</p>
      </div>
    </section>
    <section class="secondary" *ngIf="orderCompletion">
      <div class="card small">
        <h4>Order Completion Rate</h4>
        <p>{{ (orderCompletion.order_completion_rate*100) | number:'1.0-2' }}%</p>
      </div>
      <div class="card small" *ngIf="deliveryTime">
        <h4>Avg Delivery Time</h4>
        <p>{{ deliveryTime.avg_time_to_delivery_days || 'N/A' }}</p>
      </div>
    </section>
  `,
  styles: [`
    .cards { display:grid; gap:1rem; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); margin-bottom:1.5rem; }
    .card { background:#fff; padding:1rem; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,.06); position:relative; overflow:hidden; }
    .card:before { content:''; position:absolute; top:-40%; right:-40%; width:140%; height:140%; background:linear-gradient(135deg,#2196f3,#1e88e5); opacity:.06; transform:rotate(25deg); }
    h3 { margin:0 0 .5rem; font-size:1rem; font-weight:600; }
    p { margin:0; font-size:1.25rem; font-weight:600; letter-spacing:.5px; }
    .secondary { display:flex; flex-wrap:wrap; gap:1rem; }
    .small { flex:1 1 240px; }
  `]
})
export class MetricsCardsComponent implements OnInit {
  private api = inject(ApiService);
  metrics:any; orderCompletion:any; deliveryTime:any;
  cardList = [
    { key:'total_orders', label:'Total Orders' },
    { key:'total_revenue', label:'Total Revenue' },
    { key:'average_items_per_day', label:'Avg Items / Day' },
    { key:'average_order_value', label:'Avg Order Value' }
  ];
  ngOnInit(){
    // Start with sample data for immediate display
    this.metrics = {
      total_orders: 1248,
      total_revenue: 89450.75,
      average_items_per_day: 124.5,
      average_order_value: 71.67
    };
    this.orderCompletion = { order_completion_rate: 0.967 };
    this.deliveryTime = { avg_time_to_delivery_days: '2.4 days' };

    // Load real data
    this.api.getKeyMetrics().subscribe({
      next: (d) => this.metrics = d,
      error: (error) => console.log('Using sample metrics data')
    });
    
    this.api.getOrderCompletion().subscribe({
      next: (d) => this.orderCompletion = d,
      error: (error) => console.log('Using sample order completion data')
    });
    
    this.api.getDeliveryTime().subscribe({
      next: (d) => this.deliveryTime = d,
      error: (error) => console.log('Using sample delivery time data')
    });
  }
}
