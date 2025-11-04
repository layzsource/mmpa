"""
Sigma_R Visualization Script
=============================

Creates publication-quality plots showing Sigma_R response to market crises.
"""

import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime

# Read the backtest results
df = pd.read_csv('spy_sigma_r_backtest.csv', index_col=0, parse_dates=True)

# Create figure with subplots
fig, axes = plt.subplots(5, 1, figsize=(14, 12), sharex=True)
fig.suptitle('Sigma_R Framework - SPY Backtest (2007-2024)', fontsize=16, fontweight='bold')

# Define crisis periods for shading
crises = [
    ('2008 Financial Crisis', '2008-09-15', '2009-03-31', 'red'),
    ('2020 COVID Crash', '2020-02-19', '2020-04-30', 'orange')
]

def shade_crises(ax):
    """Add shaded regions for crisis periods."""
    for name, start, end, color in crises:
        ax.axvspan(pd.to_datetime(start), pd.to_datetime(end),
                  alpha=0.15, color=color, label=name)

# ===================================================================
# Plot 1: Returns and Prices
# ===================================================================
ax1 = axes[0]
ax1_twin = ax1.twinx()

# Plot cumulative returns (price)
cumulative_returns = (1 + df['returns']).cumprod()
ax1.plot(df.index, cumulative_returns, label='Cumulative Return', color='black', linewidth=1.5)
ax1.set_ylabel('Cumulative Return', fontsize=10, fontweight='bold')
ax1.set_ylim(bottom=0)
ax1.grid(True, alpha=0.3)
shade_crises(ax1)

# Plot returns
ax1_twin.fill_between(df.index, 0, df['returns'], alpha=0.3, color='steelblue', label='Daily Returns')
ax1_twin.set_ylabel('Daily Returns', fontsize=10, color='steelblue')
ax1_twin.tick_params(axis='y', labelcolor='steelblue')

ax1.set_title('SPY Price and Returns', fontsize=11, fontweight='bold')
ax1.legend(loc='upper left', fontsize=8)

# ===================================================================
# Plot 2: Realized Volatility
# ===================================================================
ax2 = axes[1]
ax2.plot(df.index, df['sigma_short'], label='Short-term Volatility (10d)',
         color='red', alpha=0.7, linewidth=1)
ax2.plot(df.index, df['sigma_long'], label='Long-term Volatility (60d)',
         color='darkred', linewidth=1.5)
ax2.set_ylabel('Realized Volatility', fontsize=10, fontweight='bold')
ax2.set_title('Volatility Regimes (Identity & Transformation)', fontsize=11, fontweight='bold')
ax2.legend(loc='upper right', fontsize=8)
ax2.grid(True, alpha=0.3)
shade_crises(ax2)

# ===================================================================
# Plot 3: Six Forces
# ===================================================================
ax3 = axes[2]
ax3.plot(df.index, df['trans_sm'], label='Transformation (regime shift)',
         color='purple', linewidth=1, alpha=0.8)
ax3.plot(df.index, df['hurst'] - 0.5, label='Complexity (H - 0.5, memory)',
         color='green', linewidth=1, alpha=0.8)
ax3.plot(df.index, df['ent_sm'], label='Entropy (disorder)',
         color='orange', linewidth=1, alpha=0.8)
ax3.plot(df.index, df['res_sm'], label='Resolution (tail risk)',
         color='red', linewidth=1.5, alpha=0.9)
ax3.set_ylabel('Force Magnitude', fontsize=10, fontweight='bold')
ax3.set_title('Six Forces: Transformation, Complexity, Entropy, Resolution', fontsize=11, fontweight='bold')
ax3.legend(loc='upper right', fontsize=8, ncol=2)
ax3.grid(True, alpha=0.3)
ax3.axhline(y=0, color='black', linestyle='--', linewidth=0.5)
shade_crises(ax3)

# ===================================================================
# Plot 4: Core Stability (Sigma_C)
# ===================================================================
ax4 = axes[3]
ax4.fill_between(df.index, 0, df['sigma_C'], alpha=0.5, color='steelblue', label='Sigma_C')
ax4.plot(df.index, df['sigma_C'], color='darkblue', linewidth=1.5)
ax4.set_ylabel('Core Stability (Σ_C)', fontsize=10, fontweight='bold')
ax4.set_title('Core Stability (Before Resolution Adjustment)', fontsize=11, fontweight='bold')
ax4.set_ylim(0, 1)
ax4.grid(True, alpha=0.3)
shade_crises(ax4)
ax4.legend(loc='lower right', fontsize=8)

# ===================================================================
# Plot 5: Resolution-Adjusted Stability (Sigma_R)
# ===================================================================
ax5 = axes[4]
ax5.fill_between(df.index, 0, df['sigma_R'], alpha=0.6, color='crimson', label='Sigma_R')
ax5.plot(df.index, df['sigma_R'], color='darkred', linewidth=2)
ax5.set_ylabel('Final Stability (Σ_R)', fontsize=10, fontweight='bold')
ax5.set_xlabel('Date', fontsize=10, fontweight='bold')
ax5.set_title('Resolution-Adjusted Stability (Final Metric)', fontsize=11, fontweight='bold')
ax5.set_ylim(0, 0.4)
ax5.grid(True, alpha=0.3)
shade_crises(ax5)

# Annotate crisis lows
crisis_2008 = df.loc['2008-09-01':'2009-03-31']
crisis_2020 = df.loc['2020-02-01':'2020-04-30']

if len(crisis_2008) > 0:
    min_2008_date = crisis_2008['sigma_R'].idxmin()
    min_2008_val = crisis_2008['sigma_R'].min()
    ax5.annotate(f'2008 Low\n{min_2008_val:.4f}',
                xy=(min_2008_date, min_2008_val),
                xytext=(10, 20), textcoords='offset points',
                bbox=dict(boxstyle='round,pad=0.5', fc='yellow', alpha=0.7),
                arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=0', color='red'),
                fontsize=8, fontweight='bold')

if len(crisis_2020) > 0:
    min_2020_date = crisis_2020['sigma_R'].idxmin()
    min_2020_val = crisis_2020['sigma_R'].min()
    ax5.annotate(f'2020 Low\n{min_2020_val:.4f}',
                xy=(min_2020_date, min_2020_val),
                xytext=(10, 20), textcoords='offset points',
                bbox=dict(boxstyle='round,pad=0.5', fc='yellow', alpha=0.7),
                arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=0', color='red'),
                fontsize=8, fontweight='bold')

ax5.legend(loc='lower right', fontsize=8)

# Format x-axis
ax5.xaxis.set_major_locator(mdates.YearLocator(2))
ax5.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
ax5.xaxis.set_minor_locator(mdates.YearLocator())

plt.tight_layout()
plt.savefig('sigma_r_backtest_visualization.png', dpi=300, bbox_inches='tight')
print("✅ Plot saved to: sigma_r_backtest_visualization.png")

# Also create a focused crisis comparison plot
fig2, (ax_2008, ax_2020) = plt.subplots(1, 2, figsize=(14, 5))
fig2.suptitle('Sigma_R Crisis Response Comparison', fontsize=14, fontweight='bold')

# 2008 Crisis
crisis_window_2008 = df.loc['2008-01-01':'2009-12-31']
ax_2008.fill_between(crisis_window_2008.index, 0, crisis_window_2008['sigma_R'],
                     alpha=0.6, color='crimson')
ax_2008.plot(crisis_window_2008.index, crisis_window_2008['sigma_R'],
            color='darkred', linewidth=2)
ax_2008.axvspan(pd.to_datetime('2008-09-15'), pd.to_datetime('2009-03-31'),
               alpha=0.2, color='red', label='Crisis Period')
ax_2008.set_title('2008 Financial Crisis', fontsize=12, fontweight='bold')
ax_2008.set_ylabel('Sigma_R', fontsize=10, fontweight='bold')
ax_2008.set_ylim(0, 0.4)
ax_2008.grid(True, alpha=0.3)
ax_2008.legend(fontsize=8)
ax_2008.axhline(y=0.128, color='green', linestyle='--', linewidth=1, label='Normal Mean', alpha=0.7)

# 2020 COVID
crisis_window_2020 = df.loc['2019-01-01':'2021-12-31']
ax_2020.fill_between(crisis_window_2020.index, 0, crisis_window_2020['sigma_R'],
                     alpha=0.6, color='crimson')
ax_2020.plot(crisis_window_2020.index, crisis_window_2020['sigma_R'],
            color='darkred', linewidth=2)
ax_2020.axvspan(pd.to_datetime('2020-02-19'), pd.to_datetime('2020-04-30'),
               alpha=0.2, color='orange', label='Crisis Period')
ax_2020.set_title('2020 COVID Crash', fontsize=12, fontweight='bold')
ax_2020.set_ylabel('Sigma_R', fontsize=10, fontweight='bold')
ax_2020.set_ylim(0, 0.4)
ax_2020.grid(True, alpha=0.3)
ax_2020.legend(fontsize=8)
ax_2020.axhline(y=0.128, color='green', linestyle='--', linewidth=1, label='Normal Mean', alpha=0.7)

plt.tight_layout()
plt.savefig('sigma_r_crisis_comparison.png', dpi=300, bbox_inches='tight')
print("✅ Plot saved to: sigma_r_crisis_comparison.png")

print("\n📊 Visualization complete!")
print("   - sigma_r_backtest_visualization.png (full time series, 5 panels)")
print("   - sigma_r_crisis_comparison.png (crisis close-ups)")
