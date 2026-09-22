import json
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Gotti AI - Backend API", description="Data provider for Gotti Frontend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Gotti AI Backend API is running"}

@app.get("/api/stock_data")
def get_stock_data(symbol: str = "AAPL", period: str = "1y"):
    """
    Returns stock history JSON compatible with Gotti TickerChart component.
    """
    try:
        import yfinance as yf
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period)
        if not hist.empty:
            return hist.to_json()
    except Exception as e:
        print(f"Warning: Failed to fetch live data from yfinance: {e}")
        return json.dumps({"error": f"Failed to fetch live data for {symbol}"})
    
    return json.dumps({"error": "No data found"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
