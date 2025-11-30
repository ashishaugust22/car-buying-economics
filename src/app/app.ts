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

    return {
      name: car.name,
      dailyCost: Math.round(dailyCost * 100) / 100,
      monthlyCost: Math.round(monthlyCost * 100) / 100,
      yearlyCost: Math.round(yearlyCost * 100) / 100,
      costPerKm: Math.round(costPerKm * 100) / 100,
      fuelCostDaily: Math.round(fuelCostDaily * 100) / 100,
      maintenanceCostDaily: Math.round(maintenanceCostDaily * 100) / 100,
      depreciationDaily: Math.round(depreciationDaily * 100) / 100
    };
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
