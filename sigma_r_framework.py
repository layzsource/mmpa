"""
Resolution-Adjusted Stability Theory (Σ_R Framework)
=====================================================

A unified function for dynamic financial equilibrium and allegorical systemic behavior.

This module implements the six-force stability metric that maps directly to MMPA's
audio analysis framework, allowing financial market analysis through the same
phenomenological lens.

Author: Sigma_R Framework Team
Date: 2025-10-31
Version: 1.0.0

Mathematical Foundation:
    Σ_R(t) = (1 / (1/Σ_C(t) + γ·Res(t)))^(1 + ρ·Res(t))

    where Σ_C is Core Stability and Res is Resolution (tail risk).

Six Forces (MMPA Mapping):
    1. Identity → Price Change (ΔP)
    2. Relationship → Volume Imbalance
    3. Complexity → Hurst Exponent (memory)
    4. Transformation → Volatility Regime Shift
    5. Alignment/Entropy → Autocorrelation Residual
    6. Resolution → Expected Shortfall (tail cost)
"""

import numpy as np
import pandas as pd
from typing import Dict, Optional, Tuple
import warnings

warnings.filterwarnings('ignore')


class SigmaRCalculator:
    """
    Resolution-Adjusted Stability Metric Calculator

    Computes the Sigma_R stability metric from price and volume data,
    implementing the full six-force framework with proper normalization,
    smoothing, and clipping to ensure mathematical boundedness.

    Parameters
    ----------
    kappa : float, default=1.0
        Complexity modulation factor for price stress (α_eff)
    lambda_ : float, default=1.0
        Complexity modulation factor for volume stress (β_eff)
    z : float, default=0.8
        Entropy damping coefficient
    eta : float, default=1.0
        Transformation additive weight
    mu : float, default=0.5
        Transformation exponent weight
    gamma_ent : float, default=1.0
        Entropy additive weight
    gamma : float, default=0.5
        Resolution additive scaling
    rho : float, default=1.0
        Resolution exponent scaling
    trans_span : int, default=5
        EWMA span for Transformation smoothing
    res_span : int, default=10
        EWMA span for Resolution smoothing
    ent_span : int, default=20
        EWMA span for Entropy smoothing
    hurst_span : int, default=40
        EWMA span for Hurst exponent smoothing
    hurst_window : int, default=60
        Rolling window for Hurst estimation (R/S method)
    short_vol_window : int, default=10
        Window for short-term realized volatility
    long_vol_window : int, default=60
        Window for long-term realized volatility
    es_quantile : float, default=0.05
        Quantile for Expected Shortfall (e.g., 0.05 = 95% VaR)
    epsilon : float, default=1e-8
        Small constant to prevent division by zero

    Attributes
    ----------
    params : dict
        Dictionary of all parameter values
    """

    def __init__(
        self,
        kappa: float = 1.0,
        lambda_: float = 1.0,
        z: float = 0.8,
        eta: float = 1.0,
        mu: float = 0.5,
        gamma_ent: float = 1.0,
        gamma: float = 0.5,
        rho: float = 1.0,
        trans_span: int = 5,
        res_span: int = 10,
        ent_span: int = 20,
        hurst_span: int = 40,
        hurst_window: int = 60,
        short_vol_window: int = 10,
        long_vol_window: int = 60,
        es_quantile: float = 0.05,
        epsilon: float = 1e-8
    ):
        """Initialize the Sigma_R calculator with specified parameters."""

        # Validate all parameters are non-negative
        assert all(x >= 0 for x in [kappa, lambda_, z, eta, mu, gamma_ent, gamma, rho]), \
            "All scaling parameters must be non-negative"
        assert 0 < es_quantile < 1, "ES quantile must be in (0, 1)"

        self.params = {
            'kappa': kappa,
            'lambda': lambda_,
            'z': z,
            'eta': eta,
            'mu': mu,
            'gamma_ent': gamma_ent,
            'gamma': gamma,
            'rho': rho,
            'trans_span': trans_span,
            'res_span': res_span,
            'ent_span': ent_span,
            'hurst_span': hurst_span,
            'hurst_window': hurst_window,
            'short_vol_window': short_vol_window,
            'long_vol_window': long_vol_window,
            'es_quantile': es_quantile,
            'epsilon': epsilon
        }

    def _ewma(self, series: pd.Series, span: int) -> pd.Series:
        """Exponentially weighted moving average."""
        return series.ewm(span=span, adjust=False).mean()

    def _clip_and_compress(self, x: float, max_val: float = 10.0) -> float:
        """Clip to max_val and apply log(1+x) compression."""
        clipped = np.clip(x, 0, max_val)
        return np.log1p(clipped)

    def _estimate_hurst(self, returns: pd.Series, window: int) -> float:
        """
        Estimate Hurst exponent using R/S analysis.

        Returns value in [0.01, 0.99] to avoid edge cases.
        H > 0.5 indicates persistence, H < 0.5 indicates anti-persistence.
        """
        if len(returns) < window:
            return 0.5  # Neutral default

        try:
            returns_arr = returns.values[-window:]
            mean_ret = np.mean(returns_arr)

            # Cumulative deviation from mean
            Y = np.cumsum(returns_arr - mean_ret)

            # Range
            R = np.max(Y) - np.min(Y)

            # Standard deviation
            S = np.std(returns_arr, ddof=1)

            if S == 0 or R == 0:
                return 0.5

            # R/S ratio
            rs = R / S

            # Hurst estimate: H ≈ log(R/S) / log(n/2)
            H = np.log(rs) / np.log(window / 2)

            # Clip to valid range
            return np.clip(H, 0.01, 0.99)
        except:
            return 0.5

    def _compute_expected_shortfall(
        self,
        returns: pd.Series,
        window: int,
        quantile: float
    ) -> float:
        """
        Compute Expected Shortfall (CVaR) - average of worst losses beyond VaR.
        """
        if len(returns) < window:
            return 0.0

        recent_returns = returns.values[-window:]
        var_threshold = np.quantile(recent_returns, quantile)

        # Expected shortfall: mean of returns below VaR
        tail_losses = recent_returns[recent_returns <= var_threshold]

        if len(tail_losses) == 0:
            return 0.0

        # Return absolute value (we want positive ES for losses)
        es = np.abs(np.mean(tail_losses))
        return es

    def compute(
        self,
        prices: pd.Series,
        volumes: Optional[pd.Series] = None
    ) -> pd.DataFrame:
        """
        Compute the full Sigma_R framework from price (and optional volume) data.

        Parameters
        ----------
        prices : pd.Series
            Time series of prices (e.g., close prices)
        volumes : pd.Series, optional
            Time series of trading volumes. If None, volume-based features
            will be set to neutral values.

        Returns
        -------
        pd.DataFrame
            DataFrame with columns:
            - returns: Log returns (ΔP)
            - sigma_short: Short-term realized volatility
            - sigma_long: Long-term realized volatility
            - trans_raw: Raw transformation ratio
            - trans_sm: Smoothed transformation
            - hurst: Hurst exponent (smoothed)
            - ent_raw: Raw entropy
            - ent_sm: Smoothed entropy
            - vol_imbalance: Volume imbalance ratio
            - res_raw: Raw resolution ratio
            - res_sm: Smoothed resolution
            - alpha_eff: Effective price stress coefficient
            - beta_eff: Effective volume stress coefficient
            - D: Systemic stress
            - sigma_C: Core stability
            - sigma_R: Resolution-adjusted stability
        """
        # Extract parameters
        p = self.params
        eps = p['epsilon']

        # Compute log returns
        returns = np.log(prices / prices.shift(1)).fillna(0)

        # Initialize output DataFrame
        df = pd.DataFrame(index=prices.index)
        df['returns'] = returns

        # =====================================================================
        # 1. Realized Volatility (short and long windows)
        # =====================================================================
        df['sigma_short'] = returns.rolling(p['short_vol_window']).std().fillna(0)
        df['sigma_long'] = returns.rolling(p['long_vol_window']).std().fillna(0)

        # Floor long vol to prevent division by zero
        df['sigma_long'] = df['sigma_long'].clip(lower=eps)

        # =====================================================================
        # 2. TRANSFORMATION - Volatility regime shift
        # =====================================================================
        trans_raw = (df['sigma_short'] - df['sigma_long']) / df['sigma_long']
        df['trans_raw'] = trans_raw

        # Clip, compress, and smooth
        trans_mag = trans_raw.abs().clip(upper=10.0)
        trans_compressed = np.log1p(trans_mag)
        df['trans_sm'] = self._ewma(trans_compressed, p['trans_span'])

        # =====================================================================
        # 3. COMPLEXITY - Hurst exponent (memory/persistence)
        # =====================================================================
        hurst_values = []
        for i in range(len(returns)):
            if i < p['hurst_window']:
                hurst_values.append(0.5)  # Neutral default
            else:
                H = self._estimate_hurst(returns.iloc[:i+1], p['hurst_window'])
                hurst_values.append(H)

        df['hurst_raw'] = hurst_values
        df['hurst'] = self._ewma(pd.Series(hurst_values, index=df.index), p['hurst_span'])
        df['hurst'] = df['hurst'].clip(0.01, 0.99)

        # =====================================================================
        # 4. ENTROPY - Autocorrelation residual (disorder)
        # =====================================================================
        # AR(1) autocorrelation
        rho1 = returns.rolling(20).apply(lambda x: x.autocorr(lag=1), raw=False).fillna(0)
        ent_raw = 1 - rho1.abs()
        df['ent_raw'] = ent_raw
        df['ent_sm'] = self._ewma(ent_raw, p['ent_span']).clip(0, 1)

        # =====================================================================
        # 5. RELATIONSHIP - Volume imbalance
        # =====================================================================
        if volumes is not None:
            vol_ma = volumes.rolling(20).mean()
            df['vol_imbalance'] = ((volumes - vol_ma) / (vol_ma + eps)).fillna(0)
            df['vol_imbalance'] = df['vol_imbalance'].clip(-5, 5)  # Reasonable bounds
        else:
            df['vol_imbalance'] = 0.0  # Neutral if no volume data

        # =====================================================================
        # 6. RESOLUTION - Expected Shortfall (tail risk)
        # =====================================================================
        es_values = []
        for i in range(len(returns)):
            if i < p['long_vol_window']:
                es_values.append(0.0)
            else:
                es = self._compute_expected_shortfall(
                    returns.iloc[:i+1],
                    p['long_vol_window'],
                    p['es_quantile']
                )
                es_values.append(es)

        df['es'] = es_values

        # Resolution ratio: ES / long_vol
        res_raw = df['es'] / (df['sigma_long'] + eps)
        df['res_raw'] = res_raw

        # Clip, compress, and smooth
        res_mag = res_raw.clip(upper=10.0)
        res_compressed = np.log1p(res_mag)
        df['res_sm'] = self._ewma(res_compressed, p['res_span'])

        # =====================================================================
        # 7. EFFECTIVE COEFFICIENTS (Complexity & Entropy modulation)
        # =====================================================================
        H_centered = df['hurst'] - 0.5
        ent_damped = 1 - p['z'] * df['ent_sm']

        df['alpha_eff'] = 1 + p['kappa'] * H_centered * ent_damped
        df['beta_eff'] = 1 + p['lambda'] * H_centered * ent_damped

        # =====================================================================
        # 8. CORE STABILITY (Σ_C)
        # =====================================================================
        # Systemic stress
        D = (
            1
            + df['alpha_eff'] * df['returns']**2
            + df['beta_eff'] * df['vol_imbalance']**2
            + p['eta'] * df['trans_sm']
            + p['gamma_ent'] * df['ent_sm']
        )
        df['D'] = D

        # Core stability with transformation exponent
        exponent = 1 + p['mu'] * df['trans_sm']
        sigma_C = (1 / D) ** exponent
        df['sigma_C'] = sigma_C.clip(1e-12, 1.0)

        # =====================================================================
        # 9. RESOLUTION-ADJUSTED STABILITY (Σ_R)
        # =====================================================================
        # Resolution adjustment
        inv_sigma_C = 1 / (df['sigma_C'] + eps)
        res_adjusted_inv = inv_sigma_C + p['gamma'] * df['res_sm']

        # Final exponent
        res_exponent = 1 + p['rho'] * df['res_sm']

        sigma_R = (1 / res_adjusted_inv) ** res_exponent
        df['sigma_R'] = sigma_R.clip(1e-12, 1.0)

        return df

    def compute_mmpa_features(self, df: pd.DataFrame) -> Dict:
        """
        Convert Sigma_R dataframe to MMPA-compatible feature structure.

        This allows direct integration with MMPA's visual mapping layer.

        Parameters
        ----------
        df : pd.DataFrame
            Output from compute() method

        Returns
        -------
        dict
            MMPA feature structure with keys:
            - identity: {fundamentalFreq, strength}
            - relationship: {consonance, complexity}
            - complexity: {brightness, centroid, bandwidth}
            - transformation: {flux, velocity, acceleration}
            - alignment: {coherence, stability, synchrony}
            - potential: {entropy, unpredictability, freedom}
            - resolution: {sigma_C, sigma_R, res_ratio}
        """
        # Get latest values (or could return time series)
        latest = df.iloc[-1]

        return {
            'identity': {
                'fundamentalFreq': latest['returns'] * 1000,  # Scale for visualization
                'strength': np.abs(latest['returns']).clip(0, 1)
            },
            'relationship': {
                'consonance': (1 - latest['vol_imbalance']).clip(0, 1),
                'complexity': latest['hurst'].clip(0, 1)
            },
            'complexity': {
                'brightness': latest['hurst'].clip(0, 1),
                'centroid': latest['sigma_long'] * 1000,  # Scale
                'bandwidth': latest['sigma_short'] * 1000
            },
            'transformation': {
                'flux': latest['trans_sm'].clip(0, 1),
                'velocity': latest['trans_raw'].clip(-1, 1),
                'acceleration': 0.0  # Could compute second derivative
            },
            'alignment': {
                'coherence': (1 - latest['ent_sm']).clip(0, 1),
                'stability': latest['sigma_C'].clip(0, 1),
                'synchrony': latest['sigma_R'].clip(0, 1)
            },
            'potential': {
                'entropy': latest['ent_sm'].clip(0, 1),
                'unpredictability': latest['res_sm'].clip(0, 1),
                'freedom': (1 - latest['sigma_R']).clip(0, 1)  # Inverse of stability
            },
            'resolution': {
                'sigma_C': latest['sigma_C'],
                'sigma_R': latest['sigma_R'],
                'res_ratio': latest['res_sm']
            }
        }


def download_spy_data(start_date: str = '2007-01-01', end_date: str = '2024-12-31') -> pd.DataFrame:
    """
    Download SPY historical data from Yahoo Finance.

    Parameters
    ----------
    start_date : str
        Start date in 'YYYY-MM-DD' format
    end_date : str
        End date in 'YYYY-MM-DD' format

    Returns
    -------
    pd.DataFrame
        DataFrame with Date index and columns: Open, High, Low, Close, Volume
    """
    try:
        import yfinance as yf
        spy = yf.Ticker("SPY")
        df = spy.history(start=start_date, end=end_date)
        return df
    except ImportError:
        print("yfinance not installed. Install with: pip install yfinance")
        print("Generating synthetic data for demonstration...")
        return _generate_synthetic_spy_data()


def _generate_synthetic_spy_data() -> pd.DataFrame:
    """Generate synthetic SPY-like data for demonstration if yfinance unavailable."""
    np.random.seed(42)
    dates = pd.date_range('2007-01-01', '2024-12-31', freq='B')  # Business days

    # Simulate price with regime changes
    n = len(dates)
    returns = np.random.randn(n) * 0.01  # Base volatility 1%

    # 2008 crisis: Oct 2008 - Mar 2009
    crisis_2008 = (dates >= '2008-10-01') & (dates <= '2009-03-31')
    returns[crisis_2008] = np.random.randn(crisis_2008.sum()) * 0.03 - 0.002  # 3% vol, -0.2% drift

    # 2020 COVID crash: Feb 2020 - Apr 2020
    crisis_2020 = (dates >= '2020-02-01') & (dates <= '2020-04-30')
    returns[crisis_2020] = np.random.randn(crisis_2020.sum()) * 0.035 - 0.001  # 3.5% vol

    # Generate prices
    prices = 150 * np.exp(np.cumsum(returns))  # Start at $150

    # Generate volumes with correlation to volatility
    vol_base = np.abs(returns) * 1e8 + 5e7
    volumes = vol_base + np.random.randn(n) * 1e7

    df = pd.DataFrame({
        'Open': prices * (1 + np.random.randn(n) * 0.001),
        'High': prices * (1 + np.abs(np.random.randn(n)) * 0.005),
        'Low': prices * (1 - np.abs(np.random.randn(n)) * 0.005),
        'Close': prices,
        'Volume': np.clip(volumes, 1e6, None)
    }, index=dates)

    return df


if __name__ == "__main__":
    """
    Example usage: Download SPY data and compute Sigma_R metric.
    """
    print("Sigma_R Framework - SPY Backtest")
    print("=" * 60)

    # Download data
    print("\n1. Downloading SPY data...")
    spy_data = download_spy_data('2007-01-01', '2024-12-31')
    print(f"   Downloaded {len(spy_data)} trading days")

    # Initialize calculator
    print("\n2. Initializing Sigma_R calculator...")
    calculator = SigmaRCalculator()

    # Compute metrics
    print("\n3. Computing Sigma_R metrics...")
    results = calculator.compute(spy_data['Close'], spy_data['Volume'])

    # Summary statistics
    print("\n4. Summary Statistics:")
    print("-" * 60)
    print(f"   Sigma_C: mean={results['sigma_C'].mean():.4f}, "
          f"std={results['sigma_C'].std():.4f}, "
          f"min={results['sigma_C'].min():.4f}, "
          f"max={results['sigma_C'].max():.4f}")
    print(f"   Sigma_R: mean={results['sigma_R'].mean():.4f}, "
          f"std={results['sigma_R'].std():.4f}, "
          f"min={results['sigma_R'].min():.4f}, "
          f"max={results['sigma_R'].max():.4f}")

    # Key crisis events
    print("\n5. Crisis Event Analysis:")
    print("-" * 60)

    # 2008 Financial Crisis
    crisis_2008 = results.loc['2008-09-01':'2009-03-31']
    if len(crisis_2008) > 0:
        print(f"   2008 Crisis (Sep 2008 - Mar 2009):")
        print(f"     Sigma_R min: {crisis_2008['sigma_R'].min():.4f} "
              f"on {crisis_2008['sigma_R'].idxmin().date()}")
        print(f"     Sigma_R mean: {crisis_2008['sigma_R'].mean():.4f}")

    # 2020 COVID Crash
    crisis_2020 = results.loc['2020-02-01':'2020-04-30']
    if len(crisis_2020) > 0:
        print(f"   2020 COVID (Feb 2020 - Apr 2020):")
        print(f"     Sigma_R min: {crisis_2020['sigma_R'].min():.4f} "
              f"on {crisis_2020['sigma_R'].idxmin().date()}")
        print(f"     Sigma_R mean: {crisis_2020['sigma_R'].mean():.4f}")

    # Export
    print("\n6. Exporting results...")
    output_path = 'spy_sigma_r_backtest.csv'
    results.to_csv(output_path)
    print(f"   Saved to: {output_path}")

    # MMPA feature extraction example
    print("\n7. MMPA Feature Extraction (latest):")
    print("-" * 60)
    mmpa_features = calculator.compute_mmpa_features(results)
    for category, features in mmpa_features.items():
        print(f"   {category}:")
        for key, val in features.items():
            print(f"     {key}: {val:.6f}")

    print("\n" + "=" * 60)
    print("Backtest complete!")
    print("\nNext steps:")
    print("  - Review CSV output for full time series")
    print("  - Generate plots with matplotlib/seaborn")
    print("  - Port to JavaScript for MMPA integration")
