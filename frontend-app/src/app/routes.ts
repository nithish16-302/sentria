import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MetricsCardsComponent } from './components/metrics-cards/metrics-cards.component';
import { SentimentTrendComponent } from './components/sentiment-trend/sentiment-trend.component';
import { SalesForecastComponent } from './components/sales-forecast/sales-forecast.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'metrics', component: MetricsCardsComponent },
  { path: 'sentiment', component: SentimentTrendComponent },
  { path: 'forecast', component: SalesForecastComponent },
  { path: '**', redirectTo: '' }
];
