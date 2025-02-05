from flask import Blueprint, jsonify
import yfinance as yf
import requests
import base64
from io import BytesIO
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.ensemble import RandomForestRegressor
from cloudinary.uploader import upload

api_bp = Blueprint('api', __name__)

def get_logo(ticker):
    url = f"https://logo.clearbit.com/{ticker}.com"
    response = requests.get(url)
    if response.status_code == 200:
        return url
    return None

#route for popular stocks
@api_bp.route('/api/popular-stocks', methods=['GET'])
def get_popular_stocks():
    tickers = ["NVDA", "AAPL", "TSLA", "AMZN", "GOOG", "MSFT", "META", "NFLX", "AMD", "INTC"]
    logos = {
        "NVDA": "nvidia",
        "AAPL": "apple",
        "TSLA": "tesla",
        "AMZN": "amazon",
        "GOOG": "google",
        "MSFT": "microsoft",
        "META": "meta",
        "NFLX": "netflix",
        "AMD": "amd",
        "INTC": "intel"
    }

    popular_stocks = []

    for ticker in tickers:
        try:
            stock = yf.Ticker(ticker)
            stock_info = stock.info
            hist_data = stock.history(period="1mo")
            historical_prices = hist_data['Close'].tolist()

            current_price = stock_info.get("currentPrice", "N/A")
            previous_close = stock_info.get("regularMarketPreviousClose", "N/A")

            #percentage change
            if isinstance(current_price, (int, float)) and isinstance(previous_close, (int, float)):
                absolute_change = round(current_price - previous_close, 2)
                change_percent = ((current_price - previous_close) / previous_close) * 100
                change_percent = f"{change_percent:.2f}%"
            else:
                absolute_change = "N/A"
                change_percent = "N/A"

            logo_url = get_logo(logos.get(ticker, ticker))

            popular_stocks.append({
                "symbol": stock_info.get("symbol"),
                "longName": stock_info.get("longName"),
                "currentPrice": current_price,
                "absoluteChange": absolute_change,
                "changePercent": change_percent,
                "logoUrl": logo_url,
                "history": historical_prices
            })
        except Exception as e:
            print(f"Error fetching data for {ticker}: {e}")

    return jsonify(popular_stocks)

#route for graphs
@api_bp.route('/api/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    try:
        stock = yf.Ticker(symbol)
        hist_data = stock.history(period="1mo")  
        historical_data = hist_data[['Open', 'High', 'Low', 'Close', 'Volume']].to_dict('records')
        
        stock_info = stock.info
        print(stock)
       
        response = {
            'symbol': symbol,
            "longName": stock_info.get("longName"),
            'currentPrice': stock_info.get('currentPrice', 'N/A'),
            'previousClose': stock_info.get('previousClose', 'N/A'),
            'dayHigh': stock_info.get('dayHigh', 'N/A'),
            'dayLow': stock_info.get('dayLow', 'N/A'),
            'volume': stock_info.get('volume', 'N/A'),
            'marketCap': stock_info.get('marketCap', 'N/A'),
            'beta': stock_info.get('beta', 'N/A'),
            'trailingPE': stock_info.get('trailingPE', 'N/A'),
            'trailingEPS': stock_info.get('trailingEPS', 'N/A'),
            'dividendRate': stock_info.get('dividendRate', 'N/A'),
            'exDividendDate': stock_info.get('exDividendDate', 'N/A'),
            'fiftyTwoWeekHigh': stock_info.get('fiftyTwoWeekHigh', 'N/A'),
            'fiftyTwoWeekLow': stock_info.get('fiftyTwoWeekLow', 'N/A'),
            'targetMeanPrice': stock_info.get('targetMeanPrice', 'N/A'),
            'recommendationKey': stock_info.get('recommendationKey', 'N/A'),
            'historicalData': historical_data,
            'sector': stock_info.get('sector', 'N/A'),
            'industry': stock_info.get('industry', 'N/A'),
            'industryGroup': stock_info.get('industryGroup', 'N/A')
        }
        
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
# route for Linear Regression
@api_bp.route('/api/linear/<symbol>', methods=['GET'])
def linear_regression(symbol):
    # Fetch stock data
    data = yf.download(symbol, period="1y")
    if data.empty:
            return jsonify({"error": f"No data found for symbol {symbol}"}), 404
    data = data[['Close']]
    data['Date'] = data.index
    data['Days'] = np.arange(len(data))
    
    # Prepare data for model
    X = data['Days'].values.reshape(-1, 1)
    y = data['Close'].values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = LinearRegression()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    # Compute metrics
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)

    # Plot 1: Linear Regression
    plt.figure(figsize=(12, 6))
    plt.plot(data['Date'], data['Close'], label="Actual Prices", color='blue')
    plt.plot(data['Date'], model.predict(X), label="Predicted Prices", linestyle='dashed', color='orange')
    plt.title("Linear Regression Prediction")
    plt.xlabel("Date")
    plt.ylabel("Stock Price ($)")
    plt.legend()
    plt.grid()
    plt.tight_layout()

    buf1 = BytesIO()
    plt.savefig(buf1, format='png')
    buf1.seek(0)
    plt.close()

    # Plot 2: Bar Chart and Donut Chart
    fig, axs = plt.subplots(1, 2, figsize=(14, 6))
    fig.subplots_adjust(wspace=0.4)

    # Bar Chart for MAE, MSE, RMSE
    metrics = ['MAE', 'MSE', 'RMSE']
    values = [mae, mse, rmse]
    bar_width = 0.3
    bar_positions = np.arange(len(metrics))
    axs[0].bar(bar_positions, values, width=bar_width, color=['skyblue', 'orange', 'green'])
    axs[0].set_title("Error Metrics")
    axs[0].set_ylabel("Value")
    axs[0].set_xticks(bar_positions)
    axs[0].set_xticklabels(metrics)
    for i, value in enumerate(values):
        axs[0].text(bar_positions[i], value + 0.02, f"{value:.2f}", ha='center', va='bottom', fontsize=10, color='black')

    # Donut Chart for R²
    labels = ['Explained', 'Unexplained']
    sizes = [r2 * 100, (1 - r2) * 100]
    colors = ['teal', 'red']
    explode = (0.1, 0)
    axs[1].pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=colors, explode=explode)
    axs[1].set_title("Explained Variance")

    buf2 = BytesIO()
    plt.savefig(buf2, format='png')
    buf2.seek(0)
    plt.close()

    # Upload plots to Cloudinary
    upload_result1 = upload(buf1, folder="stock_predictions", use_filename=True, resource_type="image")
    upload_result2 = upload(buf2, folder="stock_predictions", use_filename=True, resource_type="image")

    buf1.close()
    buf2.close()

    # Extract URLs
    linear_plot_url = upload_result1.get("secure_url")
    combined_plot_url = upload_result2.get("secure_url")

    return jsonify({
        "plot_url1": linear_plot_url,
        "plot_url2": combined_plot_url
    })



# route for SVM
@api_bp.route('/api/svm/<symbol>', methods=['GET'])
def svm_stock_prediction(symbol):
    try:
        data = yf.download(symbol, period="3mo")
        if data.empty:
            return jsonify({"error": f"No data found for symbol {symbol}"}), 404
        
        data['Date'] = data.index
        data['Day'] = np.arange(len(data))

        X = data[['Day']]
        y = data['Close'].values
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        svm = SVR(kernel='rbf', C=100, gamma=0.1, epsilon=0.1)
        svm.fit(X_train, y_train.ravel())
        predicted_prices = svm.predict(X)
        data['Predicted'] = predicted_prices

        data['Signal'] = np.where(data['Predicted'].shift(-1) > data['Predicted'], 'Buy', 'Sell')

        mae = mean_absolute_error(y, predicted_prices)
        mse = mean_squared_error(y, predicted_prices)
        rmse = np.sqrt(mse)
        r2 = r2_score(y, predicted_prices)

        # SVM prediction with buy/sell signals
        plt.figure(figsize=(14, 7))
        plt.plot(data['Date'], data['Close'], label='Actual Prices', color='blue')
        plt.plot(data['Date'], data['Predicted'], label='Predicted Prices', linestyle='dashed', color='orange')

        buy_signals = data[data['Signal'] == 'Buy']
        sell_signals = data[data['Signal'] == 'Sell']
        plt.scatter(buy_signals['Date'], buy_signals['Close'], marker='^', color='green', label='Buy Signal', alpha=1)
        plt.scatter(sell_signals['Date'], sell_signals['Close'], marker='v', color='red', label='Sell Signal', alpha=1)

        plt.title("SVM Prediction")
        plt.xlabel("Date")
        plt.ylabel("Stock Price ($)")
        plt.grid()
        plt.legend(loc='upper left', bbox_to_anchor=(0, 1), frameon=False)

        buf1 = BytesIO()
        plt.savefig(buf1, format='png')
        buf1.seek(0)
        plt.close()

        # bar chart and donut chart
        fig, axs = plt.subplots(1, 2, figsize=(14, 6))
        fig.subplots_adjust(wspace=0.4)

        metrics = ['MAE', 'MSE', 'RMSE']
        values = [mae, mse, rmse]
        bar_width = 0.3
        bar_positions = np.arange(len(metrics))
        axs[0].bar(bar_positions, values, width=bar_width, color=['skyblue', 'orange', 'green'])
        axs[0].set_title("Error Metrics")
        axs[0].set_ylabel("Value")
        axs[0].set_xticks(bar_positions)
        axs[0].set_xticklabels(metrics)
        for i, value in enumerate(values):
            axs[0].text(bar_positions[i], value + 0.02, f"{value:.2f}", ha='center', va='bottom', fontsize=10, color='black')

        labels = ['Explained', 'Unexplained']
        sizes = [r2 * 100, (1 - r2) * 100]
        colors = ['teal', 'red']
        explode = (0.1, 0)
        axs[1].pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=colors, explode=explode)
        axs[1].set_title("Explained Variance")

        buf2 = BytesIO()
        plt.savefig(buf2, format='png')
        buf2.seek(0)
        plt.close()

        # cloudinary
        upload_result1 = upload(buf1, folder="stock_predictions", use_filename=True, resource_type="image")
        upload_result2 = upload(buf2, folder="stock_predictions", use_filename=True, resource_type="image")

        buf1.close()
        buf2.close()

        svm_plot_url = upload_result1.get("secure_url")
        combined_plot_url = upload_result2.get("secure_url")

        return jsonify({
            "plot_url1": svm_plot_url,
            "plot_url2": combined_plot_url
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# route for Random Forest
@api_bp.route('/api/random/<symbol>', methods=['GET'])
def random_forest_stock_prediction(symbol):
    try:
        data = yf.download(symbol, period="3mo")
        if data.empty:
            return jsonify({"error": f"No data found for symbol {symbol}"}), 404

        data['Date'] = data.index
        data['Day'] = np.arange(len(data))

        X = data[['Day']]
        y = data['Close'].values
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        rf = RandomForestRegressor(n_estimators=100, random_state=42)
        rf.fit(X_train, y_train.ravel())
        predicted_prices = rf.predict(X)
        data['Predicted'] = predicted_prices

        data['Signal'] = np.where(data['Predicted'].shift(-1) > data['Predicted'], 'Buy', 'Sell')

        mae = mean_absolute_error(y, predicted_prices)
        mse = mean_squared_error(y, predicted_prices)
        rmse = np.sqrt(mse)
        r2 = r2_score(y, predicted_prices)

        #random forest plot
        plt.figure(figsize=(14, 7))
        plt.plot(data['Date'], data['Close'], label="Actual Prices", color='blue')
        plt.plot(data['Date'], data['Predicted'], label="Predicted Prices", linestyle='dashed', color='orange')

        buy_signals = data[data['Signal'] == 'Buy']
        sell_signals = data[data['Signal'] == 'Sell']
        plt.scatter(buy_signals['Date'], buy_signals['Close'], marker='^', color='green', label='Buy Signal', alpha=1)
        plt.scatter(sell_signals['Date'], sell_signals['Close'], marker='v', color='red', label='Sell Signal', alpha=1)

        plt.title("Random Forest Prediction")
        plt.xlabel("Date")
        plt.ylabel("Stock Price ($)")
        plt.grid()
        plt.legend(loc='upper left', bbox_to_anchor=(0, 1), frameon=False)
        plt.tight_layout()

        buf1 = BytesIO()
        plt.savefig(buf1, format='png')
        buf1.seek(0)
        plt.close()

        #bar chart plot & donut chart
        fig, axs = plt.subplots(1, 2, figsize=(14, 6))
        fig.subplots_adjust(wspace=0.4)

        metrics = ['MAE', 'MSE', 'RMSE']
        values = [mae, mse, rmse]
        bar_width = 0.3
        bar_positions = np.arange(len(metrics))
        axs[0].bar(bar_positions, values, width=bar_width, color=['skyblue', 'orange', 'green'])
        axs[0].set_title("Error Metrics")
        axs[0].set_ylabel("Value")
        axs[0].set_xticks(bar_positions)
        axs[0].set_xticklabels(metrics)
        for i, value in enumerate(values):
            axs[0].text(bar_positions[i], value + 0.02, f"{value:.2f}", ha='center', va='bottom', fontsize=10, color='black')

        labels = ['Explained', 'Unexplained']
        sizes = [r2 * 100, (1 - r2) * 100]
        colors = ['teal', 'red']
        explode = (0.1, 0)
        axs[1].pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=colors, explode=explode)
        axs[1].set_title("Explained Variance")

        buf2 = BytesIO()
        plt.savefig(buf2, format='png')
        buf2.seek(0)
        plt.close()

        # cloudinary
        upload_result1 = upload(buf1, folder="stock_predictions", use_filename=True, resource_type="image")
        upload_result2 = upload(buf2, folder="stock_predictions", use_filename=True, resource_type="image")

        buf1.close()
        buf2.close()

        rf_plot_url = upload_result1.get("secure_url")
        combined_plot_url = upload_result2.get("secure_url")

        return jsonify({
            "plot_url1": rf_plot_url,
            "plot_url2": combined_plot_url
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
