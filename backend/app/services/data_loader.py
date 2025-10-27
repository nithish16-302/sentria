import pandas as pd
from pathlib import Path
from functools import lru_cache

BASE_DIR = Path(__file__).resolve().parents[3]
SALES_CSV = 'https://github.com/nithish16-302/sentria/blob/master/backend/synthetic_us_retail_apparel_sales.csv'
SENTIMENT_CSV = 'https://github.com/nithish16-302/sentria/blob/master/backend/social_media_sentiment_ads_10000.csv'

@lru_cache(maxsize=1)
def load_sales():
    df = pd.read_csv(SALES_CSV, parse_dates=['date'])
    return df

@lru_cache(maxsize=1)
def load_sentiment():
    df = pd.read_csv(SENTIMENT_CSV, parse_dates=['timestamp'])
    return df
