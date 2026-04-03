## Plan: Battery Calculator Multi-Phase Delivery

Deliver a production-ready App Router architecture in strict phases: convert static designs into reusable components/routes, add resilient cross-route Zustand state, scaffold a pure TypeScript calculation engine with placeholder economics for six revenue streams, wire a reactive results dashboard with branded DIN A4 PDF export via React-PDF (including chart embeds), then connect lead capture + installer onboarding to Supabase and transactional email. The approach favors early UI parity and deterministic typed contracts so backend and formula hardening can evolve safely.

**Steps**
1. Phase 1 - Componentization and Routing Foundation
1.1 Define canonical route map (strict sequence): Step 0 Landing -> Step 1 Questionnaire -> Step 2 Technical Inputs -> Step 3 Financial Inputs -> Final Results. Include installer branch: Installer Registration -> Installer Success (Unique URL) -> Enter Your Calculator.
1.2 Build shared shell components from design HTML: top navigation, left step rail, mobile step tabs, typography/button/input primitives, section wrappers.
1.3 Split/compose screen sections from static HTML into reusable React components (goal selector, technical form fields, financial form fields, load-profile uploader, results KPI blocks, lead modal shell).
1.4 Implement App Router pages and nested layouts to avoid duplicating nav/step chrome.
1.5 Implement Landing branching logic for persona routing (Private, Installer, Company), with Company following main calculator path unless separate requirements arrive.
1.6 Add temporary placeholder routes/pages only for non-MVP navigation actions that must remain visible (resources/support links) to avoid dead-end navigation; keep PDF as a committed implementation item in Phase 4.
Dependencies: This phase blocks all others. Parallelizable inside phase: component primitive creation can run in parallel with route scaffolding once route contracts are agreed.

2. Phase 2 - Global State (Zustand) Across Multi-Page Flow
2.1 Define strict TypeScript domain model for calculator state slices: persona, questionnaire goals, technical inputs, financial inputs, CSV metadata, derived results, lead form draft, installer profile draft.
2.2 Create centralized Zustand store with action API (setters, partial reset, full reset, step completion flags, hydration status).
2.3 Add persistence middleware for local-only save-progress behavior (localStorage), including versioned schema migration and selective persistence to avoid storing transient chart UI state.
2.4 Implement route guards using completion flags so users cannot access Results before required inputs exist; preserve back-navigation edits.
2.5 Wire Save Progress and Reset Data controls to store actions and user feedback states.
2.6 Define temporary CSV schema contract and parser state: expected columns (timestamp, consumption_kwh), accepted delimiters, parse error surface, and fallback to manual profile mode.
Dependencies: Depends on Phase 1 routes/components. Parallelizable: state type modeling and UI bindings can run in parallel after action contracts are frozen.

3. Phase 3 - Pure TypeScript Calculation Engine (Dummy Math Now)
3.1 Create calculation module boundaries (pure functions only): input normalization, six revenue stream calculators, aggregate metrics, projection generator.
3.2 Implement placeholder/dummy formulas for all six streams with explicit tunable coefficients:
- Self-Consumption
- PRL
- SRL/aFRR
- EPEX Arbitrage
- Peak Shaving
- VPP Participation
3.3 Implement explicit VPP cross-stream rule in the placeholder engine: if VPP Participation is enabled, apply a 12% bonus multiplier to both EPEX Arbitrage and balancing-energy calculations (PRL + SRL/aFRR).
3.4 Implement hardcoded regional solar-yield multipliers as baseline constants used by placeholder generation terms:
- North Germany: 900 kWh/kWp/year
- Central Germany: 950 kWh/kWp/year
- South Germany: 1000 kWh/kWp/year
3.5 Build aggregate outputs used by UI: annual revenue by stream, total annual revenue, ROI percent, payback years, yearly cumulative cashflow (15-year series), sensitivity to battery size.
3.6 Encode required assumptions from brief: annual battery degradation 2.5%; maintenance impact in year 10; EUR currency only.
3.7 Expose deterministic engine API for immediate recalculation on any relevant state change (especially battery size slider).
3.8 Add unit tests for engine determinism, non-negative/guardrail handling, and projection length/output shape.
Dependencies: Depends on Phase 2 typed state contracts. Parallelizable: test scaffolding can run in parallel with formula implementation.

4. Phase 4 - Results Dashboard Integration (Recharts + Live Recompute + React-PDF)
4.1 Integrate Recharts components for Revenue Split pie and 15-year projection chart (bar/line combo per design intent).
4.2 Build selector/adapter layer from engine outputs into chart-safe series and labels.
4.3 Wire Adjust Battery Size slider (5-30 kWh, 0.5 step) to Zustand + engine recomputation for instant KPI/chart refresh.
4.4 Ensure selected goals affect displayed/weighted streams (hidden/zeroed streams behavior explicitly defined).
4.5 Implement branded, print-ready DIN A4 PDF generation using React-PDF, including calculator branding, KPI summary blocks, revenue split chart, 15-year projection chart, assumptions/disclaimer text, and generation timestamp.
4.6 Connect CTA flows: Request Personalized Offer opens lead modal prefilled with latest calculated estimate; Download Detailed PDF Report triggers generation and download of the latest computed DIN A4 report.
4.7 Add responsive behavior and loading/skeleton states for first compute/hydration.
Dependencies: Depends on Phase 3 outputs and Phase 2 store. Parallelizable: chart component implementation, KPI card implementation, and PDF document template implementation can proceed in parallel.

5. Phase 5 - Lead Backend (Supabase + Email API Route)
5.1 Configure Supabase client separation (server/admin vs browser/public) and environment strategy for App Router.
5.2 Define database tables and RLS strategy:
- leads (contact + calc snapshot + persona)
- calculations (optional snapshot archive)
- installers (profile + generated slug + branding refs)
5.3 Implement lead submission API route with runtime validation, spam protection (honeypot/rate limit), Supabase insert, and structured error handling.
5.4 Implement email notification pipeline in same API flow using provider abstraction (Resend primary, Nodemailer fallback or env-selectable provider).
5.5 Implement installer registration backend flow: store company profile + logo, generate unique URL slug, persist record, return success payload.
5.6 Build installer success page to display generated unique URL and Enter Your Calculator action to redirect to installer-scoped calculator entry.
5.7 Add observability and retry-safe response semantics so duplicate submissions are minimized.
Dependencies: Depends on Phase 2/3 for payload shape and Phase 4 for final lead CTA wiring. Parallelizable: schema setup and API route scaffolding can run in parallel.

6. Cross-Phase Hardening and Delivery Gate
6.1 Accessibility pass (labels, focus traps in modal, keyboard nav for slider and step controls).
6.2 Error state design pass (CSV parse failures, API errors, email dispatch soft-fail messaging).
6.3 Performance pass (memoized selectors, chart render stability, avoid unnecessary store subscriptions).
6.4 Release checklist completion and stakeholder UAT walkthrough.
Dependencies: Final gate after Phase 5; selected hardening checks can begin earlier per phase.

**Relevant files**
- /home/moiz/random_tasks/battery-storage-calculator-v1/app/page.tsx - convert to Step 0 Landing role-selection entry.
- /home/moiz/random_tasks/battery-storage-calculator-v1/app/layout.tsx - root providers/fonts/metadata alignment.
- /home/moiz/random_tasks/battery-storage-calculator-v1/app/globals.css - minimalist black/white token layer and reusable utility classes.
- /home/moiz/random_tasks/battery-storage-calculator-v1/package.json - add Zustand, Recharts, PapaParse, React-PDF, Supabase, validation/email dependencies.
- /home/moiz/random_tasks/battery-storage-calculator-v1/designs/batterycalc_selection_landing_page/code.html - component extraction source for landing.
- /home/moiz/random_tasks/battery-storage-calculator-v1/designs/battery_calculator_step_1_goals/code.html - extraction source for questionnaire.
- /home/moiz/random_tasks/battery-storage-calculator-v1/designs/battery_calculator_step_2_system_details/code.html - extraction source for technical + financial input composition.
- /home/moiz/random_tasks/battery-storage-calculator-v1/designs/battery_calculator_final_results_dashboard/code.html - extraction source for KPI + chart dashboard.
- /home/moiz/random_tasks/battery-storage-calculator-v1/designs/soft_lead_capture_modal/code.html - extraction source for lead modal.
- /home/moiz/random_tasks/battery-storage-calculator-v1/designs/installer_registration_white_labeling/code.html - extraction source for installer onboarding.
- New file groups to create under project root: app/(routes for calculator/installers/api), components/(ui, layout, forms, charts), store/, lib/calculations/, lib/supabase/, types/, and optional tests/.

**Verification**
1. Routing and UX flow verification
- Confirm persona branch behavior from Landing for all 3 roles.
- Confirm canonical step order and guard behavior (cannot jump to Results without required inputs).
- Confirm installer path ends on success page with generated unique URL and working redirect button.

2. State and persistence verification
- Refresh/reopen browser and verify local Save Progress restores all expected form slices.
- Verify Reset Data clears persisted store and recalculation outputs.
- Validate CSV parse success/failure paths and manual fallback.

3. Calculation and dashboard verification
- Unit-test six stream outputs exist for every calculation run.
- Validate VPP rule: when VPP is enabled, EPEX and balancing (PRL + SRL/aFRR) outputs include the 12% bonus multiplier.
- Validate regional solar-yield constants are correctly applied (North 900, Central 950, South 1000 kWh/kWp/year).
- Verify slider movement triggers immediate KPI and chart updates without stale values.
- Validate 15-year projection length, monotonic assumptions, and year-10 maintenance impact.
- Verify Download Detailed PDF Report generates a branded, print-ready DIN A4 PDF with embedded chart visuals and current KPI values.

4. Backend and notifications verification
- Submit lead form and verify Supabase row creation with result snapshot.
- Verify email dispatch success path and graceful fallback/error path.
- Validate API input schema rejects malformed payloads.

5. Release gate verification
- Run lint/build checks.
- Perform responsive QA (desktop/tablet/mobile) on key pages.
- Run accessibility smoke checks for keyboard and screen-reader basics.

**Decisions**
- Dedicated Inverter Specs step is deferred; essential PV/wind-related fields are folded into Technical Inputs.
- Canonical user journey uses Step 0 + Step 1 + Step 2 + Step 3 + Final Results (with allowance to merge technical+financial UI sections if needed while preserving data completeness).
- Currency is EUR-only end-to-end.
- Save Progress is local-only in this release.
- CSV format starts with temporary schema definition for MVP.
- Placeholder calculation scaffolding must include: VPP-enabled 12% multiplier on EPEX and balancing energy (PRL + SRL/aFRR), plus regional solar-yield constants (North 900, Central 950, South 1000 kWh/kWp/year).
- Branded, print-ready DIN A4 PDF generation via React-PDF (with embedded charts) is a committed deliverable implemented in Phase 4.
- Installer onboarding ends on success page with generated unique URL and Enter Your Calculator redirect.

**Further Considerations**
1. Revenue stream weighting behavior: fixed percentages vs dynamic weighting by selected goals.
Recommendation: dynamic weighting with defaults that reproduce design mocks for first release.
2. Email provider strategy: Resend-only vs provider abstraction.
Recommendation: provider abstraction now to avoid refactor when SMTP-only environments appear.
3. PDF export implementation detail.
Recommendation: implement PDF generation in Phase 4 with React-PDF as a client-triggered download path; evaluate server-side rendering only if later required for automation or batch reporting.
