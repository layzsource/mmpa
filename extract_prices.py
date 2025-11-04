"""
Extract price data from Sigma_R backtest results for JavaScript validation.
Reconstructs prices from log returns.
"""
import pandas as pd
import numpy as np

# Read the full backtest results
df = pd.read_csv('spy_sigma_r_backtest.csv', index_col=0, parse_dates=True)

# Reconstruct prices from returns (log returns)
# price[t] = price[0] * exp(cumsum(returns))
initial_price = 150.0  # Starting price from synthetic generator
cumulative_returns = df['returns'].cumsum()
prices = initial_price * np.exp(cumulative_returns)

# Extract Python-computed Sigma_R for comparison
sigma_R_python = df['sigma_R']
sigma_C_python = df['sigma_C']
hurst_python = df['hurst']

# Create simple CSV with date, price, sigma_R (for comparison)
output = pd.DataFrame({
    'date': df.index,
    'price': prices,
    'sigma_R_python': sigma_R_python,
    'sigma_C_python': sigma_C_python,
    'hurst_python': hurst_python
})

# Save subset (first 500 rows for browser performance)
output_subset = output.head(500)
output_subset.to_csv('spy_prices_for_js_validation.csv', index=False)

print(f"✅ Extracted {len(output_subset)} price points")
print(f"📊 Price range: ${prices.min():.2f} - ${prices.max():.2f}")
print(f"📊 Sigma_R range: {sigma_R_python.min():.4f} - {sigma_R_python.max():.4f}")
print(f"📁 Saved to: spy_prices_for_js_validation.csv")
