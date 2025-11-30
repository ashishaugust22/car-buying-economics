import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface CarData {
  name: string;
  purchasePrice: number;
  dailyKilometers: number;
  fuelType: string;
  fuelCost: number;
  fuelEfficiency?: number;
  maintenanceCostPerKm?: number;
}

interface CarEconomics {
  name: string;
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  costPerKm: number;
  fuelCostDaily: number;
  maintenanceCostDaily: number;
  depreciationDaily: number;
  roiGuidance?: ROIGuidance[];
}

interface ROIGuidance {
  year: number;
  totalCost: number;
  costPerYear: number;
  residualValue: number;
  netCost: number;
  recommendation: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  appTitle = 'Car Economics Calculator';
  brandName = 'Engage Technologies';
  carForm: FormGroup;
  cars: CarData[] = [];
  economics: CarEconomics[] = [];
  mostEconomical: CarEconomics | null = null;

  // Typical fuel efficiency (km/liter) by fuel type
  fuelEfficiencyMap: { [key: string]: number } = {
    'petrol': 15,
    'diesel': 18,
    'cng': 22,
    'electric': 0, // kWh per km, user should specify
    'hybrid': 20
  };

  // Typical maintenance cost per km
  maintenanceCostMap: { [key: string]: number } = {
    'petrol': 0.5,
    'diesel': 0.6,
    'cng': 0.4,
    'electric': 0.2,
    'hybrid': 0.4
  };

  years: number = 5; // Depreciation over 5 years

  constructor(private fb: FormBuilder) {
    this.carForm = this.fb.group({
      name: ['', Validators.required],
      purchasePrice: ['', [Validators.required, Validators.min(0)]],
      dailyKilometers: ['', [Validators.required, Validators.min(0)]],
      fuelType: ['petrol', Validators.required],
      fuelCost: ['', [Validators.required, Validators.min(0)]],
      fuelEfficiency: [''],
      maintenanceCostPerKm: ['']
    });
  }

  ngOnInit() {
    // Example car data
    this.addExampleCars();
  }

  addExampleCars() {
    this.cars = [
      {
        name: 'Honda City',
        purchasePrice: 1000000,
        dailyKilometers: 50,
        fuelType: 'petrol',
        fuelCost: 100,
        fuelEfficiency: 16,
        maintenanceCostPerKm: 0.5
      },
      {
        name: 'Maruti Swift',
        purchasePrice: 800000,
        dailyKilometers: 50,
        fuelType: 'petrol',
        fuelCost: 100,
        fuelEfficiency: 18,
        maintenanceCostPerKm: 0.4
      }
    ];
    this.calculateAllEconomics();
  }

  onFuelTypeChange() {
    const fuelType = this.carForm.get('fuelType')?.value;
    const efficiency = this.carForm.get('fuelEfficiency');
    const maintenance = this.carForm.get('maintenanceCostPerKm');

    if (!efficiency?.value) {
      efficiency?.setValue(this.fuelEfficiencyMap[fuelType] || 15);
    }
    if (!maintenance?.value) {
      maintenance?.setValue(this.maintenanceCostMap[fuelType] || 0.5);
    }
  }

  addCar() {
    if (this.carForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }

    const formValue = this.carForm.value;
    const newCar: CarData = {
      name: formValue.name,
      purchasePrice: formValue.purchasePrice,
      dailyKilometers: formValue.dailyKilometers,
      fuelType: formValue.fuelType,
      fuelCost: formValue.fuelCost,
      fuelEfficiency: formValue.fuelEfficiency || this.fuelEfficiencyMap[formValue.fuelType],
      maintenanceCostPerKm: formValue.maintenanceCostPerKm || this.maintenanceCostMap[formValue.fuelType]
    };

    this.cars.push(newCar);
    this.calculateAllEconomics();
    this.carForm.reset({ fuelType: 'petrol' });
  }

  calculateAllEconomics() {
    this.economics = this.cars.map(car => this.calculateEconomics(car));
    this.findMostEconomical();
  }

  calculateEconomics(car: CarData): CarEconomics {
    const dailyKm = car.dailyKilometers;
    const fuelEfficiency = car.fuelEfficiency || this.fuelEfficiencyMap[car.fuelType];
    const maintenanceCostPerKm = car.maintenanceCostPerKm || this.maintenanceCostMap[car.fuelType];
    
    // Daily fuel cost
    const fuelCostDaily = (dailyKm / fuelEfficiency) * car.fuelCost;
    
    // Daily maintenance cost
    const maintenanceCostDaily = dailyKm * maintenanceCostPerKm;
    
    // Daily depreciation cost (purchase price / total kilometers over years)
    const totalKmInYears = dailyKm * 365 * this.years;
    const depreciationDaily = (car.purchasePrice * 0.8) / totalKmInYears; // Assuming 20% residual value
    
    // Total costs
    const dailyCost = fuelCostDaily + maintenanceCostDaily + depreciationDaily;
    const monthlyCost = dailyCost * 30;
    const yearlyCost = dailyCost * 365;
    const costPerKm = dailyCost / dailyKm;

    // Calculate ROI Guidance for 1-10 years
    const roiGuidance = this.calculateROIGuidance(car, dailyKm, fuelCostDaily, maintenanceCostDaily);

    return {
      name: car.name,
      dailyCost: Math.round(dailyCost * 100) / 100,
      monthlyCost: Math.round(monthlyCost * 100) / 100,
      yearlyCost: Math.round(yearlyCost * 100) / 100,
      costPerKm: Math.round(costPerKm * 100) / 100,
      fuelCostDaily: Math.round(fuelCostDaily * 100) / 100,
      maintenanceCostDaily: Math.round(maintenanceCostDaily * 100) / 100,
      depreciationDaily: Math.round(depreciationDaily * 100) / 100,
      roiGuidance: roiGuidance
    };
  }

  calculateROIGuidance(car: CarData, dailyKm: number, fuelCostDaily: number, maintenanceCostDaily: number): ROIGuidance[] {
    const roiData: ROIGuidance[] = [];
    
    for (let year = 1; year <= 10; year++) {
      // Total kilometers in the year
      const totalKmInYear = dailyKm * 365 * year;
      
      // Fuel and maintenance costs
      const fuelAndMaintenanceCost = (fuelCostDaily + maintenanceCostDaily) * 365 * year;
      
      // Depreciation: Use linear depreciation model
      // Assuming car depreciates 15% in year 1, then 10% of remaining value annually
      let residualValue = car.purchasePrice;
      if (year === 1) {
        residualValue = car.purchasePrice * 0.85; // 15% depreciation in year 1
      } else {
        residualValue = car.purchasePrice * 0.85;
        for (let i = 2; i <= year; i++) {
          residualValue = residualValue * 0.90; // 10% depreciation per year after year 1
        }
      }
      
      // Total cost = Purchase price + Operating costs - Residual value
      const totalCost = car.purchasePrice + fuelAndMaintenanceCost - residualValue;
      const costPerYear = totalCost / year;
      const netCost = totalCost;
      
      // Recommendation based on cost per year
      let recommendation = '';
      if (year <= 3) {
        recommendation = 'Early ownership - Focus on mileage benefits';
      } else if (year <= 5) {
        recommendation = 'Optimal ownership period for most vehicles';
      } else if (year <= 7) {
        recommendation = 'Extended ownership - Depreciation benefits plateau';
      } else {
        recommendation = 'Long-term ownership - Maximize usage before resale';
      }
      
      roiData.push({
        year: year,
        totalCost: Math.round(totalCost * 100) / 100,
        costPerYear: Math.round(costPerYear * 100) / 100,
        residualValue: Math.round(residualValue * 100) / 100,
        netCost: Math.round(netCost * 100) / 100,
        recommendation: recommendation
      });
    }
    
    return roiData;
  }

  findMostEconomical() {
    if (this.economics.length > 0) {
      this.mostEconomical = this.economics.reduce((prev, current) =>
        current.dailyCost < prev.dailyCost ? current : prev
      );
    }
  }

  removeCar(index: number) {
    this.cars.splice(index, 1);
    this.calculateAllEconomics();
  }

  resetForm() {
    this.cars = [];
    this.economics = [];
    this.mostEconomical = null;
    this.carForm.reset({ fuelType: 'petrol' });
    this.addExampleCars();
  }
}
