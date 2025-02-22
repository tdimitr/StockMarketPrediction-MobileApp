# 📈 Stock Market Prediction App

Welcome to the **Stock Market Prediction App**, where you can track the latest trends in the stock market, view cryptocurrency prices, and convert currencies. With predictions powered by machine learning algorithms, this mobile app is your perfect companion for financial insights.

## App Features

### **Tabs**

1. **Market** 📉:  
   View real-time stock market data.

2. **Predictions** 📊:  
   Get future stock price predictions.

3. **Converter** 💱:  
   Convert currencies with up-to-date exchange rates.  
   Supported currencies: 🇺🇸 🇪🇺 🇯🇵 🇬🇧 🇦🇺 🇨🇦 🇨🇭 🇨🇳 🇮🇳 🇳🇿 🇷🇺

4. **Cryptos** 💎:  
   Stay updated on the latest cryptocurrency market data, including price fluctuations and trends.

### **Predictions**

We implement 3 algorithms to predict stock market trends:

- **Linear Regression**: Predict future stock prices based on historical data.
- **SVM (Support Vector Machine)**: Classify data points for more accurate predictions.
- **Random Forests**: Improve accuracy by combining multiple decision trees for robust results.

These algorithms are implemented using **scikit-learn** and trained in **Jupyter Notebooks** for the best performance.

### 💻 **Tech Stack**

- **React Native (Expo)** 📱: For mobile app development.
- **Flask**: Python server for handling API requests and processing predictions.

### 📸 **_Screenshots_**

<div style="display: flex; justify-content: space-around; gap: 10px;">
  <img src="https://raw.githubusercontent.com/tdimitr/StockMarketPrediction-MobileApp/master/images/market1.png" width="200" />
  <img src="https://raw.githubusercontent.com/tdimitr/StockMarketPrediction-MobileApp/master/images/prediction4.png" width="200" />
  <img src="https://raw.githubusercontent.com/tdimitr/StockMarketPrediction-MobileApp/master/images/converter2.png" width="200" />
  <img src="https://raw.githubusercontent.com/tdimitr/StockMarketPrediction-MobileApp/master/images/cryptos1.png" width="200" />
</div>

## 🖥️ Installation

1. Clone the repository:

```
git clone https://github.com/tdimitr/StockMarketPrediction-MobileApp.git
```

2. Configuration:

- Configure Cloudinary credentials in the `.env.template`.
- Rename `backend/.env.template` to `.env`.
- Update `<EXCHANGERATE_KEY>` from `frontend/app.json` with your API key from [ExchangeRate-API](https://www.exchangerate-api.com/).

3. Set up the backend:

```
~$ cd backend
~$ pip install -r requirements.txt
~$ python app.py
```

3. Set up the frontend:

```
~$ cd frontend
~$ npm install
~$ npm start
```
