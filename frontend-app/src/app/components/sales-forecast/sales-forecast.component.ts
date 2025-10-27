import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sales-forecast',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="panel">
      <h2>Sales Forecast</h2>
      <div class="controls">
        <label>Forecast Days: 
          <select [(ngModel)]="forecastDays" (change)="updateForecast()">
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
          </select>
        </label>
      </div>
      <div *ngIf="!hasData" class="loading">Loading forecast data...</div>
      <div #chartContainer class="chart-container"></div>
    </div>
  `,
  styles: [`
    .panel { 
      background: #fff; 
      padding: 1.5rem; 
      border-radius: 12px; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
      height: 100%;
    }
    h2 { 
      margin: 0 0 1rem 0; 
      font-size: 1.2rem; 
      color: #333;
    }
    .controls {
      margin-bottom: 1rem;
    }
    .controls select {
      padding: 0.4rem 0.8rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
      margin-left: 0.5rem;
    }
    .chart-container { 
      height: 320px; 
      width: 100%; 
    }
    .loading { 
      display: flex;
      align-items: center;
      justify-content: center;
      height: 280px;
      color: #666; 
      font-style: italic;
    }
  `]
})
export class SalesForecastComponent implements OnInit, AfterViewInit, OnDestroy {
  private api = inject(ApiService);
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;
  private chart: any;
  hasData = false;
  forecastDays = 30;

  ngOnInit() {
    // Start with sample data
    this.renderSampleChart();
  }

  ngAfterViewInit() {
    // Load real data after view is initialized
    setTimeout(() => this.loadRealData(), 1500);
  }

  private renderSampleChart() {
    setTimeout(() => {
      const echarts = (window as any).echarts;
      if (!echarts || !this.chartContainer) {
        console.log('ECharts not ready for forecast, retrying...');
        setTimeout(() => this.renderSampleChart(), 500);
        return;
      }

      this.hasData = true;
      const el = this.chartContainer.nativeElement;
      this.chart = echarts.init(el);

      // Generate sample forecast data
      const baseDate = new Date();
      const sampleData = this.generateSampleForecastData(this.forecastDays);

      this.chart.setOption({
        title: {
          text: 'Revenue Forecast',
          left: 'center',
          textStyle: { fontSize: 16, color: '#333' }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#ccc',
          textStyle: { color: '#333' },
          formatter: (params: any) => {
            const point = params[0];
            return `${point.axisValue}<br/>Revenue: $${point.value.toLocaleString()}`;
          }
        },
        grid: {
          left: 80,
          right: 40,
          top: 60,
          bottom: 60,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: sampleData.dates,
          axisLabel: { 
            color: '#666',
            rotate: sampleData.dates.length > 20 ? 45 : 0
          }
        },
        yAxis: {
          type: 'value',
          name: 'Revenue ($)',
          axisLabel: { 
            color: '#666',
            formatter: (value: number) => '$' + (value / 1000).toFixed(0) + 'K'
          },
          nameTextStyle: { color: '#666' }
        },
        dataZoom: [
          { type: 'inside', start: 0, end: 100 },
          { type: 'slider', start: 0, end: 100, height: 20 }
        ],
        series: [
          {
            name: 'Revenue Forecast',
            type: 'line',
            smooth: true,
            data: sampleData.values,
            lineStyle: { color: '#1890ff', width: 3 },
            itemStyle: { color: '#1890ff' },
            areaStyle: { 
              opacity: 0.15, 
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#1890ff' },
                  { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
                ]
              }
            },
            showSymbol: false
          }
        ]
      });

      this.chart.resize();
      window.addEventListener('resize', this.handleResize, { passive: true });
    }, 100);
  }

  private generateSampleForecastData(days: number) {
    const dates = [];
    const values = [];
    const baseDate = new Date();
    let baseValue = 25000; // Starting revenue

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + i);
      dates.push(currentDate.toISOString().split('T')[0]);
      
      // Generate trending upward with some variance
      const trend = i * 150; // Upward trend
      const variance = Math.sin(i * 0.1) * 2000 + Math.random() * 1000 - 500;
      values.push(Math.max(baseValue + trend + variance, 15000));
    }

    return { dates, values };
  }

  updateForecast() {
    this.hasData = false;
    setTimeout(() => {
      const sampleData = this.generateSampleForecastData(this.forecastDays);
      if (this.chart) {
        this.chart.setOption({
          xAxis: { data: sampleData.dates },
          series: [{ data: sampleData.values }]
        });
        this.hasData = true;
      }
    }, 300);
  }

  private loadRealData() {
    this.api.getSalesForecast(this.forecastDays).subscribe({
      next: (data) => {
        if (data && this.chart) {
          this.updateChartWithRealData(data);
        }
      },
      error: (error) => {
        console.error('Failed to load forecast data:', error);
        // Keep sample data if API fails
      }
    });
  }

  private updateChartWithRealData(data: any) {
    const dates = data.ds || [];
    const values = data.yhat || [];

    if (dates.length > 0 && values.length > 0 && this.chart) {
      this.chart.setOption({
        xAxis: { data: dates },
        series: [{ data: values }]
      });
    }
  }

  private handleResize = () => {
    if (this.chart) {
      this.chart.resize();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chart) {
      this.chart.dispose();
    }
  }
}
