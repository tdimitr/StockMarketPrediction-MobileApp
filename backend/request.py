import requests


FLASK_SERVER_URL = "http://127.0.0.1:5000/stock"  

def fetch_stock_data(symbol):
    
    response = requests.get(f"{FLASK_SERVER_URL}/{symbol}")
    
    if response.status_code == 200:
       
        return response.json()
    else:
        
        print(f"Error: Unable to fetch data for {symbol}. Status code: {response.status_code}")
        return None


if __name__ == "__main__":
    symbol = "NVDA"  
    stock_data = fetch_stock_data(symbol)
    
    if stock_data:
        print(stock_data) 
