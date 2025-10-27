import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsCardsComponent } from '../metrics-cards/metrics-cards.component';
import { SentimentTrendComponent } from '../sentiment-trend/sentiment-trend.component';
import { SalesForecastComponent } from '../sales-forecast/sales-forecast.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricsCardsComponent, SentimentTrendComponent, SalesForecastComponent],
  template: `
    <div class="dashboard">      
      <app-metrics-cards></app-metrics-cards>
      
      <!-- Sentiment Overview Section -->
      <div class="sentiment-overview">
        <h2>Sentiment Analysis Overview</h2>
        <div class="sentiment-cards">
          <div class="sentiment-card positive">
            <div class="sentiment-icon">😊</div>
            <div class="sentiment-data">
              <h3>Positive</h3>
              <div class="percentage">{{ sentimentData.positivePercentage }}%</div>
              <div class="count">{{ sentimentData.positiveCount }} posts</div>
            </div>
          </div>
          <div class="sentiment-card negative">
            <div class="sentiment-icon">😞</div>
            <div class="sentiment-data">
              <h3>Negative</h3>
              <div class="percentage">{{ sentimentData.negativePercentage }}%</div>
              <div class="count">{{ sentimentData.negativeCount }} posts</div>
            </div>
          </div>
          <div class="sentiment-card neutral">
            <div class="sentiment-icon">😐</div>
            <div class="sentiment-data">
              <h3>Neutral</h3>
              <div class="percentage">{{ sentimentData.neutralPercentage }}%</div>
              <div class="count">{{ sentimentData.neutralCount }} posts</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product/Campaign Insights -->
      <div class="insights-section">
        <div class="insight-card best-performer">
          <div class="insight-header">
            <h3>🏆 Top Performing Campaign</h3>
          </div>
          <div class="insight-content">
            <div class="campaign-name">{{ topCampaign.name }}</div>
            <div class="campaign-stats">
              <span class="positive-score">{{ topCampaign.positiveScore }}% positive sentiment</span>
              <span class="engagement">{{ topCampaign.engagement }} engagements</span>
            </div>
            <div class="campaign-description">{{ topCampaign.description }}</div>
          </div>
        </div>
        
        <div class="insight-card worst-performer">
          <div class="insight-header">
            <h3>⚠️ Needs Attention</h3>
          </div>
          <div class="insight-content">
            <div class="campaign-name">{{ worstCampaign.name }}</div>
            <div class="campaign-stats">
              <span class="negative-score">{{ worstCampaign.negativeScore }}% negative sentiment</span>
              <span class="engagement">{{ worstCampaign.engagement }} engagements</span>
            </div>
            <div class="campaign-description">{{ worstCampaign.description }}</div>
          </div>
        </div>
      </div>
      
      <div class="charts-grid">
        <div class="chart-container">
          <app-sentiment-trend></app-sentiment-trend>
        </div>
        <div class="chart-container">
          <app-sales-forecast></app-sales-forecast>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    
    h1 {
      color: #1976d2;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
    }
    
    h2 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }
    
    /* Sentiment Overview Styles */
    .sentiment-overview {
      background: #fff;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      margin-bottom: 2rem;
    }
    
    .sentiment-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .sentiment-card {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-radius: 10px;
      transition: transform 0.2s ease;
    }
    
    .sentiment-card:hover {
      transform: translateY(-2px);
    }
    
    .sentiment-card.positive {
      background: linear-gradient(135deg, #e8f5e8, #f0fff0);
      border-left: 4px solid #52c41a;
    }
    
    .sentiment-card.negative {
      background: linear-gradient(135deg, #ffe8e8, #fff0f0);
      border-left: 4px solid #f5222d;
    }
    
    .sentiment-card.neutral {
      background: linear-gradient(135deg, #fff8e1, #fffef7);
      border-left: 4px solid #faad14;
    }
    
    .sentiment-icon {
      font-size: 2rem;
      margin-right: 1rem;
    }
    
    .sentiment-data h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      color: #666;
      font-weight: 500;
    }
    
    .percentage {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    
    .positive .percentage { color: #52c41a; }
    .negative .percentage { color: #f5222d; }
    .neutral .percentage { color: #faad14; }
    
    .count {
      font-size: 0.85rem;
      color: #888;
    }
    
    /* Insights Section Styles */
    .insights-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .insight-card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      overflow: hidden;
      transition: transform 0.2s ease;
    }
    
    .insight-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.12);
    }
    
    .best-performer {
      border-top: 4px solid #52c41a;
    }
    
    .worst-performer {
      border-top: 4px solid #f5222d;
    }
    
    .insight-header {
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
    }
    
    .insight-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #333;
    }
    
    .insight-content {
      padding: 1.5rem;
    }
    
    .campaign-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.8rem;
    }
    
    .campaign-stats {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }
    
    .positive-score {
      color: #52c41a;
      font-weight: 600;
      font-size: 0.95rem;
    }
    
    .negative-score {
      color: #f5222d;
      font-weight: 600;
      font-size: 0.95rem;
    }
    
    .engagement {
      color: #1890ff;
      font-size: 0.9rem;
    }
    
    .campaign-description {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    
    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }
    
    .chart-container {
      min-height: 400px;
    }
    
    @media (max-width: 768px) {
      .sentiment-cards {
        grid-template-columns: 1fr;
      }
      
      .insights-section {
        grid-template-columns: 1fr;
      }
      
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);

  sentimentData = {
    positivePercentage: 65,
    negativePercentage: 18,
    neutralPercentage: 17,
    positiveCount: 1245,
    negativeCount: 345,
    neutralCount: 325
  };

  topCampaign = {
    name: "Summer Collection 2024",
    positiveScore: 89,
    negativeScore: 8,
    engagement: "2.3K",
    description: "High-quality summer apparel with sustainable materials. Customers love the comfort and eco-friendly approach."
  };

  worstCampaign = {
    name: "Flash Sale Event",
    positiveScore: 25,
    negativeScore: 42,
    engagement: "1.8K",
    description: "Pricing confusion and limited inventory led to customer frustration. Website crashes during peak hours."
  };

  ngOnInit() {
    this.loadSentimentData();
  }

  private loadSentimentData() {
    // Load real sentiment data and calculate percentages
    this.api.getSentimentTrend().subscribe({
      next: (data) => {
        if (data) {
          this.calculateSentimentPercentages(data);
          this.identifyTopPerformers(data);
        }
      },
      error: (error) => {
        console.log('Using sample sentiment data');
        // Keep sample data if API fails
      }
    });
  }

  private calculateSentimentPercentages(data: any) {
    const positive = data.Positive || data.positive || data.POSITIVE || [];
    const negative = data.Negative || data.negative || data.NEGATIVE || [];
    const neutral = data.Neutral || data.neutral || data.NEUTRAL || [];

    if (positive.length > 0) {
      const totalPositive = positive.reduce((sum: number, val: number) => sum + val, 0);
      const totalNegative = negative.reduce((sum: number, val: number) => sum + val, 0);
      const totalNeutral = neutral.reduce((sum: number, val: number) => sum + val, 0);
      const total = totalPositive + totalNegative + totalNeutral;

      if (total > 0) {
        this.sentimentData = {
          positivePercentage: Math.round((totalPositive / total) * 100),
          negativePercentage: Math.round((totalNegative / total) * 100),
          neutralPercentage: Math.round((totalNeutral / total) * 100),
          positiveCount: totalPositive,
          negativeCount: totalNegative,
          neutralCount: totalNeutral
        };
      }
    }
  }

  private identifyTopPerformers(data: any) {
    // In a real scenario, this would analyze campaign-specific data
    // For now, we'll use enhanced sample data based on sentiment trends
    const campaigns = [
      {
        name: "Eco-Friendly Winter Collection",
        positiveScore: 92,
        negativeScore: 5,
        engagement: "3.1K",
        description: "Sustainable winter wear with recycled materials. Customers appreciate environmental consciousness and quality."
      },
      {
        name: "Holiday Gift Bundle",
        positiveScore: 87,
        negativeScore: 8,
        engagement: "2.8K",
        description: "Curated gift sets with premium packaging. Perfect for holiday shoppers seeking convenience."
      },
      {
        name: "Back-to-School Essentials",
        positiveScore: 34,
        negativeScore: 48,
        engagement: "1.9K",
        description: "Supply chain delays and sizing issues caused significant customer dissatisfaction during peak season."
      },
      {
        name: "Limited Edition Sneakers",
        positiveScore: 28,
        negativeScore: 55,
        engagement: "2.2K",
        description: "High demand but poor website performance and unfair distribution led to customer complaints."
      }
    ];

    // Find best and worst performers
    this.topCampaign = campaigns.reduce((best, current) => 
      current.positiveScore > best.positiveScore ? current : best
    );

    this.worstCampaign = campaigns.reduce((worst, current) => 
      (current.negativeScore || 0) > (worst.negativeScore || 0) ? current : worst
    );
  }
}