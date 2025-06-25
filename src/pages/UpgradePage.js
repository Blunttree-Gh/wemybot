import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpgradePage = () => {
  const [email, setEmail] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);

  const USD_MONTHLY = 15;
  const USD_YEARLY = 170;

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await axios.get('https://open.er-api.com/v6/latest/USD');
        const rate = res.data.rates.GHS;
        setExchangeRate(rate);
        setLoading(false);
      } catch (err) {
        console.error('Exchange rate fetch error:', err);
        setLoading(false);
      }
    };

    fetchRate();
  }, []);

  const handlePay = async (ghsAmount) => {
    try {
      const res = await fetch('http://localhost:5000/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount: ghsAmount }),
      });

      const data = await res.json();
      if (data?.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        alert('❌ Payment initialization failed.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('❌ Payment failed.');
    }
  };

  return (
    <div className="App-header">
      <h2>💎 Upgrade to Premium</h2>
      <p>Enter your email to start the payment process:</p>
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {loading ? (
        <p>Fetching live USD→GHS rate...</p>
      ) : (
        <>
          <button
            onClick={() => handlePay(Math.round(USD_MONTHLY * exchangeRate))}
          >
            Pay ₵{Math.round(USD_MONTHLY * exchangeRate)} for 1 Month
          </button>
          <br />
          <button
            onClick={() => handlePay(Math.round(USD_YEARLY * exchangeRate))}
            style={{ marginTop: 10 }}
          >
            Pay ₵{Math.round(USD_YEARLY * exchangeRate)} for 1 Year
          </button>
        </>
      )}
    </div>
  );
};

export default UpgradePage;
