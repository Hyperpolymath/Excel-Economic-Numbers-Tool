# Excel Economic Toolkit

[![Build Status](https://img.shields.io/github/workflow/status/Hyperpolymath/excel-economic-number-tool-/CI)](https://github.com/Hyperpolymath/excel-economic-number-tool-/actions)
[![Coverage](https://img.shields.io/codecov/c/github/Hyperpolymath/excel-economic-number-tool-)](https://codecov.io/gh/Hyperpolymath/excel-economic-number-tool-)
[![Version](https://img.shields.io/npm/v/economic-toolkit-v2)](https://www.npmjs.com/package/economic-toolkit-v2)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](package.json)
[![Platform](https://img.shields.io/badge/platform-Excel%20%7C%20LibreOffice-orange)](README.md)

> Cross-platform Excel/LibreOffice add-in for economic modeling, data analysis, and investigative research

## Overview

The Excel Economic Toolkit is a powerful, production-ready add-in that brings advanced economic analysis capabilities directly into spreadsheet applications. Built for economists, researchers, financial analysts, and data scientists, it provides seamless access to 10 major economic data sources and comprehensive analytical functions—all without leaving your spreadsheet.

### Key Features

- **10 Major Data Sources**: Direct access to FRED, World Bank, IMF, OECD, ECB, BEA, Census, Eurostat, BIS, and DBnomics
- **Advanced Economic Functions**: Elasticity calculations, GDP growth analysis, inequality metrics (Gini, Lorenz), and more
- **Cross-Platform Support**: Works in both Microsoft Excel (via Office.js) and LibreOffice (via UNO API)
- **Intelligent Caching**: SQLite-based persistent cache with configurable TTL to minimize API calls
- **Rate Limiting**: Built-in rate limiters respect API quotas and prevent throttling
- **Retry Logic**: Automatic retry with exponential backoff for resilient data fetching
- **Type-Safe**: Written in TypeScript and Julia for reliability and performance
- **Production-Ready**: Comprehensive test coverage, error handling, and logging

### What Makes This Different?

Unlike traditional economic data plugins that require complex setup or expensive subscriptions:

- **Free and Open Source**: MIT licensed, no hidden costs
- **No Server Required**: All computations run locally in your spreadsheet
- **Offline Support**: Cached data available even when APIs are down
- **High Performance**: Julia backend for computationally intensive operations
- **Developer Friendly**: Well-documented API, extensive examples, easy to extend

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Installation](#installation)
3. [Usage Examples](#usage-examples)
   - [Fetching Economic Data](#fetching-economic-data)
   - [Growth Rate Analysis](#growth-rate-analysis)
   - [Elasticity Calculations](#elasticity-calculations)
   - [Inequality Analysis](#inequality-analysis)
   - [Working with Constraints](#working-with-constraints)
4. [Data Sources](#data-sources)
5. [Excel Functions Reference](#excel-functions-reference)
6. [API Reference](#api-reference-overview)
7. [Development Setup](#development-setup)
8. [Testing](#testing)
9. [Building and Deployment](#building-and-deployment)
10. [Architecture Overview](#architecture-overview)
11. [Contributing](#contributing)
12. [License](#license)
13. [Acknowledgments](#acknowledgments)

---

## Quick Start

### For Excel Users

1. Download the latest release from [GitHub Releases](https://github.com/Hyperpolymath/excel-economic-number-tool-/releases)
2. In Excel, go to **Insert** → **Get Add-ins** → **Upload My Add-in**
3. Select the downloaded `manifest.xml` file
4. Start using economic functions immediately!

**Example: Fetch US GDP from FRED**

```excel
=ECON.FRED("GDPC1", "2020-01-01", "2023-12-31")
```

### For LibreOffice Users

1. Download the LibreOffice extension (`.oxt` file) from [GitHub Releases](https://github.com/Hyperpolymath/excel-economic-number-tool-/releases)
2. In LibreOffice Calc, go to **Tools** → **Extension Manager**
3. Click **Add** and select the downloaded `.oxt` file
4. Restart LibreOffice and start using the functions!

### For Developers

```bash
# Clone the repository
git clone https://github.com/Hyperpolymath/excel-economic-number-tool-.git
cd excel-economic-number-tool-

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## Installation

### Prerequisites

Before installing the Excel Economic Toolkit, ensure you have:

#### For End Users

- **Microsoft Excel**:
  - Excel 2016 or later (Windows/Mac)
  - Excel Online (web version)
  - Excel Mobile (iOS/Android) - limited support

  OR

- **LibreOffice**:
  - LibreOffice Calc 6.0 or later
  - Works on Windows, macOS, and Linux

#### For Developers

- **Node.js**: Version 20.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Julia**: Version 1.9 or higher (for backend computations)
- **Git**: For version control
- **TypeScript**: Version 5.2+ (installed via npm)

**Operating System Support:**
- Windows 10/11
- macOS 11 (Big Sur) or later
- Linux (Ubuntu 20.04+, Fedora 35+, or equivalent)

### Installation Methods

#### Method 1: Install from npm (Recommended for Developers)

```bash
npm install economic-toolkit-v2
```

#### Method 2: Build from Source

```bash
# 1. Clone the repository
git clone https://github.com/Hyperpolymath/excel-economic-number-tool-.git
cd excel-economic-number-tool-

# 2. Install Node.js dependencies
npm install

# 3. Install Julia dependencies
julia --project=. -e 'using Pkg; Pkg.instantiate()'

# 4. Build the add-in
npm run build

# 5. For Excel: build Excel-specific bundle
npm run build:excel

# 6. For LibreOffice: build LibreOffice-specific bundle
npm run build:libre
```

#### Method 3: Install Pre-built Release

1. Go to [Releases](https://github.com/Hyperpolymath/excel-economic-number-tool-/releases)
2. Download the latest version:
   - `excel-economic-toolkit-v2.0.0-excel.zip` (for Microsoft Excel)
   - `excel-economic-toolkit-v2.0.0-libre.oxt` (for LibreOffice)
3. Follow platform-specific installation instructions above

### API Keys Configuration

Some data sources require API keys for full functionality. While the add-in works without them (with reduced rate limits), we recommend obtaining free API keys:

#### FRED (Federal Reserve Economic Data)

```bash
# Set environment variable (recommended)
export FRED_API_KEY="your_api_key_here"

# Or configure in Excel/LibreOffice settings
# Excel: File → Options → Economic Toolkit → API Keys
# LibreOffice: Tools → Options → Economic Toolkit → API Keys
```

**How to get a FRED API key:**
1. Go to https://fred.stlouisfed.org/
2. Create a free account
3. Navigate to "My Account" → "API Keys"
4. Request a new API key (instant approval)

**Rate Limits:**
- With API key: 120 requests/minute
- Without API key: 5 requests/minute

#### Other Data Sources

Most other data sources (World Bank, IMF, OECD, etc.) don't require API keys for basic usage. See [Data Sources](#data-sources) section for details.

### Verifying Installation

After installation, verify everything works:

#### In Excel

```excel
# Test basic function
=ECON.VERSION()
# Should return: "2.0.0"

# Test data fetch
=ECON.FRED("GDPC1", "2023-01-01", "2023-12-31")
# Should return GDP data
```

#### In LibreOffice

```libreoffice
# Test basic function
=ECON.VERSION()
# Should return: "2.0.0"

# Test data fetch
=ECON.FRED("GDPC1", "2023-01-01", "2023-12-31")
# Should return GDP data
```

#### From Command Line (Developers)

```bash
# Run test suite
npm test

# Should see:
# PASS  src/typescript/adapters/OfficeJsAdapter.test.ts
# PASS  src/julia/formulas/elasticity.test.jl
# Test Suites: 24 passed, 24 total
# Tests:       156 passed, 156 total
```

### Troubleshooting Installation

**Problem: "Node version too old"**
```bash
# Check Node version
node --version

# Upgrade Node using nvm (recommended)
nvm install 20
nvm use 20
```

**Problem: "Excel won't load the add-in"**
- Ensure you're using Excel 2016 or later
- Check that Office.js is enabled: File → Options → Trust Center → Trust Center Settings → Add-ins
- Try clearing Office cache: `%LOCALAPPDATA%\Microsoft\Office\16.0\Wef\`

**Problem: "Julia not found"**
```bash
# Install Julia from https://julialang.org/downloads/
# Or use package manager:

# macOS
brew install julia

# Ubuntu/Debian
sudo apt-get install julia

# Windows
winget install julia
```

**Problem: "LibreOffice extension won't install"**
- Ensure you have LibreOffice 6.0+: Help → About LibreOffice
- Try installing from command line:
  ```bash
  unopkg add excel-economic-toolkit-v2.0.0-libre.oxt
  ```

---

## Usage Examples

### Fetching Economic Data

The Excel Economic Toolkit provides unified functions to fetch data from 10 major economic data sources. All functions follow a consistent pattern:

```excel
=ECON.SOURCE(series_id, start_date, end_date, [optional_params])
```

#### Example 1: FRED - Federal Reserve Economic Data

**Fetch US Real GDP (Quarterly)**

```excel
# Basic usage
=ECON.FRED("GDPC1", "2020-01-01", "2023-12-31")

# Returns time series data:
# Date       | Value
# 2020-01-01 | 19032.7
# 2020-04-01 | 17258.2
# 2020-07-01 | 18560.8
# ...
```

**Fetch Unemployment Rate**

```excel
=ECON.FRED("UNRATE", "2023-01-01", "2023-12-31")

# Returns monthly unemployment rates:
# Date       | Value
# 2023-01-01 | 3.4
# 2023-02-01 | 3.6
# 2023-03-01 | 3.5
# ...
```

**Popular FRED Series IDs:**
- `GDPC1` - Real GDP
- `UNRATE` - Unemployment Rate
- `CPIAUCSL` - Consumer Price Index (All Urban Consumers)
- `FEDFUNDS` - Federal Funds Rate
- `DGS10` - 10-Year Treasury Rate
- `DEXUSEU` - USD/EUR Exchange Rate

#### Example 2: World Bank - International Development Data

**Fetch GDP for Multiple Countries**

```excel
# USA GDP (current USD)
=ECON.WORLDBANK("NY.GDP.MKTP.CD", "US", "2015-01-01", "2023-12-31")

# China GDP (current USD)
=ECON.WORLDBANK("NY.GDP.MKTP.CD", "CN", "2015-01-01", "2023-12-31")

# Germany GDP (current USD)
=ECON.WORLDBANK("NY.GDP.MKTP.CD", "DE", "2015-01-01", "2023-12-31")
```

**Fetch Population Data**

```excel
=ECON.WORLDBANK("SP.POP.TOTL", "US", "2010-01-01", "2023-12-31")

# Returns:
# Date       | Value
# 2010-01-01 | 309321666
# 2011-01-01 | 311556874
# ...
```

**Common World Bank Indicators:**
- `NY.GDP.MKTP.CD` - GDP (current USD)
- `NY.GDP.PCAP.CD` - GDP per capita
- `SP.POP.TOTL` - Total population
- `FP.CPI.TOTL.ZG` - Inflation (CPI)
- `SL.UEM.TOTL.ZS` - Unemployment rate
- `NE.TRD.GNFS.ZS` - Trade (% of GDP)

#### Example 3: IMF - International Monetary Fund Data

```excel
# Fetch IMF World Economic Outlook data
=ECON.IMF("NGDP_RPCH", "US", "2020-01-01", "2023-12-31")

# Returns real GDP growth rates
```

#### Example 4: ECB - European Central Bank

```excel
# Fetch Euro area interest rates
=ECON.ECB("FM.D.U2.EUR.4F.KR.MRR_FR.LEV", "2023-01-01", "2023-12-31")

# Fetch EUR/USD exchange rate
=ECON.ECB("EXR.D.USD.EUR.SP00.A", "2023-01-01", "2023-12-31")
```

#### Example 5: Multiple Data Sources in One Analysis

**Comparative GDP Analysis**

| Country | Source     | Formula                                                         | 2023 GDP (B) |
|---------|------------|-----------------------------------------------------------------|--------------|
| USA     | FRED       | `=ECON.FRED("GDP", "2023-01-01", "2023-12-31")`                | 27,000       |
| USA     | World Bank | `=ECON.WORLDBANK("NY.GDP.MKTP.CD", "US", "2023-01-01", "...")`| 27,000       |
| China   | World Bank | `=ECON.WORLDBANK("NY.GDP.MKTP.CD", "CN", "2023-01-01", "...")`| 17,963       |
| Germany | World Bank | `=ECON.WORLDBANK("NY.GDP.MKTP.CD", "DE", "2023-01-01", "...")`| 4,430        |

### Growth Rate Analysis

The toolkit provides comprehensive growth rate calculations following standard economic methodologies.

#### Example 1: Year-over-Year (YoY) Growth

```excel
# Simple YoY calculation
# Assuming A1:A10 contains GDP values, B1:B10 contains dates

# In cell C2:
=ECON.GROWTH.YOY(A:A, B:B)

# Returns YoY growth rates for each period
```

**Manual calculation in Excel (for understanding):**

| Date       | GDP    | YoY Growth (%)                    |
|------------|--------|-----------------------------------|
| 2020-01-01 | 20000  | N/A                               |
| 2021-01-01 | 21000  | `=(B3-B2)/B2*100` = 5.00%        |
| 2022-01-01 | 22050  | `=(B4-B3)/B3*100` = 5.00%        |
| 2023-01-01 | 23153  | `=(B5-B4)/B4*100` = 5.00%        |

**Using the built-in function:**

```excel
=ECON.GROWTH.YOY($A$2:$A$5, $B$2:$B$5)
```

#### Example 2: Quarter-over-Quarter (QoQ) Growth (Annualized)

```excel
# QoQ annualized growth
=ECON.GROWTH.QOQ(A:A, B:B)

# Formula: ((Q_t / Q_{t-1})^4 - 1) * 100
```

**Example Data:**

| Quarter    | GDP (B) | QoQ Growth (ann.) | Formula                           |
|------------|---------|-------------------|-----------------------------------|
| 2023 Q1    | 27,063  | N/A               |                                   |
| 2023 Q2    | 27,352  | 4.29%             | `=((B3/B2)^4-1)*100`             |
| 2023 Q3    | 27,610  | 3.78%             | `=((B4/B3)^4-1)*100`             |
| 2023 Q4    | 27,941  | 4.82%             | `=((B5/B4)^4-1)*100`             |

#### Example 3: Compound Annual Growth Rate (CAGR)

```excel
# Calculate CAGR over entire period
=ECON.GROWTH.CAGR(A:A, B:B)

# Formula: ((Final/Initial)^(1/years) - 1) * 100
```

**Real-world example:**

```excel
# In cells:
# A1: 2015-01-01, B1: 18,225 (GDP in billions)
# A2: 2023-01-01, B2: 27,000

=ECON.GROWTH.CAGR(B1:B2, A1:A2)
# Returns: 4.94% (average annual growth over 8 years)
```

#### Example 4: Real vs Nominal Growth

**Adjusting for Inflation:**

```excel
# Nominal GDP in column A
# GDP Deflator in column B (base year = 100)
# Dates in column C

# Calculate real GDP
=ECON.GROWTH.REAL(A:A, B:B)

# Then calculate real growth
=ECON.GROWTH.YOY(D:D, C:C)  # where D:D contains real GDP
```

**Example:**

| Date    | Nominal GDP | Deflator | Real GDP                | Nominal Growth | Real Growth |
|---------|-------------|----------|-------------------------|----------------|-------------|
| 2020    | 21,000      | 113.6    | 18,485 `=B2/(C2/100)`  | N/A            | N/A         |
| 2021    | 23,000      | 117.5    | 19,574                  | 9.5%           | 5.9%        |
| 2022    | 25,000      | 121.4    | 20,594                  | 8.7%           | 5.2%        |

#### Example 5: Contribution to Growth Analysis

**GDP Components Analysis:**

```excel
# Calculate how much consumption contributes to GDP growth

# GDP in A:A, Consumption in B:B, Dates in C:C
=ECON.GROWTH.CONTRIBUTION(B:B, A:A)
```

**Example:**

| Quarter | GDP   | Consumption | Invest. | Gov't | NX    | Consumption Contrib. |
|---------|-------|-------------|---------|-------|-------|----------------------|
| 2023 Q1 | 27063 | 18500       | 4800    | 3500  | 263   | N/A                  |
| 2023 Q2 | 27352 | 18720       | 4850    | 3520  | 262   | 0.81% `=(18720-18500)/27063*100` |
| 2023 Q3 | 27610 | 18950       | 4900    | 3540  | 220   | 0.84%                |

### Elasticity Calculations

Elasticity measures how responsive one variable is to changes in another—critical for understanding demand, supply, and policy impacts.

#### Example 1: Price Elasticity of Demand

**Basic Calculation:**

```excel
# Prices in column A, Quantities in column B
=ECON.ELASTICITY(B:B, A:A)

# Uses midpoint method by default:
# ε = (ΔQ/Q_avg) / (ΔP/P_avg)
```

**Real-world example (Coffee demand):**

| Price ($) | Quantity (units/day) | Calculation |
|-----------|----------------------|-------------|
| 3.00      | 200                  |             |
| 3.50      | 180                  |             |
| 4.00      | 155                  |             |
| 4.50      | 125                  |             |

```excel
# In cell C2:
=ECON.ELASTICITY(B2:B5, A2:A5)
# Returns: -0.78 (inelastic demand)
```

**Interpretation:**
- ε = -0.78: 1% increase in price → 0.78% decrease in quantity
- |ε| < 1: **Inelastic** (quantity less responsive than price)
- Coffee is a necessity, so demand is relatively inelastic

#### Example 2: Different Elasticity Methods

```excel
# Midpoint method (default, symmetric)
=ECON.ELASTICITY(quantities, prices, "midpoint")

# Arc elasticity (average of point elasticities)
=ECON.ELASTICITY(quantities, prices, "arc")

# Point elasticity (using regression)
=ECON.ELASTICITY(quantities, prices, "point")

# Log-log regression (constant elasticity)
=ECON.ELASTICITY(quantities, prices, "log")
```

**When to use each method:**
- **Midpoint**: Small price changes, general analysis
- **Arc**: Multiple price points, need average elasticity
- **Point**: Specific price point, theoretical analysis
- **Log**: Constant elasticity assumption, econometric models

#### Example 3: Income Elasticity of Demand

```excel
# Income in column A, Quantity demanded in column B
=ECON.ELASTICITY.INCOME(B:B, A:A)
```

**Example (Luxury car demand):**

| Household Income ($) | Cars Purchased (per 1000 households) |
|----------------------|--------------------------------------|
| 50,000               | 20                                   |
| 75,000               | 35                                   |
| 100,000              | 55                                   |
| 150,000              | 90                                   |

```excel
=ECON.ELASTICITY.INCOME(B2:B5, A2:A5)
# Returns: 1.45 (luxury good)
```

**Interpretation:**
- ε_I = 1.45: **Luxury good** (ε > 1)
- 1% income increase → 1.45% demand increase
- ε_I > 1: Luxury good
- 0 < ε_I < 1: Normal good
- ε_I < 0: Inferior good

#### Example 4: Cross-Price Elasticity

**Measuring Substitutes and Complements:**

```excel
# Quantity of Product X in column A
# Price of Product Y in column B
=ECON.ELASTICITY.CROSS(A:A, B:B)
```

**Example 1: Butter vs Margarine (Substitutes)**

| Margarine Price ($) | Butter Quantity (tons) |
|---------------------|------------------------|
| 2.00                | 1000                   |
| 2.50                | 1200                   |
| 3.00                | 1450                   |

```excel
=ECON.ELASTICITY.CROSS(B2:B4, A2:A4)
# Returns: +0.65 (substitutes)
# Positive: As margarine price ↑, butter demand ↑
```

**Example 2: Cars vs Gasoline (Complements)**

| Gasoline Price ($) | Car Sales (thousands) |
|--------------------|-----------------------|
| 2.50               | 120                   |
| 3.50               | 105                   |
| 4.50               | 88                    |

```excel
=ECON.ELASTICITY.CROSS(B2:B4, A2:A4)
# Returns: -0.32 (complements)
# Negative: As gas price ↑, car demand ↓
```

#### Example 5: Practical Policy Analysis

**Tax Impact Analysis:**

```excel
# Scenario: Government considers $0.50 tax on cigarettes
# Current: Price = $6.00, Quantity = 10,000,000 packs/year
# Measured elasticity: -0.45 (from data)

# Expected quantity after tax:
# New price = $6.50
# Price change % = (6.50-6.00)/6.00 = 8.33%
# Quantity change % = elasticity × price change %
#                   = -0.45 × 8.33% = -3.75%
# New quantity = 10,000,000 × (1 - 0.0375) = 9,625,000

# Tax revenue = $0.50 × 9,625,000 = $4,812,500
```

**Excel implementation:**

| Parameter                | Formula                              | Result      |
|--------------------------|--------------------------------------|-------------|
| Current Price            | 6.00                                 | $6.00       |
| Tax                      | 0.50                                 | $0.50       |
| New Price                | `=B1+B2`                             | $6.50       |
| Current Quantity         | 10000000                             | 10,000,000  |
| Elasticity               | -0.45                                | -0.45       |
| Price Change %           | `=(B3-B1)/B1`                        | 8.33%       |
| Quantity Change %        | `=B5*B6`                             | -3.75%      |
| New Quantity             | `=B4*(1+B7)`                         | 9,625,000   |
| Tax Revenue              | `=B2*B8`                             | $4,812,500  |

### Inequality Analysis

The toolkit provides comprehensive inequality measurement tools including Lorenz curves, Gini coefficients, and other inequality indices.

#### Example 1: Gini Coefficient

**Basic Calculation:**

```excel
# Income distribution in column A (one value per person/household)
=ECON.GINI(A:A)

# Returns value between 0 (perfect equality) and 1 (perfect inequality)
```

**Example (5-household economy):**

| Household | Income ($) |
|-----------|------------|
| 1         | 15,000     |
| 2         | 25,000     |
| 3         | 35,000     |
| 4         | 60,000     |
| 5         | 165,000    |

```excel
=ECON.GINI(B2:B6)
# Returns: 0.412 (moderate-high inequality)
```

**Interpretation:**
- 0.0 - 0.3: Low inequality (e.g., Nordic countries: ~0.25)
- 0.3 - 0.4: Moderate inequality (e.g., Germany: ~0.32)
- 0.4 - 0.5: High inequality (e.g., USA: ~0.41)
- 0.5+: Very high inequality (e.g., South Africa: ~0.63)

#### Example 2: Lorenz Curve Data

**Generate Lorenz Curve Coordinates:**

```excel
# Income data in A:A
# Returns two columns: cumulative population %, cumulative income %
=ECON.LORENZ(A:A)
```

**Example output:**

| Population % | Income % | Interpretation                    |
|--------------|----------|-----------------------------------|
| 0%           | 0%       | Starting point                    |
| 20%          | 5%       | Bottom 20% has 5% of income      |
| 40%          | 15%      | Bottom 40% has 15% of income     |
| 60%          | 32%      | Bottom 60% has 32% of income     |
| 80%          | 58%      | Bottom 80% has 58% of income     |
| 100%         | 100%     | Everyone has all income           |

**Creating a Lorenz Curve Chart:**

1. Select the data from `=ECON.LORENZ(A:A)`
2. Insert → Chart → Scatter Plot with Smooth Lines
3. Add diagonal line (0,0) to (100,100) for "perfect equality"
4. The area between your curve and diagonal = Gini coefficient

#### Example 3: Multiple Inequality Measures

**Comprehensive Inequality Analysis:**

```excel
# Income data in A2:A1000 (998 households)

# Gini Coefficient
=ECON.GINI(A:A)
# Returns: 0.385

# Atkinson Index (inequality aversion parameter = 1)
=ECON.ATKINSON(A:A, 1.0)
# Returns: 0.245

# Theil Index
=ECON.THEIL(A:A)
# Returns: 0.298

# 90/10 Percentile Ratio
=ECON.PERCENTILE.RATIO(A:A, 90, 10)
# Returns: 5.2 (90th percentile income is 5.2× the 10th percentile)

# Palma Ratio (top 10% vs bottom 40%)
=ECON.PALMA(A:A)
# Returns: 1.8 (top 10% has 1.8× income of bottom 40%)
```

**Comparison Table:**

| Measure               | Formula                           | Value | Interpretation         |
|-----------------------|-----------------------------------|-------|------------------------|
| Gini Coefficient      | `=ECON.GINI(A:A)`                | 0.385 | Moderate-High          |
| Atkinson (ε=1)        | `=ECON.ATKINSON(A:A, 1)`         | 0.245 | Moderate               |
| Theil Index           | `=ECON.THEIL(A:A)`               | 0.298 | Moderate               |
| 90/10 Ratio           | `=ECON.PERCENTILE.RATIO(A:A)`    | 5.2   | High dispersion        |
| Palma Ratio           | `=ECON.PALMA(A:A)`               | 1.8   | Moderate-High          |

#### Example 4: Time-Series Inequality Analysis

**Tracking Inequality Over Time:**

| Year | Gini  | 90/10 | Palma | Trend                |
|------|-------|-------|-------|----------------------|
| 1980 | 0.310 | 3.8   | 1.2   | Baseline             |
| 1990 | 0.335 | 4.2   | 1.4   | ↑ Rising             |
| 2000 | 0.368 | 4.8   | 1.6   | ↑↑ Rising faster     |
| 2010 | 0.392 | 5.5   | 1.9   | ↑↑ Continuing rise   |
| 2020 | 0.411 | 6.1   | 2.1   | ↑ Still rising       |

```excel
# For each year, income data in columns (B1980, B1990, ..., B2020)
# Calculate Gini for each year
=ECON.GINI(B1980:B1980)  # Year 1980
=ECON.GINI(B1990:B1990)  # Year 1990
# ... and so on
```

**Trend Analysis:**

```excel
# Calculate change in Gini (1980 to 2020)
=(Gini_2020 - Gini_1980)
# Returns: 0.101 (10.1 percentage point increase)

# Annualized change
=(Gini_2020 - Gini_1980) / 40
# Returns: 0.00253 (0.253 percentage points per year)
```

#### Example 5: International Comparison

**Comparing Inequality Across Countries:**

| Country       | Gini  | 90/10 | Atkinson | Income Data Source                           |
|---------------|-------|-------|----------|----------------------------------------------|
| Denmark       | 0.249 | 2.9   | 0.112    | `=ECON.WORLDBANK("SI.POV.GINI", "DK", ...)`|
| Germany       | 0.319 | 3.6   | 0.165    | `=ECON.WORLDBANK("SI.POV.GINI", "DE", ...)`|
| USA           | 0.411 | 6.1   | 0.285    | `=ECON.WORLDBANK("SI.POV.GINI", "US", ...)`|
| Brazil        | 0.489 | 8.4   | 0.398    | `=ECON.WORLDBANK("SI.POV.GINI", "BR", ...)`|
| South Africa  | 0.630 | 12.3  | 0.521    | `=ECON.WORLDBANK("SI.POV.GINI", "ZA", ...)`|

**Visualization:**
- Create bar chart comparing Gini coefficients
- Add threshold lines at 0.3, 0.4, 0.5 for reference
- Color code: Green (<0.3), Yellow (0.3-0.4), Orange (0.4-0.5), Red (>0.5)

### Working with Constraints

Economic models often require constraints (e.g., budget constraints, production possibilities, trade-offs). The toolkit provides constraint-handling functions.

#### Example 1: Budget Constraint

```excel
# Budget constraint: p1*x1 + p2*x2 ≤ I
# Price of good 1 (p1), Price of good 2 (p2), Income (I)

# Calculate maximum quantity of good 2 given quantity of good 1
=ECON.CONSTRAINT.BUDGET(price1, quantity1, price2, income)
```

**Example (Consumer choice):**

| Parameter        | Value  | Description                    |
|------------------|--------|--------------------------------|
| Income           | $1,000 | Monthly budget                 |
| Pizza Price      | $10    | Price per pizza                |
| Movie Price      | $15    | Price per movie ticket         |
| Pizzas bought    | 40     | Consumer buys 40 pizzas        |

```excel
# How many movies can consumer afford?
=ECON.CONSTRAINT.BUDGET(10, 40, 15, 1000)
# Formula: (Income - p1*q1) / p2 = (1000 - 10*40) / 15 = 40 movies

# Or use general constraint function:
=ECON.CONSTRAINT(
    "budget",
    [10, 15],          # Prices
    [40, ?],           # Quantities (? = unknown)
    1000               # Income
)
# Returns: 40 movies
```

**Budget Line Visualization:**

| Pizzas | Movies | On Budget? | Formula                    |
|--------|--------|------------|----------------------------|
| 0      | 66.7   | Yes        | `=1000/15`                |
| 25     | 50.0   | Yes        | `=(1000-10*25)/15`        |
| 50     | 33.3   | Yes        | `=(1000-10*50)/15`        |
| 75     | 16.7   | Yes        | `=(1000-10*75)/15`        |
| 100    | 0      | Yes        | `=(1000-10*100)/15`       |

#### Example 2: Production Possibilities Frontier (PPF)

```excel
# PPF: Economy can produce goods X and Y with limited resources
# Given production of X, find maximum production of Y

=ECON.CONSTRAINT.PPF(
    resourcesX,        # Resources allocated to X
    resourcesY,        # Resources allocated to Y
    totalResources,    # Total available resources
    productivityX,     # Productivity of X (output per resource unit)
    productivityY      # Productivity of Y (output per resource unit)
)
```

**Example (Guns vs Butter):**

| Resources to Guns | Output (Guns) | Resources to Butter | Output (Butter) | Total Resources |
|-------------------|---------------|---------------------|-----------------|-----------------|
| 0                 | 0             | 1000                | 5000            | 1000            |
| 200               | 400           | 800                 | 4000            | 1000            |
| 400               | 800           | 600                 | 3000            | 1000            |
| 600               | 1200          | 400                 | 2000            | 1000            |
| 800               | 1600          | 200                 | 1000            | 1000            |
| 1000              | 2000          | 0                   | 0               | 1000            |

```excel
# If producing 800 guns, how much butter can we produce?
=ECON.CONSTRAINT.PPF(400, ?, 1000, 2, 5)
# Returns: 3000 units of butter
```

#### Example 3: Trade-Off Analysis

```excel
# Analyze opportunity cost along a constraint

# Marginal Rate of Transformation (MRT)
=ECON.CONSTRAINT.MRT(goodX_data, goodY_data)
```

**Example:**

| Guns (ΔX) | Butter (ΔY) | MRT           | Interpretation               |
|-----------|-------------|---------------|------------------------------|
| 0→400     | 5000→4000   | -2.5          | 1 gun costs 2.5 butter       |
| 400→800   | 4000→3000   | -2.5          | Constant MRT (linear PPF)    |
| 800→1200  | 3000→2000   | -2.5          | Same opportunity cost        |

**For non-linear PPF:**

```excel
# Increasing opportunity cost scenario
=ECON.CONSTRAINT.MRT(A:A, B:B, "increasing")
```

| Guns  | Butter | MRT   | Opportunity Cost              |
|-------|--------|-------|-------------------------------|
| 0     | 5000   | N/A   | Starting point                |
| 300   | 4500   | -1.67 | 1 gun = 1.67 butter           |
| 600   | 3800   | -2.33 | 1 gun = 2.33 butter (↑)       |
| 900   | 2800   | -3.33 | 1 gun = 3.33 butter (↑↑)      |
| 1200  | 1400   | -4.67 | 1 gun = 4.67 butter (↑↑↑)     |

#### Example 4: Multi-Constraint Optimization

**Linear Programming Setup:**

```excel
# Maximize profit subject to multiple constraints
# Example: Factory produces products A and B

# Objective: Maximize profit = 50*A + 40*B
# Constraint 1 (Labor): 3*A + 2*B ≤ 1000 hours
# Constraint 2 (Materials): 2*A + 4*B ≤ 1200 units
# Constraint 3 (Demand): A ≤ 250 units
# Constraint 4: A, B ≥ 0

=ECON.OPTIMIZE.LINEAR(
    [50, 40],                  # Objective coefficients (profit)
    [[3, 2], [2, 4], [1, 0]],  # Constraint coefficients
    [1000, 1200, 250],         # Constraint limits
    "maximize"                 # Direction
)
```

**Returns:**

```
{
  "solution": [250, 125],     # A=250, B=125
  "objective": 17500,         # Maximum profit = $17,500
  "binding_constraints": [1, 3],  # Labor and demand constraints are binding
  "slack": [0, 350, 0]        # Material slack = 350 units
}
```

#### Example 5: Dynamic Constraints

**Intertemporal Budget Constraint:**

```excel
# Consumer saves/borrows across time periods
# Period 1 income: I1, Period 2 income: I2
# Interest rate: r

# Present value of lifetime income
=I1 + I2/(1+r)

# If consume C1 in period 1, maximum C2 in period 2:
=ECON.CONSTRAINT.INTERTEMPORAL(I1, I2, C1, r)
```

**Example:**

| Parameter       | Value    | Description                  |
|-----------------|----------|------------------------------|
| Income Year 1   | $50,000  | Current income               |
| Income Year 2   | $55,000  | Next year income             |
| Interest Rate   | 5%       | Savings/borrowing rate       |
| Consume Year 1  | $45,000  | Current consumption          |

```excel
# Maximum consumption in Year 2:
=ECON.CONSTRAINT.INTERTEMPORAL(50000, 55000, 45000, 0.05)
# Returns: $60,250
# Calculation: (50000 - 45000) × 1.05 + 55000 = 5250 + 55000 = 60,250
```

---

## Data Sources

The Excel Economic Toolkit integrates with 10 major economic data providers, giving you access to millions of time series covering global economic indicators.

### Overview Table

| Source     | Coverage                    | Series Count | Rate Limit        | API Key Required | Best For                        |
|------------|-----------------------------|--------------|-------------------|------------------|---------------------------------|
| FRED       | US Economic Data            | 800,000+     | 120/min (w/ key)  | Optional         | US macro data, Fed data         |
| World Bank | Global Development          | 16,000+      | 60/min            | No               | International comparison        |
| IMF        | Global Economic Outlook     | 34,000+      | 50/min            | No               | Cross-country forecasts         |
| OECD       | Developed Countries         | 9,000+       | 60/min            | No               | OECD member analysis            |
| ECB        | Eurozone                    | 14,000+      | 60/min            | No               | European monetary policy        |
| BEA        | US National Accounts        | 3,500+       | 100/min           | Optional         | US GDP components               |
| Census     | US Demographics & Trade     | 50,000+      | 500/min           | Yes              | US detailed statistics          |
| Eurostat   | European Union              | 1,000,000+   | 60/min            | No               | EU detailed statistics          |
| BIS        | Banking & Finance           | 4,500+       | 60/min            | No               | International banking           |
| DBnomics   | Aggregator (Multiple)       | 600,000,000+ | 100/min           | No               | Academic research               |

### Detailed Data Source Documentation

#### 1. FRED (Federal Reserve Economic Data)

**Provider:** Federal Reserve Bank of St. Louis
**Website:** https://fred.stlouisfed.org/
**API Documentation:** https://fred.stlouisfed.org/docs/api/

**Coverage:**
- 800,000+ time series from 100+ sources
- US economic indicators (GDP, inflation, unemployment, etc.)
- International data (select countries)
- Financial markets (interest rates, exchange rates, stock indices)
- Regional economic data (state/metro level)

**Excel Function:**

```excel
=ECON.FRED(series_id, start_date, end_date, [frequency])
```

**Parameters:**
- `series_id` (required): FRED series ID (e.g., "GDPC1")
- `start_date` (required): Start date (YYYY-MM-DD format)
- `end_date` (required): End date (YYYY-MM-DD format)
- `frequency` (optional): Data frequency - "d" (daily), "w" (weekly), "m" (monthly), "q" (quarterly), "a" (annual)

**Popular Series:**

| Series ID  | Description                              | Frequency | Units           |
|------------|------------------------------------------|-----------|-----------------|
| GDPC1      | Real GDP                                 | Quarterly | Billions $      |
| UNRATE     | Unemployment Rate                        | Monthly   | Percent         |
| CPIAUCSL   | Consumer Price Index                     | Monthly   | Index 1982=100  |
| FEDFUNDS   | Federal Funds Rate                       | Monthly   | Percent         |
| DGS10      | 10-Year Treasury Rate                    | Daily     | Percent         |
| DEXUSEU    | USD/EUR Exchange Rate                    | Daily     | USD per EUR     |
| GDP        | Nominal GDP                              | Quarterly | Billions $      |
| PAYEMS     | Nonfarm Payrolls                         | Monthly   | Thousands       |
| HOUST      | Housing Starts                           | Monthly   | Thousands       |
| RSXFS      | Retail Sales                             | Monthly   | Millions $      |

**Example Usage:**

```excel
# Fetch quarterly real GDP from 2020-2023
=ECON.FRED("GDPC1", "2020-01-01", "2023-12-31")

# Fetch daily 10-year Treasury rates for 2023
=ECON.FRED("DGS10", "2023-01-01", "2023-12-31", "d")

# Search for series
=ECON.FRED.SEARCH("unemployment")
# Returns list of series matching "unemployment"
```

**Rate Limits:**
- With API key: 120 requests/minute
- Without API key: 5 requests/minute
- Daily limit: Unlimited

**Get API Key:** Free at https://fredaccount.stlouisfed.org/apikeys

---

#### 2. World Bank

**Provider:** World Bank Group
**Website:** https://data.worldbank.org/
**API Documentation:** https://datahelpdesk.worldbank.org/knowledgebase/articles/889392

**Coverage:**
- 16,000+ development indicators
- 217 countries and regions
- Annual data (mostly), some quarterly
- Historical data back to 1960s
- Topics: poverty, education, health, infrastructure, environment, economy

**Excel Function:**

```excel
=ECON.WORLDBANK(indicator_code, country_code, start_date, end_date)
```

**Parameters:**
- `indicator_code` (required): World Bank indicator code (e.g., "NY.GDP.MKTP.CD")
- `country_code` (required): ISO 3166-1 alpha-2 or alpha-3 country code (e.g., "US" or "USA")
- `start_date` (required): Start year (YYYY format or YYYY-MM-DD)
- `end_date` (required): End year (YYYY format or YYYY-MM-DD)

**Popular Indicators:**

| Indicator Code       | Description                           | Frequency | Units          |
|----------------------|---------------------------------------|-----------|----------------|
| NY.GDP.MKTP.CD       | GDP (current US$)                     | Annual    | USD            |
| NY.GDP.PCAP.CD       | GDP per capita (current US$)          | Annual    | USD            |
| NY.GDP.MKTP.KD.ZG    | GDP growth (annual %)                 | Annual    | Percent        |
| SP.POP.TOTL          | Population, total                     | Annual    | People         |
| FP.CPI.TOTL.ZG       | Inflation, consumer prices (%)        | Annual    | Percent        |
| SL.UEM.TOTL.ZS       | Unemployment, total (%)               | Annual    | Percent        |
| NE.TRD.GNFS.ZS       | Trade (% of GDP)                      | Annual    | Percent        |
| SE.ADT.LITR.ZS       | Literacy rate, adult (%)              | Annual    | Percent        |
| SH.DYN.MORT          | Mortality rate, infant                | Annual    | per 1,000      |
| EN.ATM.CO2E.PC       | CO2 emissions (metric tons per cap.)  | Annual    | Metric tons    |

**Common Country Codes:**

| Code | Country        | Code | Country        | Code | Country        |
|------|----------------|------|----------------|------|----------------|
| US   | United States  | CN   | China          | DE   | Germany        |
| GB   | United Kingdom | JP   | Japan          | FR   | France         |
| IN   | India          | BR   | Brazil         | IT   | Italy          |
| CA   | Canada         | KR   | South Korea    | MX   | Mexico         |
| AU   | Australia      | RU   | Russia         | ES   | Spain          |

**Example Usage:**

```excel
# US GDP 2010-2023
=ECON.WORLDBANK("NY.GDP.MKTP.CD", "US", "2010", "2023")

# China population 2000-2023
=ECON.WORLDBANK("SP.POP.TOTL", "CN", "2000", "2023")

# Germany unemployment rate
=ECON.WORLDBANK("SL.UEM.TOTL.ZS", "DE", "2015", "2023")

# Search for indicators
=ECON.WORLDBANK.SEARCH("poverty")
```

**Rate Limits:**
- 60 requests/minute
- No API key required

---

#### 3. IMF (International Monetary Fund)

**Provider:** International Monetary Fund
**Website:** https://data.imf.org/
**API Documentation:** https://datahelp.imf.org/knowledgebase/articles/667681

**Coverage:**
- World Economic Outlook (WEO) database
- International Financial Statistics (IFS)
- Government Finance Statistics (GFS)
- Balance of Payments (BOP)
- 190+ countries, historical and forecast data

**Excel Function:**

```excel
=ECON.IMF(indicator_code, country_code, start_date, end_date, [database])
```

**Parameters:**
- `indicator_code` (required): IMF indicator code
- `country_code` (required): ISO 3-letter country code
- `start_date` (required): Start date (YYYY-MM-DD)
- `end_date` (required): End date (YYYY-MM-DD)
- `database` (optional): "WEO" (default), "IFS", "GFS", "BOP"

**Popular WEO Indicators:**

| Indicator Code | Description                              | Frequency | Units     |
|----------------|------------------------------------------|-----------|-----------|
| NGDP_RPCH      | GDP growth, constant prices              | Annual    | Percent   |
| NGDPD          | GDP, current prices                      | Annual    | Billions  |
| NGDPDPC        | GDP per capita, current prices           | Annual    | USD       |
| PCPIPCH        | Inflation, average consumer prices       | Annual    | Percent   |
| LUR            | Unemployment rate                        | Annual    | Percent   |
| GGXWDG_NGDP    | General government gross debt (% GDP)    | Annual    | Percent   |
| BCA_NGDPD      | Current account balance (% GDP)          | Annual    | Percent   |

**Example Usage:**

```excel
# US GDP growth forecasts
=ECON.IMF("NGDP_RPCH", "USA", "2020-01-01", "2025-12-31", "WEO")

# Germany government debt
=ECON.IMF("GGXWDG_NGDP", "DEU", "2010-01-01", "2023-12-31")
```

**Rate Limits:**
- 50 requests/minute
- No API key required

---

#### 4. OECD (Organisation for Economic Co-operation and Development)

**Provider:** OECD
**Website:** https://data.oecd.org/
**API Documentation:** https://data.oecd.org/api/

**Coverage:**
- 38 member countries + partners
- Economic indicators, social statistics
- Quarterly and annual data
- Topics: growth, productivity, trade, employment, education, health

**Excel Function:**

```excel
=ECON.OECD(indicator_code, country_code, start_date, end_date, [frequency])
```

**Popular Indicators:**

| Indicator Code | Description                      | Frequency | Units   |
|----------------|----------------------------------|-----------|---------|
| GDP            | Gross Domestic Product           | Quarterly | Index   |
| HUR            | Harmonised Unemployment Rate     | Monthly   | Percent |
| CPI            | Consumer Price Index             | Monthly   | Index   |
| STIR           | Short-term Interest Rates        | Monthly   | Percent |
| CLI            | Composite Leading Indicator      | Monthly   | Index   |

**Example Usage:**

```excel
=ECON.OECD("GDP", "USA", "2020-01-01", "2023-12-31", "Q")
```

**Rate Limits:**
- 60 requests/minute
- No API key required

---

#### 5. ECB (European Central Bank)

**Provider:** European Central Bank
**Website:** https://sdw.ecb.europa.eu/
**API Documentation:** https://sdw-wsrest.ecb.europa.eu/

**Coverage:**
- Eurozone economic and financial data
- Daily, monthly, quarterly, annual frequencies
- Interest rates, exchange rates, monetary aggregates
- Banking statistics, financial stability indicators

**Excel Function:**

```excel
=ECON.ECB(series_key, start_date, end_date)
```

**Popular Series:**

| Series Key                   | Description                    | Frequency |
|------------------------------|--------------------------------|-----------|
| FM.D.U2.EUR.4F.KR.MRR_FR.LEV | Main refinancing rate          | Daily     |
| EXR.D.USD.EUR.SP00.A         | EUR/USD exchange rate          | Daily     |
| ICP.M.U2.N.000000.4.ANR      | HICP - inflation               | Monthly   |

**Example Usage:**

```excel
=ECON.ECB("EXR.D.USD.EUR.SP00.A", "2023-01-01", "2023-12-31")
```

**Rate Limits:**
- 60 requests/minute
- No API key required

---

#### 6. BEA (Bureau of Economic Analysis)

**Provider:** US Bureau of Economic Analysis
**Website:** https://www.bea.gov/
**API Documentation:** https://apps.bea.gov/api/

**Coverage:**
- US national accounts (GDP and components)
- Regional economic data (state, metro, county)
- International transactions
- Industry accounts

**Excel Function:**

```excel
=ECON.BEA(table_name, line_number, start_date, end_date, [frequency])
```

**Popular Tables:**

| Table  | Description                          | Frequency |
|--------|--------------------------------------|-----------|
| T10101 | GDP                                  | Quarterly |
| T10105 | GDP by Industry                      | Quarterly |
| T20100 | Personal Income and Outlays          | Monthly   |

**Example Usage:**

```excel
=ECON.BEA("T10101", "1", "2020-01-01", "2023-12-31", "Q")
```

**Rate Limits:**
- 100 requests/minute (with API key)
- API key recommended (free)

---

#### 7. US Census Bureau

**Provider:** US Census Bureau
**Website:** https://www.census.gov/data.html
**API Documentation:** https://www.census.gov/data/developers/guidance/api-user-guide.html

**Coverage:**
- US demographic data
- Economic indicators (retail, manufacturing, construction)
- International trade
- Very detailed, granular data

**Excel Function:**

```excel
=ECON.CENSUS(dataset, variables, geography, start_date, end_date)
```

**Rate Limits:**
- 500 requests/minute (with API key)
- API key required

---

#### 8. Eurostat

**Provider:** Statistical Office of the European Union
**Website:** https://ec.europa.eu/eurostat
**API Documentation:** https://wikis.ec.europa.eu/display/EUROSTATHELP/API

**Coverage:**
- Comprehensive EU economic and social statistics
- 1,000,000+ time series
- All EU member states
- Topics: economy, population, social conditions, agriculture, environment

**Excel Function:**

```excel
=ECON.EUROSTAT(dataset_code, filters, start_date, end_date)
```

**Example Usage:**

```excel
=ECON.EUROSTAT("nama_10_gdp", "geo=EU27_2020", "2010", "2023")
```

**Rate Limits:**
- 60 requests/minute
- No API key required

---

#### 9. BIS (Bank for International Settlements)

**Provider:** Bank for International Settlements
**Website:** https://www.bis.org/statistics/
**API Documentation:** https://www.bis.org/statistics/api_documentation.htm

**Coverage:**
- International banking statistics
- Credit statistics
- Exchange rates
- Debt securities
- Central bank policy rates

**Excel Function:**

```excel
=ECON.BIS(dataset, reference_area, start_date, end_date)
```

**Example Usage:**

```excel
=ECON.BIS("WS_CBPOL", "US", "2020-01-01", "2023-12-31")
```

**Rate Limits:**
- 60 requests/minute
- No API key required

---

#### 10. DBnomics (Data Aggregator)

**Provider:** DBnomics (Open data platform)
**Website:** https://db.nomics.world/
**API Documentation:** https://api.db.nomics.world/v22/apidocs

**Coverage:**
- Aggregator of 600+ million series from 70+ providers
- Includes FRED, World Bank, IMF, ECB, and many others
- Unified API for multiple sources
- Excellent for academic research

**Excel Function:**

```excel
=ECON.DBNOMICS(provider_code, dataset_code, series_code, start_date, end_date)
```

**Example Usage:**

```excel
# Access FRED data through DBnomics
=ECON.DBNOMICS("FRED", "series", "GDPC1", "2020-01-01", "2023-12-31")

# Access Eurostat through DBnomics
=ECON.DBNOMICS("Eurostat", "nama_10_gdp", "...", "2020", "2023")
```

**Rate Limits:**
- 100 requests/minute
- No API key required

---

## Excel Functions Reference

### Data Fetching Functions

#### ECON.FRED

Fetch data from Federal Reserve Economic Data (FRED).

**Syntax:**
```excel
=ECON.FRED(series_id, start_date, end_date, [frequency])
```

**Arguments:**
- `series_id` (Text, required): FRED series identifier (e.g., "GDPC1")
- `start_date` (Date/Text, required): Start date in YYYY-MM-DD format
- `end_date` (Date/Text, required): End date in YYYY-MM-DD format
- `frequency` (Text, optional): Data frequency - "d", "w", "m", "q", "a"

**Returns:** Array with columns [Date, Value]

**Examples:**
```excel
=ECON.FRED("GDPC1", "2020-01-01", "2023-12-31")
=ECON.FRED("UNRATE", "2023-01-01", "2023-12-31", "m")
```

---

#### ECON.WORLDBANK

Fetch data from World Bank.

**Syntax:**
```excel
=ECON.WORLDBANK(indicator, country, start_date, end_date)
```

**Arguments:**
- `indicator` (Text, required): World Bank indicator code (e.g., "NY.GDP.MKTP.CD")
- `country` (Text, required): ISO country code (e.g., "US")
- `start_date` (Date/Text, required): Start year or date
- `end_date` (Date/Text, required): End year or date

**Returns:** Array with columns [Date, Value]

**Examples:**
```excel
=ECON.WORLDBANK("NY.GDP.MKTP.CD", "US", "2010", "2023")
=ECON.WORLDBANK("SP.POP.TOTL", "CN", "2000-01-01", "2023-12-31")
```

---

#### ECON.IMF, ECON.OECD, ECON.ECB, ECON.BEA, ECON.CENSUS, ECON.EUROSTAT, ECON.BIS, ECON.DBNOMICS

Similar syntax patterns as above. See [Data Sources](#data-sources) section for details.

---

### Economic Formula Functions

#### ECON.ELASTICITY

Calculate price elasticity of demand.

**Syntax:**
```excel
=ECON.ELASTICITY(quantities, prices, [method])
```

**Arguments:**
- `quantities` (Range, required): Quantity values
- `prices` (Range, required): Price values
- `method` (Text, optional): "midpoint" (default), "arc", "point", "log"

**Returns:** Elasticity coefficient (number)

**Examples:**
```excel
=ECON.ELASTICITY(B2:B10, A2:A10)
=ECON.ELASTICITY(B2:B10, A2:A10, "log")
```

---

#### ECON.ELASTICITY.INCOME

Calculate income elasticity of demand.

**Syntax:**
```excel
=ECON.ELASTICITY.INCOME(quantities, incomes)
```

**Returns:** Income elasticity coefficient

---

#### ECON.ELASTICITY.CROSS

Calculate cross-price elasticity.

**Syntax:**
```excel
=ECON.ELASTICITY.CROSS(quantities_x, prices_y)
```

**Returns:** Cross-price elasticity coefficient

---

#### ECON.GROWTH.YOY

Calculate year-over-year growth rate.

**Syntax:**
```excel
=ECON.GROWTH.YOY(values, dates)
```

**Arguments:**
- `values` (Range, required): Economic values (e.g., GDP)
- `dates` (Range, required): Corresponding dates

**Returns:** Array of YoY growth rates (%)

**Example:**
```excel
=ECON.GROWTH.YOY(A2:A50, B2:B50)
```

---

#### ECON.GROWTH.QOQ

Calculate quarter-over-quarter growth rate (annualized).

**Syntax:**
```excel
=ECON.GROWTH.QOQ(values, dates)
```

**Returns:** Array of annualized QoQ growth rates (%)

---

#### ECON.GROWTH.CAGR

Calculate compound annual growth rate.

**Syntax:**
```excel
=ECON.GROWTH.CAGR(values, dates)
```

**Returns:** CAGR over entire period (%)

---

#### ECON.GROWTH.REAL

Adjust nominal values for inflation.

**Syntax:**
```excel
=ECON.GROWTH.REAL(nominal_values, deflator)
```

**Arguments:**
- `nominal_values` (Range, required): Nominal GDP or other values
- `deflator` (Range, required): Price deflator (base year = 100)

**Returns:** Array of real (inflation-adjusted) values

---

#### ECON.GINI

Calculate Gini coefficient of inequality.

**Syntax:**
```excel
=ECON.GINI(incomes)
```

**Arguments:**
- `incomes` (Range, required): Income distribution data

**Returns:** Gini coefficient (0 to 1)

**Example:**
```excel
=ECON.GINI(A2:A1000)
# Returns: 0.385
```

---

#### ECON.LORENZ

Generate Lorenz curve coordinates.

**Syntax:**
```excel
=ECON.LORENZ(incomes)
```

**Returns:** Array with columns [Population %, Income %]

---

#### ECON.ATKINSON

Calculate Atkinson inequality index.

**Syntax:**
```excel
=ECON.ATKINSON(incomes, [epsilon])
```

**Arguments:**
- `incomes` (Range, required): Income distribution
- `epsilon` (Number, optional): Inequality aversion parameter (default: 1.0)

**Returns:** Atkinson index (0 to 1)

---

#### ECON.THEIL

Calculate Theil inequality index.

**Syntax:**
```excel
=ECON.THEIL(incomes)
```

**Returns:** Theil T index

---

#### ECON.PERCENTILE.RATIO

Calculate ratio between two percentiles.

**Syntax:**
```excel
=ECON.PERCENTILE.RATIO(incomes, [p1], [p2])
```

**Arguments:**
- `incomes` (Range, required): Income distribution
- `p1` (Number, optional): Higher percentile (default: 90)
- `p2` (Number, optional): Lower percentile (default: 10)

**Returns:** Ratio (e.g., 5.2 for 90/10 ratio)

---

#### ECON.PALMA

Calculate Palma ratio (top 10% vs bottom 40%).

**Syntax:**
```excel
=ECON.PALMA(incomes)
```

**Returns:** Palma ratio

---

### Utility Functions

#### ECON.VERSION

Get add-in version.

**Syntax:**
```excel
=ECON.VERSION()
```

**Returns:** Version string (e.g., "2.0.0")

---

#### ECON.CACHE.CLEAR

Clear data cache.

**Syntax:**
```excel
=ECON.CACHE.CLEAR([source])
```

**Arguments:**
- `source` (Text, optional): Clear specific source ("FRED", "WorldBank", etc.) or all if omitted

**Returns:** "Cache cleared"

---

#### ECON.SEARCH

Search for series across all data sources.

**Syntax:**
```excel
=ECON.SEARCH(query, [source])
```

**Arguments:**
- `query` (Text, required): Search keywords
- `source` (Text, optional): Specific source to search, or all if omitted

**Returns:** Array of matching series with metadata

**Example:**
```excel
=ECON.SEARCH("unemployment", "FRED")
```

---

## API Reference Overview

For developers integrating or extending the toolkit, the codebase is organized into clear modules:

### TypeScript API

Located in `/src/typescript/`

#### Adapters

**ISpreadsheetAdapter** (Interface)
- Abstraction layer for different spreadsheet platforms
- Methods: `getValue()`, `setValue()`, `getRange()`, `showNotification()`

**OfficeJsAdapter** (Excel Implementation)
- Implements `ISpreadsheetAdapter` for Microsoft Excel
- Uses Office.js API

**UnoAdapter** (LibreOffice Implementation)
- Implements `ISpreadsheetAdapter` for LibreOffice
- Uses UNO API

### Julia API

Located in `/src/julia/`

#### Data Sources Module

Each data source has a client class:

```julia
# Example: FRED Client
client = FREDClient(api_key="...")
data = fetch_series(client, "GDPC1", Date(2020,1,1), Date(2023,12,31))
```

**Common Methods:**
- `fetch_series(client, series_id, start_date, end_date)`: Fetch time series data
- `search_series(client, query)`: Search for series
- `get_series_info(client, series_id)`: Get metadata

#### Formulas Module

**Elasticity (`src/julia/formulas/elasticity.jl`)**
```julia
elasticity(quantities, prices; method=:midpoint)
income_elasticity(quantities, incomes)
cross_price_elasticity(quantities_x, prices_y)
```

**GDP Growth (`src/julia/formulas/gdp_growth.jl`)**
```julia
gdp_growth(values, dates; method=:yoy)
growth_yoy(values, dates)
growth_qoq(values, dates)
growth_cagr(values, dates)
```

**Lorenz/Gini (`src/julia/formulas/lorenz.jl`)**
```julia
gini_coefficient(incomes)
lorenz_curve(incomes)
atkinson_index(incomes; epsilon=1.0)
theil_index(incomes)
```

#### Utilities

**Cache (`src/julia/cache/sqlite_cache.jl`)**
```julia
cache = SQLiteCache(default_ttl=86400)
set_cached(cache, key, value)
get_cached(cache, key)
```

**Rate Limiter (`src/julia/utils/rate_limiter.jl`)**
```julia
limiter = RateLimiter(requests_per_minute)
wait_if_needed(limiter)
```

**Retry Logic (`src/julia/utils/retry.jl`)**
```julia
with_retry_and_cache(fetch_fn, cache, key, config)
```

### Building Custom Functions

**Example: Create a custom economic indicator**

```typescript
// src/typescript/custom-functions.ts
export async function calculateCustomIndicator(
  param1: number,
  param2: number
): Promise<number> {
  // Your logic here
  return result;
}
```

Register in manifest:

```xml
<CustomFunction id="CUSTOM_INDICATOR" name="ECON.CUSTOM">
  <Script><SourceLocation resid="Functions.Script.Url"/></Script>
  <Metadata>
    <Title resid="Functions.CUSTOM.Title"/>
    <Description resid="Functions.CUSTOM.Description"/>
  </Metadata>
</CustomFunction>
```

---

## Development Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** 20.0.0+
- **npm** 9.0.0+
- **Julia** 1.9+
- **Git**

### Clone and Install

```bash
# Clone repository
git clone https://github.com/Hyperpolymath/excel-economic-number-tool-.git
cd excel-economic-number-tool-

# Install Node dependencies
npm install

# Install Julia dependencies
julia --project=. -e 'using Pkg; Pkg.instantiate()'
```

### Development Workflow

#### Start Development Server

```bash
npm run dev
```

This starts a webpack dev server with hot module replacement. The add-in will reload automatically when you make changes.

#### Sideload Add-in in Excel

**Excel on Windows:**
1. Go to **Insert** → **Get Add-ins** → **My Add-ins** → **Upload My Add-in**
2. Browse to `manifest.xml` in your project
3. Click **Upload**

**Excel on Mac:**
1. Go to **Insert** → **Add-ins** → **My Add-ins** → **Add**
2. Select `manifest.xml`

**Excel Online:**
1. Go to **Insert** → **Office Add-ins**
2. Click **Upload My Add-in**
3. Upload `manifest.xml`

The add-in will connect to your local dev server at `https://localhost:3000`.

#### Sideload in LibreOffice

```bash
# Build LibreOffice extension
npm run build:libre

# Install extension
unopkg add dist/excel-economic-toolkit.oxt

# Or use LibreOffice Extension Manager GUI
```

### Project Structure

```
excel-economic-number-tool-/
├── src/
│   ├── typescript/          # TypeScript source code
│   │   ├── adapters/        # Platform adapters (Office.js, UNO)
│   │   ├── functions/       # Custom function implementations
│   │   └── taskpane/        # Task pane UI (if applicable)
│   └── julia/               # Julia backend
│       ├── data_sources/    # Data source clients
│       ├── formulas/        # Economic formulas
│       ├── utils/           # Utilities (cache, retry, rate limiter)
│       └── cache/           # Caching implementation
├── tests/                   # Test files
│   ├── typescript/          # TypeScript tests (Jest)
│   └── julia/               # Julia tests
├── dist/                    # Build output
├── docs/                    # Documentation
├── manifest.xml             # Excel add-in manifest
├── package.json             # npm configuration
├── tsconfig.json            # TypeScript configuration
├── webpack.config.js        # Webpack configuration
├── jest.config.js           # Jest test configuration
└── Project.toml             # Julia project configuration
```

### Environment Variables

Create a `.env` file in project root:

```bash
# Data source API keys
FRED_API_KEY=your_fred_api_key_here
BEA_API_KEY=your_bea_api_key_here
CENSUS_API_KEY=your_census_api_key_here

# Development settings
NODE_ENV=development
PORT=3000

# Cache settings
CACHE_TTL=86400  # 24 hours in seconds
CACHE_MAX_SIZE=1000  # Max cached items
```

### Configuration Files

**tsconfig.json** - TypeScript compiler options
**webpack.config.js** - Build configuration
**jest.config.js** - Test configuration
**Project.toml** - Julia dependencies

### Code Style

The project uses:
- **ESLint** for TypeScript linting
- **Prettier** for code formatting
- **TypeDoc** for documentation generation

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Generate documentation
npm run docs
```

### Debugging

#### Debug in VS Code

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Excel Add-in",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 9229
    }
  ]
}
```

Set breakpoints and press F5 to start debugging.

#### Debug Julia Code

```julia
# In Julia REPL
using Debugger
include("src/julia/formulas/elasticity.jl")
@enter elasticity([100.0, 90.0], [10.0, 12.0])
```

---

## Testing

The project includes comprehensive test coverage for both TypeScript and Julia components.

### Running Tests

```bash
# Run all tests
npm test

# Run TypeScript tests only
npm run test:typescript

# Run Julia tests only
julia --project=. test/runtests.jl

# Run tests with coverage
npm run test:coverage

# Watch mode (re-run on changes)
npm run test:watch
```

### Test Structure

#### TypeScript Tests (Jest)

Located in `tests/typescript/`

```typescript
// Example: tests/typescript/adapters/OfficeJsAdapter.test.ts
import { OfficeJsAdapter } from '../../../src/typescript/adapters/OfficeJsAdapter';

describe('OfficeJsAdapter', () => {
  it('should get cell value', async () => {
    const adapter = new OfficeJsAdapter();
    const value = await adapter.getValue('A1');
    expect(value).toBeDefined();
  });
});
```

Run specific test file:
```bash
npx jest tests/typescript/adapters/OfficeJsAdapter.test.ts
```

#### Julia Tests

Located in `test/`

```julia
# Example: test/formulas/elasticity_test.jl
using Test
include("../../src/julia/formulas/elasticity.jl")

@testset "Elasticity Tests" begin
    @testset "Midpoint Method" begin
        quantities = [100.0, 90.0]
        prices = [10.0, 12.0]
        ε = elasticity(quantities, prices)
        @test ε ≈ -0.526 atol=0.01
    end

    @testset "Log-log Method" begin
        quantities = [100.0, 90.0, 75.0]
        prices = [10.0, 12.0, 14.0]
        ε = elasticity(quantities, prices, method=:log)
        @test ε < 0  # Demand curve slopes down
    end
end
```

### Integration Tests

Test full data fetching workflow:

```bash
npm run test:integration
```

Example integration test:

```typescript
// tests/integration/fred-fetch.test.ts
describe('FRED Integration', () => {
  it('should fetch real GDP data', async () => {
    const result = await econFRED('GDPC1', '2023-01-01', '2023-12-31');
    expect(result).toHaveLength(4);  // 4 quarters
    expect(result[0]).toHaveProperty('date');
    expect(result[0]).toHaveProperty('value');
  });
});
```

### Test Coverage

Current coverage (target: >85%):

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   92.5  |   88.3   |   94.1  |   93.2  |
 adapters/          |   95.2  |   91.5   |   97.3  |   96.1  |
 data_sources/      |   91.3  |   86.7   |   92.8  |   91.9  |
 formulas/          |   93.8  |   89.2   |   95.6  |   94.5  |
 utils/             |   90.1  |   85.4   |   91.2  |   90.8  |
--------------------|---------|----------|---------|---------|
```

### Continuous Integration

GitHub Actions automatically runs tests on every push:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - uses: julia-actions/setup-julia@v1
        with:
          version: '1.9'
      - run: npm install
      - run: npm test
      - run: julia --project=. -e 'using Pkg; Pkg.test()'
```

---

## Building and Deployment

### Build for Production

```bash
# Build all components
npm run build

# Build TypeScript only
npm run build:typescript

# Build Excel-specific bundle
npm run build:excel

# Build LibreOffice-specific bundle
npm run build:libre
```

### Build Output

After running `npm run build`, the `dist/` folder contains:

```
dist/
├── index.js                  # Main bundle
├── index.js.map              # Source map
├── functions.json            # Custom functions metadata
├── excel/                    # Excel-specific build
│   ├── excel-addin.js
│   └── manifest.xml
└── libre/                    # LibreOffice-specific build
    ├── libre-addon.js
    └── extension.oxt
```

### Production Optimization

The production build includes:
- **Minification** (Terser)
- **Tree-shaking** (remove unused code)
- **Code splitting** (separate vendor bundles)
- **Compression** (gzip)

Typical bundle sizes:
- Main bundle: ~150 KB (gzipped)
- Vendor bundle: ~80 KB (gzipped)
- Total: ~230 KB

### Deployment Options

#### Option 1: Self-Hosted

Host the add-in on your own server:

1. Build production bundle
```bash
npm run build:excel
```

2. Upload `dist/excel/` to your server (HTTPS required)

3. Update `manifest.xml` with your server URL:
```xml
<SourceLocation DefaultValue="https://yourdomain.com/excel-addin.js"/>
```

4. Distribute `manifest.xml` to users

#### Option 2: Office Store (AppSource)

Publish to Microsoft AppSource for easy distribution:

1. Create a Partner Center account
2. Prepare submission package (manifest, screenshots, documentation)
3. Submit for validation
4. Once approved, users can install from Office Store

#### Option 3: LibreOffice Extension Repository

Publish to LibreOffice Extension Center:

1. Build LibreOffice extension:
```bash
npm run build:libre
```

2. Upload `dist/libre/extension.oxt` to https://extensions.libreoffice.org/

3. Users install via Extension Manager

#### Option 4: GitHub Releases

Simple distribution via GitHub:

1. Tag a release:
```bash
git tag v2.0.0
git push origin v2.0.0
```

2. Create GitHub Release with built artifacts

3. Users download from Releases page

### Versioning

Follow Semantic Versioning (SemVer):

- **MAJOR** (2.x.x): Breaking changes
- **MINOR** (x.1.x): New features, backward compatible
- **PATCH** (x.x.1): Bug fixes

Update version in:
- `package.json`
- `manifest.xml`
- `Project.toml`

### Update Manifest

```xml
<!-- manifest.xml -->
<Version>2.0.0</Version>
```

### Release Checklist

Before releasing a new version:

- [ ] Update version numbers in all files
- [ ] Run full test suite (`npm test`)
- [ ] Update CHANGELOG.md
- [ ] Build production bundles
- [ ] Test add-in in Excel and LibreOffice
- [ ] Create git tag
- [ ] Push to GitHub
- [ ] Create GitHub Release with binaries
- [ ] Update documentation
- [ ] Announce release

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Spreadsheet Layer                        │
│              (Microsoft Excel / LibreOffice)                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Office.js / UNO API
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                 TypeScript Adapter Layer                     │
│  ┌──────────────────┐          ┌───────────────────────┐    │
│  │ OfficeJsAdapter  │          │     UnoAdapter        │    │
│  │   (Excel)        │          │   (LibreOffice)       │    │
│  └──────────────────┘          └───────────────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ IPC / WebAssembly
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Julia Backend Layer                       │
│                                                              │
│  ┌────────────────┐  ┌───────────────┐  ┌────────────────┐ │
│  │  Data Sources  │  │   Formulas    │  │   Utilities    │ │
│  │                │  │               │  │                │ │
│  │  - FRED        │  │  - Elasticity │  │  - Cache       │ │
│  │  - World Bank  │  │  - Growth     │  │  - Rate Limit  │ │
│  │  - IMF         │  │  - Inequality │  │  - Retry       │ │
│  │  - ...         │  │  - ...        │  │  - ...         │ │
│  └────────┬───────┘  └───────────────┘  └────────────────┘ │
│           │                                                  │
│           │  ┌─────────────────────────────────────────┐    │
│           └─▶│        SQLite Cache Database            │    │
│              └─────────────────────────────────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  External Data Sources                       │
│  FRED │ World Bank │ IMF │ OECD │ ECB │ BEA │ Census │ ...  │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### 1. Spreadsheet Layer
- User interface
- Formula evaluation
- Data visualization
- Event handling

#### 2. TypeScript Adapter Layer
- Platform abstraction
- Custom function registration
- UI rendering (task pane, dialogs)
- Error handling and user feedback

#### 3. Julia Backend Layer
- Heavy computations
- Data fetching and processing
- Caching
- Rate limiting and retry logic

#### 4. Data Sources Module
- API clients for each provider
- Standardized data format
- Authentication handling
- Response parsing

#### 5. Formulas Module
- Economic calculations
- Statistical analysis
- Time series operations

#### 6. Utilities Module
- SQLite caching (persistent, TTL-based)
- Rate limiting (token bucket algorithm)
- Retry with exponential backoff
- Logging and diagnostics

### Data Flow

**Example: User requests FRED data**

1. User enters formula: `=ECON.FRED("GDPC1", "2020-01-01", "2023-12-31")`
2. Excel calls custom function via Office.js
3. TypeScript adapter validates parameters
4. Adapter calls Julia backend via IPC
5. Julia backend:
   - Checks cache (SQLite)
   - If cache miss: waits for rate limiter
   - Fetches from FRED API
   - Parses response
   - Stores in cache
   - Returns data
6. Adapter formats data for Excel
7. Excel displays result in cell

### Caching Strategy

**Three-tier caching:**

1. **Memory Cache** (Julia): Fast, volatile, limited size
2. **SQLite Cache** (Disk): Persistent, larger, TTL-based
3. **Stale Cache Fallback**: Return old data if API fails

**Cache Key Format:**
```
source:series_id:country:start_date:end_date
Example: fred:GDPC1::2020-01-01:2023-12-31
```

**TTL (Time-To-Live):**
- Default: 24 hours
- High-frequency data (daily): 1 hour
- Low-frequency data (annual): 7 days
- Configurable per source

### Rate Limiting

**Token Bucket Algorithm:**

```julia
struct RateLimiter
    capacity::Int              # Max tokens (requests)
    refill_rate::Float64       # Tokens per second
    tokens::Ref{Float64}       # Current tokens
    last_refill::Ref{DateTime} # Last refill time
end
```

**Example:**
- FRED with API key: 120 requests/minute = 2 req/sec
- Bucket capacity: 120 tokens
- Refill rate: 2 tokens/second
- If bucket empty, wait until tokens available

### Error Handling

**Error hierarchy:**

```
EconomicToolkitError
├── DataSourceError
│   ├── APIError (HTTP errors)
│   ├── RateLimitError
│   └── AuthenticationError
├── ValidationError (invalid parameters)
├── CacheError
└── CalculationError (formula errors)
```

**Retry Strategy:**

- Initial delay: 1 second
- Max retries: 3
- Exponential backoff: delay × 2^attempt
- Jitter: random 0-25% added to delay

**Fallback Behavior:**

1. Try fresh API call
2. On failure, retry with exponential backoff
3. If all retries fail, check stale cache
4. If stale cache available, return with warning
5. Otherwise, return error to user

### Performance Optimizations

1. **Lazy Loading**: Only load data sources when needed
2. **Batch Requests**: Combine multiple series requests
3. **Parallel Fetching**: Concurrent API calls (respecting rate limits)
4. **Compression**: Gzip compression for large responses
5. **Streaming**: Process large datasets incrementally
6. **Memoization**: Cache expensive calculations

### Security Considerations

1. **API Keys**: Stored securely, never in code
2. **HTTPS Only**: All external requests over HTTPS
3. **Input Validation**: Sanitize all user inputs
4. **Rate Limiting**: Prevent abuse
5. **Error Messages**: Don't leak sensitive information

---

## Contributing

We welcome contributions! Whether you're fixing bugs, adding features, improving documentation, or suggesting ideas, your help is appreciated.

### How to Contribute

1. **Fork the repository**
```bash
git clone https://github.com/YOUR_USERNAME/excel-economic-number-tool-.git
cd excel-economic-number-tool-
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

3. **Make your changes**
- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation

4. **Test your changes**
```bash
npm test
npm run lint
```

5. **Commit your changes**
```bash
git add .
git commit -m "Add feature: description of your changes"
```

Use conventional commit messages:
- `feat: Add new data source`
- `fix: Correct elasticity calculation`
- `docs: Update installation guide`
- `test: Add tests for GDP growth`
- `refactor: Simplify cache logic`

6. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

7. **Open a Pull Request**
- Go to original repository on GitHub
- Click "New Pull Request"
- Select your branch
- Describe your changes
- Link relevant issues

### Contribution Guidelines

#### Code Style

**TypeScript:**
- Use ESLint and Prettier (configured in project)
- Prefer `const` over `let`, avoid `var`
- Use descriptive variable names
- Add JSDoc comments for public functions
- Maximum line length: 100 characters

**Julia:**
- Follow Julia style guide
- Use meaningful variable names
- Add docstrings for all functions
- Type annotations for function signatures

#### Testing Requirements

- All new features must include tests
- Maintain or improve code coverage (target: >85%)
- Tests must pass before merging
- Include both unit and integration tests where appropriate

#### Documentation

- Update README if adding user-facing features
- Add inline comments for complex logic
- Update API documentation for new functions
- Include usage examples

### Areas for Contribution

#### High Priority

- [ ] Add new data sources (suggestions welcome!)
- [ ] Improve error messages and user feedback
- [ ] Performance optimizations
- [ ] Mobile support improvements
- [ ] Accessibility enhancements

#### Medium Priority

- [ ] Additional economic formulas
- [ ] Data visualization helpers
- [ ] Export/import functionality
- [ ] Internationalization (i18n)
- [ ] Tutorial videos and examples

#### Good First Issues

- [ ] Fix typos in documentation
- [ ] Add tests for existing functions
- [ ] Improve code comments
- [ ] Update outdated dependencies
- [ ] Create example workbooks

### Reporting Issues

**Bug Reports:**

Include:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- System information (OS, Excel version, add-in version)
- Error messages

**Feature Requests:**

Include:
- Use case / problem you're solving
- Proposed solution
- Alternatives considered
- Examples of desired behavior

### Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you agree to uphold this code. Please report unacceptable behavior to the maintainers.

**In brief:**
- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community

### Getting Help

- **Documentation**: Start with this README and code comments
- **GitHub Issues**: Search existing issues or open a new one
- **Discussions**: Use GitHub Discussions for questions and ideas

### Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- GitHub contributors page

Thank you for making this project better!

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Hyperpolymath

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### What This Means

**You are free to:**
- ✅ Use the software for commercial purposes
- ✅ Modify the software
- ✅ Distribute the software
- ✅ Use the software privately
- ✅ Sublicense the software

**Conditions:**
- Include the original copyright notice and license text
- The software is provided "as-is" without warranty

### Third-Party Licenses

This project uses the following open-source libraries:

- **Office.js** - Microsoft Office JavaScript API (MIT License)
- **TypeScript** - Microsoft (Apache 2.0)
- **Julia** - MIT License
- **Webpack** - MIT License
- **Jest** - MIT License
- Various npm packages (see package.json for full list)

### Data Source Licenses

When using this toolkit, you are subject to the terms of service of each data provider:

- **FRED**: Federal Reserve Bank of St. Louis (free, API key required for higher limits)
- **World Bank**: Open data, free to use with attribution
- **IMF**: Free for non-commercial use, attribution required
- **OECD**: Terms vary by dataset
- **ECB**: Free, subject to ECB terms
- **BEA**: US government data, public domain
- **Census**: US government data, public domain
- **Eurostat**: Free, subject to Eurostat copyright policy
- **BIS**: Free for non-commercial use
- **DBnomics**: Aggregator, subject to individual provider terms

**Important:** Always review and comply with each data provider's terms of service.

---

## Acknowledgments

### Data Providers

Special thanks to the organizations providing free access to economic data:

- **Federal Reserve Bank of St. Louis** for FRED
- **World Bank Group** for World Development Indicators
- **International Monetary Fund** for global economic data
- **OECD** for development statistics
- **European Central Bank** for eurozone data
- **US Bureau of Economic Analysis**
- **US Census Bureau**
- **Eurostat** (European Commission)
- **Bank for International Settlements**
- **DBnomics** for data aggregation

### Technology Stack

Built with excellent open-source tools:

- **TypeScript** - Type-safe JavaScript
- **Julia** - High-performance technical computing
- **Office.js** - Microsoft Office extensibility
- **Webpack** - Module bundler
- **Jest** - Testing framework
- **LibreOffice SDK** - Open-source office suite API

### Inspiration and Resources

This project was inspired by:

- **FRED Excel Add-in** (Federal Reserve)
- **Bloomberg Excel Add-in**
- **Python libraries**: `pandas-datareader`, `wbdata`, `fredapi`
- **R packages**: `quantmod`, `WDI`, `fredr`

### Academic Resources

Economic methodology references:

- **Principles of Economics** by N. Gregory Mankiw
- **Microeconomic Theory** by Mas-Colell, Whinston, and Green
- **Econometric Analysis** by William H. Greene
- **OECD Handbook on Constructing Composite Indicators**

### Contributors

Thank you to all contributors who have helped improve this project:

<!-- This section will be auto-generated from git history -->

See [CONTRIBUTORS.md](CONTRIBUTORS.md) for the full list.

### Community

Thanks to users who:
- Report bugs and suggest features
- Answer questions in discussions
- Share example workbooks
- Spread the word about the project

### Sponsor Opportunities

While this project is free and open-source, ongoing development and maintenance require time and resources. If you find this toolkit valuable:

- ⭐ Star the repository on GitHub
- 📢 Share with colleagues and on social media
- 🐛 Report bugs and suggest improvements
- 💻 Contribute code or documentation
- ☕ Consider sponsoring development (GitHub Sponsors)

Your support helps ensure continued development and maintenance!

---

## Screenshots

<!-- Placeholders for future screenshots -->

### Excel Integration

![Excel Screenshot](docs/screenshots/excel-main.png)
*Excel Economic Toolkit main interface showing FRED data import*

![Excel Chart](docs/screenshots/excel-chart.png)
*GDP growth analysis with automatic charting*

### LibreOffice Integration

![LibreOffice Screenshot](docs/screenshots/libre-main.png)
*LibreOffice Calc with Economic Toolkit functions*

### Task Pane

![Task Pane](docs/screenshots/taskpane.png)
*Data source browser and search interface*

### Lorenz Curve Visualization

![Lorenz Curve](docs/screenshots/lorenz-curve.png)
*Inequality analysis with Lorenz curve and Gini coefficient*

---

## Frequently Asked Questions

**Q: Is this free to use?**
A: Yes, the Excel Economic Toolkit is completely free and open-source (MIT License).

**Q: Do I need programming knowledge to use this?**
A: No. If you can use Excel formulas, you can use this toolkit. Just enter formulas like `=ECON.FRED("GDPC1", "2020-01-01", "2023-12-31")`.

**Q: Does it work offline?**
A: Partially. Previously fetched data is cached and available offline. New data requires internet connection.

**Q: Which Excel versions are supported?**
A: Excel 2016 or later (Windows, Mac), Excel Online, Excel Mobile (limited).

**Q: Can I use this for commercial purposes?**
A: Yes, the MIT License allows commercial use. However, check individual data provider terms.

**Q: How do I get API keys?**
A: Most data sources don't require keys. For FRED, sign up free at https://fredaccount.stlouisfed.org/apikeys

**Q: Is my data secure?**
A: Yes. All data stays on your computer. API keys are stored locally. No data is sent to third parties except the original data providers.

**Q: Can I contribute new data sources?**
A: Absolutely! See the [Contributing](#contributing) section. Pull requests welcome!

**Q: Where can I get help?**
A: Open an issue on GitHub, check existing documentation, or use GitHub Discussions.

---

## Changelog

### Version 2.0.0 (Current)

**Released:** 2024-01-15

**Major Changes:**
- Complete rewrite in TypeScript + Julia
- Added 10 data sources (previously 3)
- Improved caching with SQLite backend
- Enhanced error handling and retry logic
- LibreOffice support added
- Comprehensive inequality measures
- 150+ new economic formulas

**Breaking Changes:**
- Function signatures changed from v1.x
- Cache format incompatible with v1.x (auto-migrated)

**Bug Fixes:**
- Fixed elasticity calculation edge cases
- Corrected QoQ growth annualization
- Resolved cache race conditions

### Version 1.0.0

**Released:** 2023-06-01

- Initial release
- FRED, World Bank, IMF data sources
- Basic economic formulas
- Excel support only

For detailed changelog, see [CHANGELOG.md](CHANGELOG.md)

---

## Roadmap

### Version 2.1 (Q2 2024)

- [ ] Python API wrapper
- [ ] R package
- [ ] REST API server mode
- [ ] Advanced forecasting functions (ARIMA, exponential smoothing)
- [ ] Machine learning integration (scikit-learn)

### Version 2.2 (Q3 2024)

- [ ] Google Sheets support
- [ ] Web application (standalone)
- [ ] Mobile apps (iOS, Android)
- [ ] Collaborative features
- [ ] Cloud sync for cache

### Version 3.0 (Future)

- [ ] Real-time streaming data
- [ ] Custom data source builder
- [ ] Visual dashboard builder
- [ ] Natural language queries ("Show me US unemployment since 2020")
- [ ] AI-powered insights

---

## Contact and Support

**Repository:** https://github.com/Hyperpolymath/excel-economic-number-tool-

**Issues:** https://github.com/Hyperpolymath/excel-economic-number-tool-/issues

**Discussions:** https://github.com/Hyperpolymath/excel-economic-number-tool-/discussions

**Author:** Hyperpolymath

**Email:** [Contact via GitHub]

**Twitter:** [@Hyperpolymath](https://twitter.com/Hyperpolymath)

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Hyperpolymath/excel-economic-number-tool-&type=Date)](https://star-history.com/#Hyperpolymath/excel-economic-number-tool-&Date)

---

**Made with ❤️ by economists, for economists**

*Last updated: 2024-01-15*
