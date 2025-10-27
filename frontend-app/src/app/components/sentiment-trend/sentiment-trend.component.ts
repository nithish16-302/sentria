import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sentiment-trend',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel">
      <h2>Sentiment Trend</h2>
      <div *ngIf="!hasData" class="loading">Loading sentiment data...</div>
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
    .chart-container { 
      height: 350px; 
      width: 100%; 
    }
    .loading { 
      display: flex;
      align-items: center;
      justify-content: center;
      height: 300px;
      color: #666; 
      font-style: italic;
    }
  `]
})
export class SentimentTrendComponent implements OnInit, AfterViewInit, OnDestroy {
  private api = inject(ApiService);
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;
  private chart: any;
  hasData = false;

  ngOnInit() {
    // Start with sample data to test chart rendering
    this.renderSampleChart();
  }

  ngAfterViewInit() {
    // Load real data after view is initialized
    setTimeout(() => this.loadRealData(), 1000);
  }

  private renderSampleChart() {
    setTimeout(() => {
      const echarts = (window as any).echarts;
      if (!echarts || !this.chartContainer) {
        console.log('ECharts not ready, retrying...');
        setTimeout(() => this.renderSampleChart(), 500);
        return;
      }

      this.hasData = true;
      const el = this.chartContainer.nativeElement;
      this.chart = echarts.init(el);

      // Sample data for testing
      const sampleData = {
        dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
        positive: [45, 52, 38, 67, 58],
        negative: [12, 18, 25, 15, 20],
        neutral: [33, 30, 37, 18, 22]
      };

      this.chart.setOption({
        title: {
          text: 'Social Media Sentiment',
          left: 'center',
          textStyle: { fontSize: 16, color: '#333' }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#ccc',
          textStyle: { color: '#333' }
        },
        legend: {
          data: ['Positive', 'Negative', 'Neutral'],
          bottom: 20
        },
        grid: {
          left: 60,
          right: 40,
          top: 60,
          bottom: 80,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: sampleData.dates,
          axisLabel: { color: '#666' }
        },
        yAxis: {
          type: 'value',
          name: 'Posts Count',
          axisLabel: { color: '#666' },
          nameTextStyle: { color: '#666' }
        },
        series: [
          {
            name: 'Positive',
            type: 'line',
            smooth: true,
            data: sampleData.positive,
            lineStyle: { color: '#52c41a', width: 3 },
            itemStyle: { color: '#52c41a' },
            areaStyle: { opacity: 0.1, color: '#52c41a' }
          },
          {
            name: 'Negative',
            type: 'line',
            smooth: true,
            data: sampleData.negative,
            lineStyle: { color: '#f5222d', width: 3 },
            itemStyle: { color: '#f5222d' },
            areaStyle: { opacity: 0.1, color: '#f5222d' }
          },
          {
            name: 'Neutral',
            type: 'line',
            smooth: true,
            data: sampleData.neutral,
            lineStyle: { color: '#faad14', width: 3 },
            itemStyle: { color: '#faad14' },
            areaStyle: { opacity: 0.1, color: '#faad14' }
          }
        ]
      });

      this.chart.resize();
      window.addEventListener('resize', this.handleResize, { passive: true });
    }, 100);
  }

  private loadRealData() {
    this.api.getSentimentTrend().subscribe({
      next: (data) => {
        if (data && this.chart) {
          this.updateChartWithRealData(data);
        }
      },
      error: (error) => {
        console.error('Failed to load sentiment data:', error);
        // Keep sample data if API fails
      }
    });
  }

  private updateChartWithRealData(data: any) {
    const dates = data.date || [];
    const positive = data.Positive || data.positive || data.POSITIVE || [];
    const negative = data.Negative || data.negative || data.NEGATIVE || [];
    const neutral = data.Neutral || data.neutral || data.NEUTRAL || [];

    if (dates.length > 0 && this.chart) {
      this.chart.setOption({
        xAxis: { data: dates },
        series: [
          { data: positive },
          { data: negative },
          { data: neutral }
        ]
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
