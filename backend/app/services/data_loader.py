import pandas as pd
from pathlib import Path
from functools import lru_cache

BASE_DIR = Path(__file__).resolve().parents[3]
SALES_CSV = 'https://raw.githubusercontent.com/nithish16-302/sentria/refs/heads/master/backend/synthetic_us_retail_apparel_sales.csv'
SENTIMENT_CSV = 'http://raw.githubusercontent.com/nithish16-302/sentria/refs/heads/master/backend/social_media_sentiment_ads_10000.csv'

@lru_cache(maxsize=1)
def load_sales():
    df = pd.read_csv(SALES_CSV)
    # Handle date column parsing with error handling
    if 'date' in df.columns:
        try:
            df['date'] = pd.to_datetime(df['date'], errors='coerce')
        except Exception as e:
            print(f"Warning: Could not parse date column - {e}")
            # If parsing fails, create a dummy date
            df['date'] = pd.to_datetime('2025-01-01')
    else:
        # If date column doesn't exist, create one
        print("Warning: No date column found, creating dummy dates")
        df['date'] = pd.to_datetime('2025-01-01')
    return df

@lru_cache(maxsize=1)
def load_sentiment():
    df = pd.read_csv(SENTIMENT_CSV)
    # Handle timestamp column parsing with error handling
    if 'timestamp' in df.columns:
        try:
            df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
        except Exception as e:
            print(f"Warning: Could not parse timestamp column - {e}")
            # If parsing fails, create a dummy timestamp
            df['timestamp'] = pd.to_datetime('2025-01-01')
    else:
        # If timestamp column doesn't exist, create one
        print("Warning: No timestamp column found, creating dummy timestamps")
        df['timestamp'] = pd.to_datetime('2025-01-01')
    return df

