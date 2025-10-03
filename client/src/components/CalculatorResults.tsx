import { CalculationResult } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/calculatorUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CalculatorResultsProps {
  results: CalculationResult | null;
  isLoading: boolean;
}

export default function CalculatorResults({ results, isLoading }: CalculatorResultsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCO2DialogOpen, setIsCO2DialogOpen] = useState(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!results) {
    return (
      <Card className="p-6 mb-6 flex justify-center items-center h-[500px]">
        <div className="text-center">
          <p className="text-gray-600">Your ROI analysis will appear here once it's been calculated</p>
        </div>
      </Card>
    );
  }

  return (
    <>
    <Card className="w-full mx-auto">
      <CardContent className="space-y-6 p-8">
      {/* Results Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Results</h2>
      </div>
      
      {/* Commercial Benefits Heading */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Commercial Benefits</h3>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-l-4 border-primary">
          <CardContent className="p-4">
            <span className="text-sm font-medium text-gray-500">Annual Savings</span>
            <p className="text-2xl font-semibold text-gray-800">{formatCurrency(results.annualSavings)}</p>
            <p className="text-sm text-green-600 flex items-center">
              <i className="fa fa-arrow-up mr-1"></i>
              <span>Cost reduction vs manual operations</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-secondary">
          <CardContent className="p-4">
            <span className="text-sm font-medium text-gray-500">Time Saved (Annual)</span>
            <p className="text-2xl font-semibold text-gray-800">{results.annualHoursSaved.toLocaleString()} hours</p>
            <p className="text-sm text-green-600 flex items-center">
              <i className="fa fa-arrow-up mr-1"></i>
              <span>{results.efficiencyGain}%</span>&nbsp;efficiency gain
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-accent">
          <CardContent className="p-4">
            <span className="text-sm font-medium text-gray-500">ROI Timeframe</span>
            <p className="text-2xl font-semibold text-gray-800">{(results.roiTimeframe || 0).toFixed(1)} years</p>
            <p className="text-sm text-blue-600 flex items-center">
              <i className="fa fa-check-circle mr-1"></i>
              <span>Positive long-term ROI</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Comparison */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Annual Cost Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <span className="font-medium text-gray-800 mb-2">Client Operations</span>
              <p className="text-xl font-semibold text-blue-700">{formatCurrency(results.annualManualLaborCost)}</p>
              <p className="text-sm text-gray-600 mt-1">Annual pilot labor cost</p>
              <p className="text-xs text-blue-600 mt-1 font-medium">{formatCurrency(results.clientOperationsHourlyRate)}/hour</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <span className="font-medium text-gray-800 mb-2">Sphere HubT</span>
              <p className="text-xl font-semibold text-green-700">{formatCurrency(results.hubtCost)}</p>
              <p className="text-sm text-gray-600 mt-1">Hub infrastructure cost</p>
              <p className="text-xs text-gray-600 mt-1">{formatCurrency(results.hubtCost / (results.annualRemoteHours || 1))}/hour</p>
              <p className="text-xs text-green-600 mt-1 font-medium">Save: {formatCurrency(results.annualManualLaborCost - results.hubtCost)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <span className="font-medium text-gray-800 mb-2">Sphere HubX</span>
              <p className="text-xl font-semibold text-green-700">{formatCurrency(results.totalDroneBoxCost)}</p>
              <p className="text-sm text-gray-600 mt-1">Hub infrastructure cost</p>
              <p className="text-xs text-gray-600 mt-1">{formatCurrency(results.totalDroneBoxCost / (results.annualRemoteHours || 1))}/hour</p>
              <p className="text-xs text-green-600 mt-1 font-medium">Save: {formatCurrency(results.annualManualLaborCost - results.totalDroneBoxCost)}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-100 rounded-lg text-center">
              <span className="font-medium text-gray-800 mb-2">Best Savings: HubT</span>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(results.annualManualLaborCost - results.hubtCost)}</p>
              <p className="text-sm text-gray-600 mt-1">
                {(((results.annualManualLaborCost - results.hubtCost) / results.annualManualLaborCost) * 100).toFixed(1)}% cost reduction
              </p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg text-center">
              <span className="font-medium text-gray-800 mb-2">Moderate Savings: HubX</span>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(results.annualManualLaborCost - results.totalDroneBoxCost)}</p>
              <p className="text-sm text-gray-600 mt-1">
                {(((results.annualManualLaborCost - results.totalDroneBoxCost) / results.annualManualLaborCost) * 100).toFixed(1)}% cost reduction
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="px-6 py-2"
                  data-testid="button-calculation-breakdown"
                >
                  View Detailed Calculation Breakdown
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle data-testid="title-calculation-breakdown-dialog">Calculation Breakdown</DialogTitle>
                  <DialogDescription>
                    Detailed analysis of operational costs, labor calculations, and sphere-backed operations.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  {/* Operational Hours */}
                  <div className="mb-6">
                    <span className="font-medium text-gray-700 mb-3">Operational Analysis</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Airtime Input (monthly):</span>
                        <p className="font-medium" data-testid="text-airtime-input">{results.inputAirtimeHours} hours</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Airtime/Week (derived):</span>
                        <p className="font-medium" data-testid="text-airtime-week">{((results.annualRemoteHours || 0) / 52).toFixed(1)} hours</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Airtime/Annual:</span>
                        <p className="font-medium" data-testid="text-airtime-annual">{(results.inputAirtimeHours * 12).toFixed(0)} hours</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Operational Efficiency:</span>
                        <p className="font-medium" data-testid="text-operational-efficiency">{results.operationalEfficiency}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Ops Time Input (monthly):</span>
                        <p className="font-medium" data-testid="text-ops-time-input">{results.inputOperationHours} hours</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Ops Time/Week (derived):</span>
                        <p className="font-medium" data-testid="text-ops-time-week">{((results.annualManualHours || 0) / 52).toFixed(1)} hours</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Ops Hours/Annual:</span>
                        <p className="font-medium" data-testid="text-ops-hours-annual">{(results.annualManualHours || 0).toFixed(0)} hours</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Hourly Rate:</span>
                        <p className="font-medium" data-testid="text-hourly-rate">{formatCurrency((results.annualManualLaborCost || 0) / (results.annualManualHours || 1))}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Step 1 - Monthly:</span>
                        <p className="font-medium" data-testid="text-step1-monthly">{results.manualOperationsPerMonth} hours × {formatCurrency(results.pilotHourlyRate || 157)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly Labor Cost:</span>
                        <p className="font-medium font-semibold text-green-600" data-testid="text-monthly-labor-cost">{formatCurrency(results.annualManualLaborCost / 12)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Step 2 - Annual:</span>
                        <p className="font-medium" data-testid="text-step2-annual">{formatCurrency(results.annualManualLaborCost / 12)} × 12</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Annual Labor Cost:</span>
                        <p className="font-medium font-semibold text-blue-600" data-testid="text-annual-labor-cost">{formatCurrency(results.annualManualLaborCost)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Salary Breakdown */}
                  <div className="mb-6">
                    <span className="font-medium text-gray-700 mb-3">Salary Breakdown</span>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Annual Salary:</span>
                        <p className="font-medium" data-testid="text-annual-salary">{formatCurrency(200000)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">5% Bonus:</span>
                        <p className="font-medium" data-testid="text-bonus">{formatCurrency(10000)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Super (12%):</span>
                        <p className="font-medium" data-testid="text-super">{formatCurrency(25200)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Comp:</span>
                        <p className="font-medium" data-testid="text-total-comp">{formatCurrency(235200)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">25% On Costs:</span>
                        <p className="font-medium" data-testid="text-on-costs">{formatCurrency(58800)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">FIFO Travel:</span>
                        <p className="font-medium" data-testid="text-fifo-travel">{formatCurrency(100000)}</p>
                      </div>
                      <div className="md:col-span-3">
                        <span className="text-gray-600">Total Cost to Business:</span>
                        <p className="font-semibold text-medium" data-testid="text-total-cost-business">{formatCurrency(394000)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Work Schedule */}
                  <div className="mb-6">
                    <span className="font-medium text-gray-700 mb-3">Work Schedule</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Hours per Day:</span>
                        <p className="font-medium" data-testid="text-hours-per-day">12</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Work Days in Year:</span>
                        <p className="font-medium" data-testid="text-work-days-year">{results.workDaysPerYear}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Annual Leave:</span>
                        <p className="font-medium" data-testid="text-annual-leave">{results.annualLeaveDays} days</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Public Holidays:</span>
                        <p className="font-medium" data-testid="text-public-holidays">{results.publicHolidayDays} days</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Sick Days:</span>
                        <p className="font-medium" data-testid="text-sick-days">{results.sickLeaveDays} days</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Net Work Days:</span>
                        <p className="font-medium" data-testid="text-net-work-days">{results.netWorkDaysPerYear}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Implicit Day Rate:</span>
                        <p className="font-medium" data-testid="text-implicit-day-rate">{formatCurrency(394000 / results.netWorkDaysPerYear)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Implicit Hourly Rate:</span>
                        <p className="font-medium" data-testid="text-implicit-hourly-rate">{formatCurrency(394000 / (results.netWorkDaysPerYear * 12))}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sphere Backed Operations */}
                  <div className="mb-6">
                    <span className="font-medium text-gray-700 mb-3">Sphere Backed Operations</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">HubX Yearly Cost:</span>
                        <p className="font-medium" data-testid="text-hubx-yearly-cost">{formatCurrency(results.totalDroneBoxCost || 0)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">HubX Idle Yearly Cost:</span>
                        <p className="font-medium" data-testid="text-hubx-idle-cost">{formatCurrency(results.hubIdleCost || 0)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">HubT Yearly Cost:</span>
                        <p className="font-medium" data-testid="text-hubt-yearly-cost">{formatCurrency(results.hubtCost || 0)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">HubT Yearly Idle Cost:</span>
                        <p className="font-medium" data-testid="text-hubt-idle-cost">{formatCurrency(results.hubtIdleCost || 0)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Sphere Hourly Rate:</span>
                        <p className="font-medium" data-testid="text-sphere-hourly-rate">{formatCurrency(results.sphereHourlyRate || 0)}/hour</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Annual Sphere Cost:</span>
                        <p className="font-medium" data-testid="text-annual-sphere-cost">{formatCurrency(results.annualSphereBackedCost || 0)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Sphere Efficiency:</span>
                        <p className="font-medium" data-testid="text-sphere-efficiency">80% (Fixed)</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Sphere Operations/Month:</span>
                        <p className="font-medium" data-testid="text-sphere-ops-month">{(results.sphereOperationsPerMonth || 0).toFixed(1)} hours</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Step 1 - Monthly:</span>
                        <p className="font-medium" data-testid="text-sphere-step1-monthly">{(results.sphereOperationsPerMonth || 0).toFixed(1)} hours × $110</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly Cost:</span>
                        <p className="font-medium font-semibold text-green-600" data-testid="text-sphere-monthly-cost">{formatCurrency(results.monthlySphereBackedCost || 0)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Step 2 - Annual:</span>
                        <p className="font-medium" data-testid="text-sphere-step2-annual">{formatCurrency(results.monthlySphereBackedCost || 0)} × 12</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Annual Cost:</span>
                        <p className="font-medium font-semibold text-blue-600" data-testid="text-sphere-annual-cost">{formatCurrency(results.annualSphereBackedCost || 0)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance Calculations */}
                  <div className="mb-6">
                    <span className="font-medium text-gray-700 mb-3">Maintenance Calculations (Per Hour Rate)</span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm" data-testid="table-maintenance-calculations">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Component</th>
                            <th className="text-right py-2">Cycle/Flights</th>
                            <th className="text-right py-2">Unit Cost</th>
                            <th className="text-right py-2">Hour Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">Battery</td>
                            <td className="text-right">200</td>
                            <td className="text-right">$300.00</td>
                            <td className="text-right">$1.50</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Propellers</td>
                            <td className="text-right">150</td>
                            <td className="text-right">$25.00</td>
                            <td className="text-right">$0.17</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Maintenance</td>
                            <td className="text-right">400</td>
                            <td className="text-right">$2,500.00</td>
                            <td className="text-right">$6.25</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Drone</td>
                            <td className="text-right">400</td>
                            <td className="text-right">$5,000.00</td>
                            <td className="text-right">$12.50</td>
                          </tr>
                          <tr>
                            <td className="py-2">Sub-total</td>
                            <td className="text-right"></td>
                            <td className="text-right"></td>
                            <td className="text-right">$20.42</td>
                          </tr>
                          <tr>
                            <td className="py-2">10% Contingency</td>
                            <td className="text-right"></td>
                            <td className="text-right"></td>
                            <td className="text-right">$2.04</td>
                          </tr>
                          <tr className="font-semibold border-t">
                            <td className="py-2">Total</td>
                            <td className="text-right"></td>
                            <td className="text-right"></td>
                            <td className="text-right">$22.46</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Environmental Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg" data-testid="card-manual-co2">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <i className="fa fa-plane text-red-600"></i>
                </div>
                <span className="font-medium text-gray-800">Manual FIFO Operations</span>
              </div>
              <p className="text-2xl font-bold text-red-600" data-testid="text-manual-co2">{((results.annualManualCO2Emissions || 0) / 1000).toFixed(2)} tonnes</p>
              <p className="text-sm text-gray-600 mt-1">CO₂ emissions per year</p>
              <p className="text-xs text-gray-500 mt-2">Flights + headcount + driving (4 people)</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-testid="card-remote-co2">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <i className="fa fa-drone text-green-600"></i>
                </div>
                <span className="font-medium text-gray-800">Remote Drone Operations</span>
              </div>
              <p className="text-2xl font-bold text-green-600" data-testid="text-remote-co2">{((results.annualRemoteCO2Emissions || 0) / 1000).toFixed(2)} tonnes</p>
              <p className="text-sm text-gray-600 mt-1">CO₂ emissions per year</p>
              <p className="text-xs text-gray-500 mt-2">Operations center only (4 people)</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg" data-testid="card-co2-saved">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <i className="fa fa-leaf text-blue-600"></i>
                </div>
                <span className="font-medium text-gray-800">Annual CO₂ Reduction</span>
              </div>
              <p className="text-2xl font-bold text-blue-600" data-testid="text-co2-saved">{((results.annualCO2Saved || 0) / 1000).toFixed(2)} tonnes</p>
              <p className="text-sm text-gray-600 mt-1">CO₂ saved per year</p>
              <p className="text-xs text-gray-500 mt-2">For team of 4 people</p>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Dialog open={isCO2DialogOpen} onOpenChange={setIsCO2DialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="px-6 py-2"
                  data-testid="button-co2-breakdown"
                >
                  View Detailed Calculation Breakdown
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle data-testid="title-co2-breakdown-dialog">CO₂ Emissions Breakdown</DialogTitle>
                  <DialogDescription>
                    Detailed breakdown of carbon emissions for manual FIFO operations versus remote drone operations.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  {/* Manual FIFO Operations Breakdown */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Manual FIFO Operations Carbon Emissions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Flight Carbon per Person:</span>
                        <p className="font-medium text-lg" data-testid="text-flight-carbon-person">10.14 tonnes/year</p>
                        <p className="text-xs text-gray-500 mt-1">Based on 8:6 roster, ~52 flights/year</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Client Headcount Carbon per Person:</span>
                        <p className="font-medium text-lg" data-testid="text-client-headcount-person">5.874 tonnes/year</p>
                        <p className="text-xs text-gray-500 mt-1">Annual per-capita CO₂</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Driving Carbon per Person:</span>
                        <p className="font-medium text-lg" data-testid="text-driving-carbon-person">5.01 tonnes/year</p>
                        <p className="text-xs text-gray-500 mt-1">~208 days × 24kg/day (100km/day)</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded lg:col-span-2">
                        <span className="text-gray-600">Total Carbon per Person:</span>
                        <p className="font-semibold text-lg text-blue-700" data-testid="text-manual-total-person">{((results.annualManualCO2Emissions || 0) / 1000 / 4).toFixed(2)} tonnes/year</p>
                        <p className="text-xs text-gray-500 mt-1">10.14 + 5.874 + 5.01</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded">
                        <span className="text-gray-600">Team Size:</span>
                        <p className="font-semibold text-lg text-blue-700" data-testid="text-team-size">4 people</p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-red-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Total Annual Manual Operations CO₂:</span>
                      <p className="text-2xl font-bold text-red-600 mt-1" data-testid="text-manual-total-co2">
                        {((results.annualManualCO2Emissions || 0) / 1000).toFixed(2)} tonnes
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{((results.annualManualCO2Emissions || 0) / 1000 / 4).toFixed(2)} tonnes/person × 4 people</p>
                    </div>
                  </div>

                  {/* Remote Drone Operations Breakdown */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Remote Drone Operations Carbon Emissions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Flight Carbon per Person:</span>
                        <p className="font-medium text-lg text-green-600" data-testid="text-remote-flight-carbon">0 tonnes/year</p>
                        <p className="text-xs text-gray-500 mt-1">No FIFO flights required</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Sphere Ops Center Headcount Carbon per Person:</span>
                        <p className="font-medium text-lg" data-testid="text-sphere-headcount-person">10.315 tonnes/year</p>
                        <p className="text-xs text-gray-500 mt-1">Annual per-capita CO₂</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded">
                        <span className="text-gray-600">Total Carbon per Person:</span>
                        <p className="font-semibold text-lg text-blue-700" data-testid="text-remote-total-person">10.315 tonnes/year</p>
                        <p className="text-xs text-gray-500 mt-1">0 + 10.315</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded">
                        <span className="text-gray-600">Team Size:</span>
                        <p className="font-semibold text-lg text-blue-700">4 people</p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Total Annual Remote Operations CO₂:</span>
                      <p className="text-2xl font-bold text-green-600 mt-1" data-testid="text-remote-total-co2">
                        {((results.annualRemoteCO2Emissions || 0) / 1000).toFixed(2)} tonnes
                      </p>
                      <p className="text-sm text-gray-600 mt-1">10.315 tonnes/person × 4 people</p>
                    </div>
                  </div>

                  {/* CO2 Savings Summary */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Annual CO₂ Reduction</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600">Manual Operations</p>
                        <p className="text-xl font-bold text-red-600">{((results.annualManualCO2Emissions || 0) / 1000).toFixed(2)} tonnes</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Remote Operations</p>
                        <p className="text-xl font-bold text-green-600">{((results.annualRemoteCO2Emissions || 0) / 1000).toFixed(2)} tonnes</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">CO₂ Saved</p>
                        <p className="text-xl font-bold text-blue-600" data-testid="text-co2-saved-breakdown">{((results.annualCO2Saved || 0) / 1000).toFixed(2)} tonnes</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3 text-center">
                      Reduction: {(((results.annualCO2Saved || 0) / (results.annualManualCO2Emissions || 1)) * 100).toFixed(1)}% lower emissions
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Additional Benefits */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg" data-testid="benefit-roi-manual">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <i className="fa fa-chart-line text-green-600 text-xl"></i>
              </div>
              <span className="font-medium text-gray-800 mb-1">ROI vs Manual</span>
              <p className="text-sm text-gray-600 text-center">Cut costs and unlock greater value compared to manual methods</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg" data-testid="benefit-safety-case">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <i className="fa fa-shield-alt text-red-600 text-xl"></i>
              </div>
              <span className="font-medium text-gray-800 mb-1">Safety Case</span>
              <p className="text-sm text-gray-600 text-center">Reduce risk by keeping people out of hazardous environments</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg" data-testid="benefit-software-integrations">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <i className="fa fa-plug text-blue-600 text-xl"></i>
              </div>
              <span className="font-medium text-gray-800 mb-1">Software Integrations</span>
              <p className="text-sm text-gray-600 text-center">Fit seamlessly into existing workflows with easy integrations</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg" data-testid="benefit-customer-service">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <i className="fa fa-headset text-purple-600 text-xl"></i>
              </div>
              <span className="font-medium text-gray-800 mb-1">Customer Service</span>
              <p className="text-sm text-gray-600 text-center">Rely on ongoing support that keeps operations running smoothly</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg" data-testid="benefit-airtime-efficiency">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <i className="fa fa-clock text-orange-600 text-xl"></i>
              </div>
              <span className="font-medium text-gray-800 mb-1">Airtime Efficiency</span>
              <p className="text-sm text-gray-600 text-center">Capture more data in less time with every flight</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-teal-50 rounded-lg" data-testid="benefit-time-to-data">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                <i className="fa fa-tachometer-alt text-teal-600 text-xl"></i>
              </div>
              <span className="font-medium text-gray-800 mb-1">Time to Data</span>
              <p className="text-sm text-gray-600 text-center">Go from collection to insights faster, enabling quicker decisions</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </CardContent>
    </Card>
    </>
  );
}

function LoadingState() {
  return (
    <>
      {/* Summary Cards Loading */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Additional Benefits Loading */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Skeleton className="w-12 h-12 rounded-full mb-3" />
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
