# Car Buying Economics - AI Coding Agent Instructions

## Project Overview

A single-page Angular 20 calculator that compares total cost of ownership across vehicles. Users enter car parameters and the app calculates daily/monthly/yearly costs with automatic recommendations of the most economical vehicle.

## Architecture & Data Flow

**Standalone Angular Component Pattern**: `src/app/app.ts` is the single root component (standalone: true) with reactive forms. No traditional module structure.

**Core Data Model**:
- `CarData`: User input (name, purchasePrice, dailyKilometers, fuelType, fuelCost, optional fuelEfficiency/maintenanceCostPerKm)
- `CarEconomics`: Calculated outputs (dailyCost, monthlyCost, yearlyCost, costPerKm, and cost breakdowns by category)

**Calculation Logic** (`calculateEconomics` method):
1. Daily fuel cost: `(dailyKm / fuelEfficiency) * fuelCost`
2. Daily maintenance: `dailyKm * maintenanceCostPerKm`
3. Daily depreciation: `(purchasePrice * 0.8) / (dailyKm * 365 * 5 years)` - assumes 20% residual value over 5 years
4. All costs aggregated to monthly/yearly with rounding to 2 decimals

**Smart Defaults**: `fuelEfficiencyMap` and `maintenanceCostMap` auto-populate based on fuel type (petrol: 15 km/L, diesel: 18, CNG: 22, hybrid: 20, electric: 0). These trigger on `onFuelTypeChange()`.

## Key Conventions

- **Reactive Forms**: All form interactions use `FormBuilder` with Validators (required, min). Reference `carForm.value` for input data.
- **Integer Currency**: All costs in ₹ (Indian Rupees) without decimal display in templates; round values with `Math.round(x * 100) / 100` before storage.
- **Array-based State**: Cars stored in `cars[]` array; derived `economics[]` array computed via `calculateAllEconomics()`. No NgRx or service layer.
- **Comparison Pattern**: `findMostEconomical()` uses reduce to find minimum dailyCost—update this if adding new comparison metrics.

## Development Workflow

### Local Development
```bash
npm start          # ng serve on http://localhost:4200/ with auto-reload
npm test           # Karma + Jasmine test runner
npm run build      # Production build → dist/car-buying-economics/
npm run watch      # ng build --watch for incremental builds
```

### Testing Patterns
- Tests in `*.spec.ts` files (currently basic integration tests)
- Use `TestBed.configureTestingModule` for component testing with standalone imports
- Test calculator logic via public methods like `calculateEconomics(carData)`

## UI & Styling

- **Tailwind CSS 3**: Utility-first design; configured in `tailwind.config.js` with content scanning on `src/**/*.{html,ts}`
- **PostCSS**: Auto-prefixed via `postcss.config.js`; import Tailwind directives in `src/styles.scss`
- **Component Styles**: `app.scss` imported per-component; use `@apply` for custom utility composition
- **Responsive Grid**: Form uses `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for mobile-first layout
- **Branding Colors**: Indigo gradient (from-indigo-600 to-indigo-700 headers) with blue-50 to indigo-100 background

## Extending the Calculator

When adding features (insurance, taxes, financing):
1. Extend `CarData` interface with new fields
2. Add form control in `carForm` group (e.g., `insuranceCost: ['']`)
3. Calculate in `calculateEconomics()` following the `fuelCostDaily + maintenanceCostDaily + ...` pattern
4. Add breakdown to `CarEconomics` interface (e.g., `insuranceCostDaily`)
5. Update `findMostEconomical()` if comparison logic changes beyond dailyCost
6. Bind new results in template (`app.html`) using `*ngFor` over `economics[]`

## External Dependencies

- **@angular/forms**: ReactiveFormsModule for form handling
- **@angular/router**: Provided but app is single-page; routes defined in `app.routes.ts`
- **RxJS**: Available via Angular but not directly used in component (pure imperative logic)
- **Tailwind CSS**: Installed; ensure build includes `src/**/*.{html,ts}` in content config

## Common Pitfalls

- Depreciation assumes fixed 5-year horizon and 20% residual value—make configurable before extending
- Electric vehicle efficiency hardcoded to 0; requires user input (design choice, not bug)
- No backend—all data in-memory; reset on page refresh
- Form validation only checks required/min; add cross-field validators if adding dependent fields (e.g., loan EMI depends on purchasePrice)

## Other recommendations
- Always make it mobile responsive

