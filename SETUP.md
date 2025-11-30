# Car Economics Calculator - Setup Guide

## Project Overview

A comprehensive Angular web application with Tailwind CSS that helps users compare the economic viability of different car purchases based on:

### Key Input Parameters
- **Car Name/Model** - The vehicle you want to analyze
- **Purchase Price** - Initial cost of the vehicle
- **Daily Kilometers** - Expected daily usage
- **Fuel Type** - Petrol, Diesel, CNG, Hybrid, or Electric
- **Fuel Cost** - Current price per liter/kWh
- **Fuel Efficiency** (Optional) - km/liter (auto-filled based on fuel type)
- **Maintenance Cost** (Optional) - ₹/km (auto-filled based on fuel type)

### Calculated Outputs
- **Daily Cost Breakdown** - Fuel, Maintenance, and Depreciation
- **Monthly & Yearly Cost Estimates**
- **Cost Per Kilometer**
- **Most Economical Vehicle** - Automatic comparison and recommendation

## Suggested Additional Constraints

To make the calculator even more comprehensive, consider adding:

1. **Insurance Cost** (₹/year or % of vehicle value)
   - Varies by vehicle type, engine capacity, and coverage type

2. **Registration & Tax Costs**
   - Annual registration fees
   - Road tax (varies by state)
   - Toll costs estimation

3. **Warranty & Service Package Costs**
   - Extended warranty impact
   - Free service periods

4. **Loan & Financing Costs** (Optional)
   - EMI amount
   - Interest rate impact
   - Down payment consideration

5. **Resale Value Projection**
   - More accurate depreciation based on make/model
   - Residual value percentage

6. **Environmental Impact Scoring** (Optional)
   - CO2 emissions comparison
   - EV charging infrastructure availability

7. **Battery Replacement Cost** (For EV)
   - Critical factor for electric vehicles
   - Battery degradation timeline

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Angular CLI (optional, for development)

### Installation Steps

```bash
# Install dependencies
npm install

# Development server
npm start
# Navigate to http://localhost:4200/

# Build for production
npm run build
# Output: dist/car-buying-economics/
```

## Technology Stack

- **Angular 19** - Standalone components, reactive forms
- **Tailwind CSS 3** - Utility-first CSS framework
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming (via Angular)

## Project Structure

```
src/
├── app/
│   ├── app.ts           - Main component with calculator logic
│   ├── app.html         - Template with form and results display
│   ├── app.scss         - Styles (Tailwind directives)
│   └── app.config.ts    - Angular configuration
├── styles.scss          - Global styles
├── main.ts              - Application entry point
└── index.html           - Root HTML

tailwind.config.js       - Tailwind configuration
postcss.config.js        - PostCSS configuration
```

## Key Features Implemented

1. **Reactive Forms** - Form validation and dynamic field updates
2. **Real-time Calculations** - Instant cost comparisons
3. **Automatic Suggestions** - Default efficiency and maintenance costs
4. **Responsive Design** - Mobile-friendly UI with Tailwind CSS
5. **Comparison Interface** - Side-by-side cost analysis
6. **Data Persistence Ready** - Structure supports future localStorage/backend integration

## Default Values (Customizable)

### Fuel Efficiency (km/liter)
- Petrol: 15 km/l
- Diesel: 18 km/l
- CNG: 22 km/l
- Hybrid: 20 km/l
- Electric: User-specified (kWh/km)

### Maintenance Cost (₹/km)
- Petrol: 0.5
- Diesel: 0.6
- CNG: 0.4
- Hybrid: 0.4
- Electric: 0.2

### Depreciation Calculation
- Assumes 80% depreciation over 5 years
- Based on total kilometers driven
- Formula: (Purchase Price × 0.8) / (Daily KM × 365 × 5 years)

## Future Enhancements

1. **Data Persistence** - Save vehicle comparisons to browser/cloud
2. **Export Reports** - PDF/CSV export of comparisons
3. **Real-time Fuel Prices** - API integration with fuel price data
4. **User Accounts** - Track multiple comparisons over time
5. **Advanced Analytics** - Charts showing cost trends
6. **Loan Calculator** - EMI and financing impact
7. **Insurance Integration** - Real insurance premium quotes
8. **API Backend** - Connect to real vehicle databases

## Development Commands

```bash
# Start development server with hot reload
ng serve

# Run tests
ng test

# Build for production
ng build --configuration production

# Analyze bundle size
ng build --stats-json
webpack-bundle-analyzer dist/car-buying-economics/stats.json

# Format code
npm run lint -- --fix
```

## Testing the Application

### Sample Data Included
The app comes with two pre-loaded vehicles:
- Honda City (Petrol)
- Maruti Swift (Petrol)

### How to Use
1. View the pre-loaded cars and their cost breakdowns
2. Add a new car using the form at the top
3. The most economical option is highlighted automatically
4. Remove cars to compare different combinations
5. Click "Reset" to reload the sample cars

## Troubleshooting

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Angular cache: `ng cache clean`

### Styling Issues
- Rebuild Tailwind: `npm run build`
- Check `tailwind.config.js` content paths

### Port Already in Use
- Change default port: `ng serve --port 4201`

## License

This project is open source and available for personal and educational use.

## Contact & Support

For issues, feature requests, or contributions, please feel free to reach out or submit a pull request.
