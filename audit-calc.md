# 🔍 Battery Storage Calculator — Full Audit

> **Scope:** Every non-admin file in the project, audited in batches of 5.
> **Generated:** 2026-06-13

---

## Batch 1 — Core Engine, Types & Store

Files reviewed:
1. [types/calculator.ts](file:///home/moiz/random_tasks/solar/types/calculator.ts)
2. [lib/calculations/engine.ts](file:///home/moiz/random_tasks/solar/lib/calculations/engine.ts)
3. [lib/calculator-settings.ts](file:///home/moiz/random_tasks/solar/lib/calculator-settings.ts)
4. [store/calculatorStore.ts](file:///home/moiz/random_tasks/solar/store/calculatorStore.ts)
5. [lib/calculator-settings-server.ts](file:///home/moiz/random_tasks/solar/lib/calculator-settings-server.ts)

---

### File 1: [types/calculator.ts](file:///home/moiz/random_tasks/solar/types/calculator.ts)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 2: [lib/calculations/engine.ts](file:///home/moiz/random_tasks/solar/lib/calculations/engine.ts)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|
| E1 | 🔴 High | 127 | **`baseOffset = totalCapacity * 250` is a magic constant with no physical justification** | 250 cycles × capacity is used as the raw self-consumption estimate. But this is a *cycle count* heuristic, not a physics-based kWh value. For a 10 kWh battery, `baseOffset = 2500 kWh`, meaning the engine believes 2.5 MWh of self-consumption is possible — that's 250 full charge/discharge cycles *before* any capping is applied. This constant is never tunable from admin settings and the comment doesn't justify the magnitude. If the admin changes `maxCyclesPerYear` to 300, the base offset still claims 250 — the two are decoupled, creating incoherent results. |
| E2 | 🔴 High | 349-353 | **Yearly projection uses `rawAnnualRevenueByStream` instead of `annualRevenueByStream`** | The 15-year cashflow loop decomposes revenue into `tradedRevenue` and `localRevenue` using the **raw** (pre-`ADJUSTMENT_FACTOR`) streams, then multiplies by `ADJUSTMENT_FACTOR` at the end (L353). This *appears* correct algebraically, but it means the `annualRevenueByStream` object (which *is* adjustment-scaled) is **not** the same breakdown you'd get if you summed the year-1 cashflow. This is inconsistent: `baseAnnualRevenue` (L331) uses the scaled values, but year 1's `yearRevenue` (L353) applies degradation/market decline from year 0 (factor = 1), then the adjustment again — they match numerically for year 1, but the code is confusing and fragile. If someone adds a new stream to `rawAnnualRevenueByStream` but forgets to add it to `tradedRevenue` or `localRevenue`, that stream silently disappears from the 15-year projection while still showing in the summary card. |
| E3 | 🔴 High | 268 | **Target-budget fallback uses `Math.max(estimatedSystemCost, targetBudget)` — always ignores the user's budget if it's lower** | When the user says "my budget is €20,000" but the capacity-based estimate is €30,000, the engine silently inflates the cost to €30,000. The `// FIX` comment says "we don't promise a system that physically can't be built at that price" — but the `estimatedSystemCost` is derived from `fallbackCostPerKwh`, a *default estimate*, not a physical floor. The **actual** physical floor is `minSystemCost` (L269). So a user with a real quote below the estimate gets their budget overridden to a higher fictional value, producing a pessimistic ROI. The logic should be `systemCost = Math.max(targetBudget, minSystemCost)` — respect the budget but enforce only the physical minimum. |
| E4 | 🟡 Medium | 286-287 | **EV charging margin uses `retailEurPerKwh` (retail electricity price) as cost basis — wrong for solar-charged EVs** | The EV margin is `sellPriceEurPerKwh - retailEurPerKwh`. But if the EV charger is powered by on-site solar + battery (the whole point of the app), the cost basis should be the feed-in tariff opportunity cost, not the retail purchase price. A user selling EV charging at 45 ct/kWh with a retail price of 35 ct/kWh sees only 10 ct/kWh margin; the real margin against forgone feed-in (e.g. 8 ct/kWh) is 37 ct/kWh. This massively understates EV revenue. |
| E5 | 🟡 Medium | 377 | **ROI formula double-counts the initial investment** | `roiPercent = ((totalOperatingCashflow15Years - totalUpfrontCost) / totalUpfrontCost) * 100`. `totalOperatingCashflow15Years` is the sum of year 1-15 cashflows (revenue minus maintenance). But ROI is typically `(netProfit / investment)`. Here `netProfit` = `totalOperatingCashflow15Years - totalUpfrontCost`, meaning the CapEx is subtracted *again* from the operating cashflows, when it was never included in them. This is actually correct if `totalOperatingCashflow15Years` is pure operating cash (it is). But if the user sees "ROI = 50%", they might think the 15-year projection shows `cumulative > 0` — but cumulative already starts at `-totalUpfrontCost`. The naming is misleading; this is **Net ROI** (profit / investment), which will be negative when `totalOperatingCashflow15Years < totalUpfrontCost`. This is technically correct but the label "ROI" without qualification is confusing. |
| E6 | 🟡 Medium | 313-314 | **Community battery-upgrade recommendation is naïve** | `shortfallPerDay = (totalDemandKwh - excessPvYield) / 365` then `recommendedBatteryUpgradeKwh = ceil(shortfallPerDay / 10) * 10`. A battery doesn't *generate* energy — it time-shifts it. If PV yield is insufficient to serve the community, more battery capacity won't help unless there's excess PV generation at other times. The recommendation should say "increase PV" or check if there's truly a timing mismatch, not blindly suggest more storage. |
| E7 | 🟡 Medium | 478-483 | **Sensitivity analysis doesn't vary inverter power** | The sensitivity sweep tests `[0.5×, 1×, 1.5×, 2×]` of battery capacity but keeps inverter power constant. For larger batteries, the inverter becomes the bottleneck (especially with a grid-export limit), so the curve flattens misleadingly. The user thinks "more battery = diminishing returns" when in reality it's "more battery + same inverter = diminishing returns". |
| E8 | 🟡 Medium | 475 | **Sensitivity analysis reuses parent scope's `evCharging` constant** | `calculateTestRevenue` adds `evCharging` (L475) from the outer scope. EV charging revenue doesn't change with battery size, but it still inflates every sensitivity point equally. While harmless to the *shape* of the curve, it means the Y-axis ("total annual revenue") is inaccurate for scenario comparison because it includes a constant not related to the battery. |
| E9 | 🟢 Low | 10-12 | **`normalizeElectricityPriceCents` heuristic is fragile** | `raw < 3` is assumed to mean "user entered euros, not cents" and gets multiplied by 100. But a valid entry of 2.5 ct/kWh (some industrial tariffs in Germany) would be silently inflated to 250 ct/kWh. A better heuristic: check against a plausible range (e.g. 5-80 ct/kWh) or require the UI to always pass cents. |
| E10 | 🟢 Low | 15-17 | **`substationLossFactor` starts deducting from 1 km** | `km <= 1 → factor = 1`, then 1% per extra km above 1. At 16 km: `1 - 0.01 * 15 = 0.85` (the floor). This implies a 15% loss at 16 km — realistic for MV lines but not documented or admin-tunable. |

---

### File 3: [lib/calculator-settings.ts](file:///home/moiz/random_tasks/solar/lib/calculator-settings.ts)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|
| S1 | 🟡 Medium | 86 | **`pickTier` uses half-open interval `[minKwh, maxKwh)` — boundary value 30 kWh falls into tier-2, not tier-1** | Tier-1 is `0–30 kWh` (label) but `maxKwh: 30` means `capacityKwh < 30` is required. A battery of exactly 30 kWh matches tier-2 (`minKwh: 30`). The label says "0–30 kWh" which users would expect to *include* 30. Minor mismatch but can cause incorrect cost/pricing at exact boundaries. |

---

### File 4: [store/calculatorStore.ts](file:///home/moiz/random_tasks/solar/store/calculatorStore.ts)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 5: [lib/calculator-settings-server.ts](file:///home/moiz/random_tasks/solar/lib/calculator-settings-server.ts)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

## Summary — Batch 1

| Severity | Count |
|----------|-------|
| 🔴 High | 4 |
| 🟡 Medium | 12 |
| 🟢 Low | 10 |

### Top 3 Issues to Fix First

2. **E3 — Target budget silently overridden** ([engine.ts:268](file:///home/moiz/random_tasks/solar/lib/calculations/engine.ts#L268)): User's budget is ignored if below the fallback estimate — produces pessimistic ROI.
3. **E1 — Magic constant 250 for self-consumption** ([engine.ts:127](file:///home/moiz/random_tasks/solar/lib/calculations/engine.ts#L127)): Not admin-tunable and decoupled from `maxCyclesPerYear`.

---

> ✅ Batch 1 complete.

---

## Batch 2 — Hydrator, Middleware, Calculator Layout, CSV Uploader, Supabase Clients

Files reviewed:
1. [components/settings-hydrator.tsx](file:///home/moiz/random_tasks/solar/components/settings-hydrator.tsx)
2. [middleware.ts](file:///home/moiz/random_tasks/solar/middleware.ts)
3. [app/calculator/layout.tsx](file:///home/moiz/random_tasks/solar/app/calculator/layout.tsx)
4. [components/forms/csv-uploader.tsx](file:///home/moiz/random_tasks/solar/components/forms/csv-uploader.tsx)
5. [lib/supabase/server.ts](file:///home/moiz/random_tasks/solar/lib/supabase/server.ts) + [lib/supabase/client.ts](file:///home/moiz/random_tasks/solar/lib/supabase/client.ts)

---

### File 6: [components/settings-hydrator.tsx](file:///home/moiz/random_tasks/solar/components/settings-hydrator.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 7: [middleware.ts](file:///home/moiz/random_tasks/solar/middleware.ts)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 8: [app/calculator/layout.tsx](file:///home/moiz/random_tasks/solar/app/calculator/layout.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 9: [components/forms/csv-uploader.tsx](file:///home/moiz/random_tasks/solar/components/forms/csv-uploader.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|
| CSV3 | 🟡 Medium | 155 | **`days` calculation assumes uniform intervals** | `days = validCount * (intervalMins / (60 * 24))`. This assumes every data point is exactly `intervalMins` apart. If there are gaps in the data (common in smart meter exports — maintenance windows, meter changes), `days` is understated, and the annualization on L164 (`totalKwh / days * 365`) over-inflates the annual consumption. |
| CSV4 | 🟡 Medium | 163-164 | **Annualization threshold of 350 days is arbitrary and undocumented** | `days < 350` triggers extrapolation. A 349-day dataset gets scaled up by `365/349 ≈ 1.046` — a 4.6% inflation. A 351-day dataset gets no scaling. The threshold should probably be configurable or at least clearly justified. Additionally, if `days` is very small (e.g. 1 day of data), the formula extrapolates wildly: `100 kWh / 1 * 365 = 36,500 kWh`. There's no minimum-days guard. |

---

### File 10: [lib/supabase/server.ts](file:///home/moiz/random_tasks/solar/lib/supabase/server.ts) + [lib/supabase/client.ts](file:///home/moiz/random_tasks/solar/lib/supabase/client.ts)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

## Summary — Batch 2

| Severity | Count |
|----------|-------|
| 🔴 High | 4 |
| 🟡 Medium | 10 |
| 🟢 Low | 7 |

### Top 3 Issues to Fix First


---

## Running Totals

| Severity | Batch 1 | Batch 2 | **Total** |
|----------|---------|---------|-----------|
| 🔴 High | 4 | 4 | **8** |
| 🟡 Medium | 12 | 10 | **22** |
| 🟢 Low | 10 | 7 | **17** |

---

> ✅ Batch 2 complete.

---

## Batch 3 — Step Pages, Results Dashboard & Projection Chart

Files reviewed:
1. [app/calculator/step-1/page.tsx](file:///home/moiz/random_tasks/solar/app/calculator/step-1/page.tsx)
2. [app/calculator/step-2/page.tsx](file:///home/moiz/random_tasks/solar/app/calculator/step-2/page.tsx)
3. [app/calculator/step-3/page.tsx](file:///home/moiz/random_tasks/solar/app/calculator/step-3/page.tsx)
4. [app/calculator/results/page.tsx](file:///home/moiz/random_tasks/solar/app/calculator/results/page.tsx)
5. [components/charts/projection-chart.tsx](file:///home/moiz/random_tasks/solar/components/charts/projection-chart.tsx)

---

### File 11: [app/calculator/step-1/page.tsx](file:///home/moiz/random_tasks/solar/app/calculator/step-1/page.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 12: [app/calculator/step-2/page.tsx](file:///home/moiz/random_tasks/solar/app/calculator/step-2/page.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|
| S2-6 | 🟢 Low | 47 | **`Math.max(0, ...)` silently clamps negative values** | If a user types `-5`, it becomes `0` with no feedback. They may think their input was accepted at the value they typed. |

---

### File 13: [app/calculator/step-3/page.tsx](file:///home/moiz/random_tasks/solar/app/calculator/step-3/page.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|
| S3-2 | 🟡 Medium | 196-204 | **Battery size recommendation formula is disconnected from the engine** | `recommendedKwh = Math.max(10, Math.ceil(estimatedConsumption / 1000) * 1.5)` — this simple heuristic ignores the user's selected goals, whether they want grid services (which benefit from larger batteries), PV size, and existing battery. A user with 5,000 kWh consumption gets "7.5 kWh" recommended, but if they selected EPEX + PRL, they'd benefit from 50+ kWh. The recommendation is misleadingly conservative. |
| S3-5 | 🟢 Low | 54 | **`peakShavingReductionPercentage` capped at 100 but not other percentage-like fields** | Only this one field gets `Math.min(100, parsed)`. If there were other percentage fields in the future, developers might forget to add the same cap. Should be generalized. |

---

### File 14: [app/calculator/results/page.tsx](file:///home/moiz/random_tasks/solar/app/calculator/results/page.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|
| R5 | 🟡 Medium | 184 | **`sliderMax = Math.max(100, safeInitial * 3, ...)` — slider range is unpredictable** | For a user who entered 10 kWh, `sliderMax` is `Math.max(100, 30, 10) = 100`. For 500 kWh it's `Math.max(100, 1500, 500) = 1500`. The slider scale varies wildly depending on initial capacity, making the control feel inconsistent. |

---

### File 15: [components/charts/projection-chart.tsx](file:///home/moiz/random_tasks/solar/components/charts/projection-chart.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

## Summary — Batch 3

| Severity | Count |
|----------|-------|
| 🔴 High | 4 |
| 🟡 Medium | 15 |
| 🟢 Low | 8 |

### Top 3 Issues to Fix First


---

## Running Totals

| Severity | Batch 1 | Batch 2 | Batch 3 | **Total** |
|----------|---------|---------|---------|-----------|
| 🔴 High | 4 | 4 | 4 | **12** |
| 🟡 Medium | 12 | 10 | 15 | **37** |
| 🟢 Low | 10 | 7 | 8 | **25** |

---

> ✅ Batch 3 complete.

---

## Batch 4 — Revenue Pie, Modals & Revenue Accordion

Files reviewed:
1. [components/charts/revenue-pie.tsx](file:///home/moiz/random_tasks/solar/components/charts/revenue-pie.tsx)
2. [components/modals/lead-capture-modal.tsx](file:///home/moiz/random_tasks/solar/components/modals/lead-capture-modal.tsx)
3. [components/modals/ev-upsell-modal.tsx](file:///home/moiz/random_tasks/solar/components/modals/ev-upsell-modal.tsx)
4. [components/modals/community-upsell-modal.tsx](file:///home/moiz/random_tasks/solar/components/modals/community-upsell-modal.tsx)
5. [components/layout/revenue-accordion.tsx](file:///home/moiz/random_tasks/solar/components/layout/revenue-accordion.tsx)

---

### File 16: [components/charts/revenue-pie.tsx](file:///home/moiz/random_tasks/solar/components/charts/revenue-pie.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 17: [components/modals/lead-capture-modal.tsx](file:///home/moiz/random_tasks/solar/components/modals/lead-capture-modal.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 18: [components/modals/ev-upsell-modal.tsx](file:///home/moiz/random_tasks/solar/components/modals/ev-upsell-modal.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|
| EV2 | 🟡 Medium | 73-77 | **`evNumChargers` is stored as a float** | `parseGermanFloat("2")` returns `2.0`, which is fine. But `parseGermanFloat("2,5")` returns `2.5`. Half a charger doesn't make physical sense. The field should use `Math.round()` or `parseInt()`. |

---

### File 19: [components/modals/community-upsell-modal.tsx](file:///home/moiz/random_tasks/solar/components/modals/community-upsell-modal.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|
| COM2 | 🟡 Medium | 72 | **`communityNumParties` stored as float** | `parseGermanFloat("5,5")` = 5.5 parties. The engine computes `totalDemandKwh = 5.5 * kwhPerParty` — fractional parties don't make sense. Should be rounded to an integer. |
| COM4 | 🟢 Low | 85 | **`totalDemand` preview recalculated every render** | `parseGermanFloat(parties) * parseGermanFloat(kwhPerParty)` runs on every render, even when the modal is about to return `null` because `!isOpen`. Should be gated or memoized. Wait — `!isOpen` returns null on L35, before L85 runs. So this is fine for the `!isOpen` case. But it runs on every re-render when the modal *is* open, which is technically on every keystroke. Minor perf concern. |

---

### File 20: [components/layout/revenue-accordion.tsx](file:///home/moiz/random_tasks/solar/components/layout/revenue-accordion.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

## Summary — Batch 4

| Severity | Count |
|----------|-------|
| 🔴 High | 1 |
| 🟡 Medium | 14 |
| 🟢 Low | 8 |

### Top 3 Issues to Fix First


---

## Running Totals

| Severity | Batch 1 | Batch 2 | Batch 3 | Batch 4 | **Total** |
|----------|---------|---------|---------|---------|-----------|
| 🔴 High | 4 | 4 | 4 | 1 | **13** |
| 🟡 Medium | 12 | 10 | 15 | 14 | **51** |
| 🟢 Low | 10 | 7 | 8 | 8 | **33** |

---

> ✅ Batch 4 complete.

---

## Batch 5 — Referral Modal, PDF Report, Info Modal, Installer Check & API Routes

Files reviewed:
1. [components/modals/referral-modal.tsx](file:///home/moiz/random_tasks/solar/components/modals/referral-modal.tsx)
2. [components/pdf/report-document.tsx](file:///home/moiz/random_tasks/solar/components/pdf/report-document.tsx)
3. [components/modals/info-modal.tsx](file:///home/moiz/random_tasks/solar/components/modals/info-modal.tsx) + [components/installer-check.tsx](file:///home/moiz/random_tasks/solar/components/installer-check.tsx)
4. [app/api/leads/route.ts](file:///home/moiz/random_tasks/solar/app/api/leads/route.ts)
5. [app/api/referral/route.ts](file:///home/moiz/random_tasks/solar/app/api/referral/route.ts) + [app/api/report/route.tsx](file:///home/moiz/random_tasks/solar/app/api/report/route.tsx)

---

### File 21: [components/modals/referral-modal.tsx](file:///home/moiz/random_tasks/solar/components/modals/referral-modal.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 22: [components/pdf/report-document.tsx](file:///home/moiz/random_tasks/solar/components/pdf/report-document.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 23: [components/modals/info-modal.tsx](file:///home/moiz/random_tasks/solar/components/modals/info-modal.tsx) + [components/installer-check.tsx](file:///home/moiz/random_tasks/solar/components/installer-check.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 24: [app/api/leads/route.ts](file:///home/moiz/random_tasks/solar/app/api/leads/route.ts)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 25: [app/api/referral/route.ts](file:///home/moiz/random_tasks/solar/app/api/referral/route.ts) + [app/api/report/route.tsx](file:///home/moiz/random_tasks/solar/app/api/report/route.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

## Summary — Batch 5

| Severity | Count |
|----------|-------|
| 🔴 High | 5 |
| 🟡 Medium | 13 |
| 🟢 Low | 4 |

### Top 3 Issues to Fix First


---

## Running Totals

| Severity | Batch 1 | Batch 2 | Batch 3 | Batch 4 | Batch 5 | **Total** |
|----------|---------|---------|---------|---------|---------|-----------|
| 🔴 High | 4 | 4 | 4 | 1 | 5 | **18** |
| 🟡 Medium | 12 | 10 | 15 | 14 | 13 | **64** |
| 🟢 Low | 10 | 7 | 8 | 8 | 4 | **37** |

---

> ✅ Batch 5 complete.

---

## Batch 6 — Landing Page, App Layout, Global Footer & Installer Pages

Files reviewed:
1. [app/layout.tsx](file:///home/moiz/random_tasks/solar/app/layout.tsx) + [app/page.tsx](file:///home/moiz/random_tasks/solar/app/page.tsx)
2. [app/landing-page.tsx](file:///home/moiz/random_tasks/solar/app/landing-page.tsx)
3. [components/global-footer.tsx](file:///home/moiz/random_tasks/solar/components/global-footer.tsx)
4. [app/i/[slug]/page.tsx](file:///home/moiz/random_tasks/solar/app/i/%5Bslug%5D/page.tsx)
5. [app/installers/page.tsx](file:///home/moiz/random_tasks/solar/app/installers/page.tsx)

---

### File 26: [app/layout.tsx](file:///home/moiz/random_tasks/solar/app/layout.tsx) + [app/page.tsx](file:///home/moiz/random_tasks/solar/app/page.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 27: [app/landing-page.tsx](file:///home/moiz/random_tasks/solar/app/landing-page.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 28: [components/global-footer.tsx](file:///home/moiz/random_tasks/solar/components/global-footer.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 29: [app/i/[slug]/page.tsx](file:///home/moiz/random_tasks/solar/app/i/%5Bslug%5D/page.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 30: [app/installers/page.tsx](file:///home/moiz/random_tasks/solar/app/installers/page.tsx)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

## Summary — Batch 6

| Severity | Count |
|----------|-------|
| 🔴 High | 5 |
| 🟡 Medium | 14 |
| 🟢 Low | 5 |

### Top 3 Issues to Fix First


---

## Batch 7 — Nav Components, UI Primitives & Remaining API Routes

Files reviewed:
1. [top-nav.tsx](file:///home/moiz/random_tasks/solar/components/layout/top-nav.tsx) + [side-nav.tsx](file:///home/moiz/random_tasks/solar/components/layout/side-nav.tsx) + [mobile-bottom-nav.tsx](file:///home/moiz/random_tasks/solar/components/layout/mobile-bottom-nav.tsx) + [progress-header.tsx](file:///home/moiz/random_tasks/solar/components/layout/progress-header.tsx)
2. [button.tsx](file:///home/moiz/random_tasks/solar/components/ui/button.tsx) + [input.tsx](file:///home/moiz/random_tasks/solar/components/ui/input.tsx) + [select.tsx](file:///home/moiz/random_tasks/solar/components/ui/select.tsx) + [radio-card.tsx](file:///home/moiz/random_tasks/solar/components/ui/radio-card.tsx)
3. [cron/reminders/route.ts](file:///home/moiz/random_tasks/solar/app/api/cron/reminders/route.ts) + [calculator-settings/route.ts](file:///home/moiz/random_tasks/solar/app/api/calculator-settings/route.ts)

---

### File 31: Nav Components

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|
| NAV5 | 🟡 Medium | progress:13 | **`progressPercentage = (currentStep / totalSteps) * 100` — visual convention unclear** | Step 1 of 3 shows 33% — users may expect an empty bar at start. Minor UX expectation mismatch depending on convention chosen. |

---

### File 32: UI Primitives

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

### File 33: API Routes (cron/reminders + calculator-settings)

| # | Severity | Line(s) | Issue | Detail |
|---|----------|---------|-------|--------|

---

## Summary — Batch 7

| Severity | Count |
|----------|-------|
| 🔴 High | 3 |
| 🟡 Medium | 12 |
| 🟢 Low | 4 |

### Top 3 Issues to Fix First

1. **NAV1** — Mobile nav uses fragment `#` links — step navigation is completely broken on mobile.
2. **CRON2** — Exact-day equality means one skipped cron run permanently loses the billing reminder.

---

## Running Totals

| Severity | Batch 1 | Batch 2 | Batch 3 | Batch 4 | Batch 5 | Batch 6 | Batch 7 | **Total** |
|----------|---------|---------|---------|---------|---------|---------|---------|-----------|
| 🔴 High | 4 | 4 | 4 | 1 | 5 | 5 | 3 | **26** |
| 🟡 Medium | 12 | 10 | 15 | 14 | 13 | 14 | 12 | **90** |
| 🟢 Low | 10 | 7 | 8 | 8 | 4 | 5 | 4 | **46** |
| **Total** | **26** | **21** | **27** | **23** | **22** | **24** | **19** | **162** |

---

## ✅ AUDIT COMPLETE — Master Summary

**Total issues found across 35 files: 162**

---

### 🔴 Top 10 Critical Issues (Fix Immediately)

| ID | File | Issue |
|----|------|-------|

---

### 🟡 Top 10 Important Issues (Fix Soon)

| ID | File | Issue |
|----|------|-------|

---

> ✅ **Full audit complete across all 35 non-admin files. 162 issues documented: 26 High, 90 Medium, 46 Low.**
