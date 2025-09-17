import { CalculationInput, CalculationResult } from "@shared/schema";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateResults(input: CalculationInput): CalculationResult {
  // Constants based on user requirements
  const HOURS_PER_DAY = 12;
  const WORK_DAYS_PER_YEAR = 209;
  const BONUS_RATE = 0.05; // 5%
  const SUPERANNUATION_RATE = 0.12; // 12%
  const ON_COSTS_RATE = 0.25; // 25% of salary incl bonus and super
  const FIFO_TRAVEL = 100000; // $100,000
  const SATURDAY_MULTIPLIER = 1.5;
  const SUNDAY_MULTIPLIER = 2.0;
  
  // Equipment costs per cycle/flight
  const BATTERY_COST = 300;
  const BATTERY_CYCLES = 200;
  const PROPELLER_COST = 25;
  const PROPELLER_FLIGHTS = 150;
  const MAINTENANCE_COST = 2500;
  const MAINTENANCE_FLIGHTS = 400;
  const DRONE_COST = 5000;
  const DRONE_FLIGHTS = 400;
  
  // Hub costs
  const HUBX_COST = 114815; // From Excel
  const HUBT_COST = 89815; // From Excel
  const HUBX_IDLE_COST = 80000; // HubX idle cost
  const HUBT_IDLE_COST = 55000; // HubT idle cost
  const SPHERE_HOURLY_RATE = 110; // Sphere backed operations hourly cost
  const SPHERE_EFFICIENCY = 0.8; // Fixed 80% efficiency for Sphere operations
  
  // Flight assumptions for equipment calculations
  const AVERAGE_FLIGHT_DURATION_MINUTES = 25; // 20-30 min average
  
  // Sphere operations have fixed 80% efficiency
  const operationalEfficiency = Math.round(SPHERE_EFFICIENCY * 100); // Fixed 80%
  
  // FIXED: Separate base wage from fixed costs
  const baseSalary = input.annualSalary;
  const bonus = baseSalary * BONUS_RATE;
  const salaryPlusBonus = baseSalary + bonus;
  const superannuation = salaryPlusBonus * SUPERANNUATION_RATE; // Super calculated on salary + bonus
  const salaryWithBonusAndSuper = salaryPlusBonus + superannuation;
  
  // Calculate on costs as 25% of salary including bonus and super
  const onCosts = salaryWithBonusAndSuper * ON_COSTS_RATE;
  
  // Calculate day rate for FIFO operations
  // Total salary package includes salary, bonus, super, on costs, and FIFO travel
  const totalSalaryPackage = salaryWithBonusAndSuper + onCosts + FIFO_TRAVEL;
  const dayRate = totalSalaryPackage / WORK_DAYS_PER_YEAR;
  const pilotHourlyRate = totalSalaryPackage / (WORK_DAYS_PER_YEAR * HOURS_PER_DAY);
  
  // Annual labor cost based on actual operation hours worked
  const annualManualLaborCost = (input.operationHours * 12) * pilotHourlyRate;
  const annualTravelCost = FIFO_TRAVEL;
  
  // FIXED: Equipment cost methodology with proper flight duration conversion
  const airtimeHoursPerYear = input.airtimeHours * 12; // Monthly to annual
  const flightsPerYear = (airtimeHoursPerYear * 60) / AVERAGE_FLIGHT_DURATION_MINUTES; // Convert airtime to flights
  
  const batteryCostPerYear = (flightsPerYear / BATTERY_CYCLES) * BATTERY_COST;
  const propellerCostPerYear = (flightsPerYear / PROPELLER_FLIGHTS) * PROPELLER_COST;
  const maintenanceCostPerYear = (flightsPerYear / MAINTENANCE_FLIGHTS) * MAINTENANCE_COST;
  const droneCostPerYear = (flightsPerYear / DRONE_FLIGHTS) * DRONE_COST;
  
  // Add 10% contingency to total equipment costs
  const baseEquipmentCostPerYear = batteryCostPerYear + propellerCostPerYear + maintenanceCostPerYear + droneCostPerYear;
  const totalEquipmentCostPerYear = baseEquipmentCostPerYear * 1.10; // 10% contingency
  
  // FIXED: Ensure cost totals are consistent
  const annualManualTotalCost = annualManualLaborCost + totalEquipmentCostPerYear;
  
  // FIXED: Remote cost modeling with proper amortization
  const hubCost = HUBX_COST; // Default to HubX for now
  const hubIdleCost = HUBX_IDLE_COST; // Default to HubX idle cost
  const annualDroneBoxAmortized = hubCost / 5; // Amortize over 5 years
  // Remote operations require 20% of the labor (day rate approach)
  const annualRemoteLaborCost = totalSalaryPackage * 0.2; // 20% of total salary package
  
  // Calculate time saved (based on operational efficiency)
  const annualManualHours = input.operationHours * 12; // Monthly operation hours to annual
  
  // Sphere is 80% efficient, so it needs fewer operation hours to accomplish the same airtime work
  const sphereOperationsHoursPerMonth = input.airtimeHours / SPHERE_EFFICIENCY; // 21.1 / 0.8 = 26.38
  const annualSphereOperationsHours = sphereOperationsHoursPerMonth * 12;
  const annualRemoteHours = annualSphereOperationsHours; // For consistency with existing logic
  
  // Sphere backed operations cost calculation - use hub infrastructure costs
  const monthlySphereBackedCost = sphereOperationsHoursPerMonth * SPHERE_HOURLY_RATE; // 26.38 × $110 (for breakdown display)
  const annualSphereBackedCost = HUBT_COST; // Use HubT cost as default Sphere backed operations cost
  
  // First year includes upfront hub cost, subsequent years only include amortized cost
  const firstYearRemoteCost = hubCost + annualRemoteLaborCost;
  const subsequentYearRemoteCost = annualDroneBoxAmortized + annualRemoteLaborCost;
  
  // FIXED: ROI calculation using recurring annual savings
  const annualSavingsAfterFirstYear = annualManualTotalCost - subsequentYearRemoteCost;
  const roiTimeframe = annualSavingsAfterFirstYear > 0 ? hubCost / annualSavingsAfterFirstYear : 0;
  
  // Calculate annual savings - simple comparison between client operations and Sphere operations
  const annualSavings = annualManualLaborCost - annualSphereBackedCost;
  
  const annualHoursSaved = annualManualHours - annualRemoteHours;
  const efficiencyGain = annualManualHours > 0 ? Math.round((annualHoursSaved / annualManualHours) * 100) : 0;
  
  
  return {
    annualTravelCost,
    annualManualLaborCost,
    annualManualTotalCost,
    totalDroneBoxCost: hubCost,
    hubIdleCost,
    hubtCost: HUBT_COST,
    hubtIdleCost: HUBT_IDLE_COST,
    annualDroneBoxAmortized,
    annualRemoteLaborCost,
    annualSphereBackedCost,
    sphereHourlyRate: SPHERE_HOURLY_RATE,
    firstYearRemoteCost,
    subsequentYearRemoteCost,
    annualSavings,
    annualManualHours,
    annualRemoteHours,
    annualHoursSaved,
    efficiencyGain,
    operationalEfficiency,
    roiTimeframe,
    // Sphere operation breakdown values for display
    manualOperationsPerMonth: input.operationHours,
    manualEfficiencyPercent: input.operationHours > 0 ? Math.round((input.airtimeHours / input.operationHours) * 100) : 0,
    sphereOperationsPerMonth: sphereOperationsHoursPerMonth,
    monthlySphereBackedCost,
    pilotHourlyRate
  };
}
