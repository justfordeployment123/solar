# Battery Storage Calculator - Calculation Engine Documentation
 
> **Prepared For:** MySolar-PV
> **Prepared By:** Markhor Systems  

---

This document outlines the core calculation logic, mathematical formulas, and financial projections used within the **Battery Storage Economic Viability Calculator**. This logic dictates how the application estimates the Return on Investment (ROI), payback periods, and the breakdown of various revenue streams over a 15-year lifecycle.

---

## 1. System Cost & Degradation Assumptions

Before calculating individual revenue streams, the engine establishes the baseline costs and physical limitations of the battery system.

| Parameter | Value / Assumption | Formula |
| :--- | :--- | :--- |
| **System Cost Estimation** | €1,000 per kWh | `Total Cost = Battery Capacity (kWh) * 1000` |
| **Battery Degradation** | 2.5% per year (linear) | `Revenue * (1 - 0.025)^(Year - 1)` |
| **Maintenance Cycle** | Major event at Year 10 | `10% of Initial Total System Cost` |

> *Note: Battery degradation scales down all active revenue streams starting from Year 2, reflecting the gradual reduction in functional capacity over the lifespan of the battery.*

---

## 2. Core Revenue Streams

The engine calculates up to seven distinct revenue streams based on user inputs and selected use cases. Each stream is evaluated concurrently and contributes to the total annual return.

### 2.1. Self-Consumption Optimization (Eigenverbrauch)
Calculates the savings achieved by storing excess solar energy and using it locally instead of purchasing from the grid.
* **Assumptions:** 250 cycles per year; 90% round-trip efficiency.
```math
Revenue = Electricity Price (€/kWh) * (Battery Capacity * 250) * 0.90
```

### 2.2. EPEX Arbitrage (Energiehandel / Spotmarkt)
Calculates profits from buying energy at low prices on the day-ahead spot market and selling/using it when prices are high.
* **Assumptions:** 300 active days/year; conservative price spread of €0.10/kWh; 90% efficiency.
```math
Revenue = Battery Capacity * 300 * €0.10 * 0.90
```

### 2.3. Primary Control Reserve (PRL / Primärregelleistung)
Revenue from providing high-speed frequency regulation to the national grid.
* **Assumptions:** Historical average price of €2,350 per MW per week.
```math
Revenue = Battery Capacity (kW) * (2350 / 1000) * 52 weeks
```

### 2.4. Secondary Control Reserve (SRL / aFRR)
Revenue from providing sustained balancing energy.
* **Assumptions:** Placeholder rate of €18 per kW annually.
```math
Revenue = Battery Capacity (kW) * €18
```

### 2.5. Peak Shaving (Lastspitzenkappung)
Calculates the reduction in industrial demand charges (Leistungspreis) by smoothing out consumption peaks.
* **Dependencies:** Inverter Power (kW), Demand Charge (€/kW), Reduction Percentage (%).
```math
Savings = Inverter Power (kW) * Demand Charge (€/kW) * (Reduction Percentage / 100)
```

### 2.6. Load Shifting (Lastverschiebung)
Calculates the profit of actively shifting grid feed-in to more lucrative time windows.
* **Dependencies:** Dynamic Tariff, Standard EEG Tariff, Grid Fees (Netzentgelte).
```math
Spread (€) = Max(0, Dynamic Tariff - Standard Tariff - Grid Fees) / 100
Revenue = Battery Capacity * 300 cycles * 0.90 efficiency * Spread (€)
```

### 2.7. Virtual Power Plant (VPP) Participation
If the user opts into the VPP network, the system generates value via two mechanisms:
1. **Direct Payout:** A fixed community payout scaled to the battery size (Baseline: ~€450/month per 41.9 kWh unit).
   ```math
   Payout = Battery Capacity * ((450 * 12) / 41.9)
   ```
2. **Trading Bonus:** The revenue from *EPEX Arbitrage*, *PRL*, and *SRL* is multiplied by **1.12** (a 12% uplift) due to the collective trading power of the VPP.

---

## 3. Financial Projections & KPIs

After calculating the Base Annual Revenue (Year 1), the engine models a 15-year lifecycle.

| KPI | Description | Formula |
| :--- | :--- | :--- |
| **Yearly Cashflow** | Net income per year | `Year N Revenue (Degraded) - Year N Costs` |
| **Payback Period** | Time to break-even | Interpolated year where `Cumulative Cashflow > 0` |
| **Return on Investment (ROI %)** | Total percentage return | `(Total 15-Year Revenue / Total Costs) * 100` |

---

## 4. Visualizations & Graphs

The final Results Dashboard and the exported **DIN A4 PDF Report** rely on two primary graphs to communicate the economic viability to the user:

#### Revenue Split (Einnahmen-Aufschlüsselung) - Pie Chart
Shows exactly how the total first-year income is distributed across the selected use cases (e.g., 40% PRL, 30% Self-Consumption, 30% EPEX). **Value:** Educates the customer on the impact of stacking multiple grid services.

#### 15-Year Cashflow (Cashflow-Prognose) - Bar/Line Chart
A time-series chart showing the cumulative financial return over 15 years. **Value:** Visually demonstrates the "Break-Even" point and accounts for the slight downward curve caused by annual battery degradation and the Year 10 hardware maintenance cost.