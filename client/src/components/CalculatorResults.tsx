import { CalculationResult } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/calculatorUtils";
import { Skeleton } from "@/components/ui/skeleton";

interface CalculatorResultsProps {
  results: CalculationResult | null;
  isLoading: boolean;
}

export default function CalculatorResults({ results, isLoading }: CalculatorResultsProps) {

  if (isLoading) {
    return <LoadingState />;
  }

  if (!results) {
    return (
      <Card className="shadow-sm p-6 mb-6 flex justify-center items-center h-[500px]">
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
        <Card className="shadow-sm border-l-4 border-primary">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-500">Annual Savings</h4>
            <p className="text-2xl font-semibold text-gray-800">{formatCurrency(results.annualSavings)}</p>
            <p className="text-sm text-green-600 flex items-center">
              <i className="fa fa-arrow-up mr-1"></i>
              <span>Cost reduction vs manual operations</span>
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-secondary">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-500">Time Saved (Annual)</h4>
            <p className="text-2xl font-semibold text-gray-800">{results.annualHoursSaved.toLocaleString()} hours</p>
            <p className="text-sm text-green-600 flex items-center">
              <i className="fa fa-arrow-up mr-1"></i>
              <span>{results.efficiencyGain}%</span>&nbsp;efficiency gain
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-accent">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-500">ROI Timeframe</h4>
            <p className="text-2xl font-semibold text-gray-800">{(results.roiTimeframe || 0).toFixed(1)} years</p>
            <p className="text-sm text-blue-600 flex items-center">
              <i className="fa fa-check-circle mr-1"></i>
              <span>Positive long-term ROI</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Comparison */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Annual Cost Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Client Operations</h4>
              <p className="text-xl font-semibold text-blue-700">{formatCurrency(results.annualManualLaborCost)}</p>
              <p className="text-sm text-gray-600 mt-1">Annual pilot labor cost</p>
              <p className="text-xs text-blue-600 mt-1 font-medium">{formatCurrency(results.clientOperationsHourlyRate)}/hour</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Sphere HubT</h4>
              <p className="text-xl font-semibold text-green-700">{formatCurrency(results.hubtCost)}</p>
              <p className="text-sm text-gray-600 mt-1">Hub infrastructure cost</p>
              <p className="text-xs text-gray-600 mt-1">{formatCurrency(results.hubtCost / (results.annualRemoteHours || 1))}/hour</p>
              <p className="text-xs text-green-600 mt-1 font-medium">Save: {formatCurrency(results.annualManualLaborCost - results.hubtCost)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Sphere HubX</h4>
              <p className="text-xl font-semibold text-green-700">{formatCurrency(results.totalDroneBoxCost)}</p>
              <p className="text-sm text-gray-600 mt-1">Hub infrastructure cost</p>
              <p className="text-xs text-gray-600 mt-1">{formatCurrency(results.totalDroneBoxCost / (results.annualRemoteHours || 1))}/hour</p>
              <p className="text-xs text-green-600 mt-1 font-medium">Save: {formatCurrency(results.annualManualLaborCost - results.totalDroneBoxCost)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Hourly Rate Cost</h4>
              <p className="text-xl font-semibold text-purple-700">{formatCurrency((results.monthlySphereBackedCost || 0) * 12)}</p>
              <p className="text-sm text-gray-600 mt-1">Annual hourly rate cost</p>
              <p className="text-xs text-purple-600 mt-1 font-medium">Save: {formatCurrency(results.annualManualLaborCost - ((results.monthlySphereBackedCost || 0) * 12))}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-100 rounded-lg text-center">
              <h4 className="font-medium text-gray-800 mb-2">Best Savings: HubT</h4>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(results.annualManualLaborCost - results.hubtCost)}</p>
              <p className="text-sm text-gray-600 mt-1">
                {(((results.annualManualLaborCost - results.hubtCost) / results.annualManualLaborCost) * 100).toFixed(1)}% cost reduction
              </p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg text-center">
              <h4 className="font-medium text-gray-800 mb-2">Moderate Savings: HubX</h4>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(results.annualManualLaborCost - results.totalDroneBoxCost)}</p>
              <p className="text-sm text-gray-600 mt-1">
                {(((results.annualManualLaborCost - results.totalDroneBoxCost) / results.annualManualLaborCost) * 100).toFixed(1)}% cost reduction
              </p>
            </div>
            <div className="p-4 bg-purple-100 rounded-lg text-center">
              <h4 className="font-medium text-gray-800 mb-2">Hourly Rate Savings</h4>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(results.annualManualLaborCost - ((results.monthlySphereBackedCost || 0) * 12))}</p>
              <p className="text-sm text-gray-600 mt-1">
                {(((results.annualManualLaborCost - ((results.monthlySphereBackedCost || 0) * 12)) / results.annualManualLaborCost) * 100).toFixed(1)}% cost reduction
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Calculation Breakdown */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Calculation Breakdown</h3>
          
          {/* Operational Hours */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Operational Analysis</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Airtime Input (monthly):</span>
                <p className="font-medium">{results.inputAirtimeHours} hours</p>
              </div>
              <div>
                <span className="text-gray-600">Airtime/Week (derived):</span>
                <p className="font-medium">{((results.annualRemoteHours || 0) / 52).toFixed(1)} hours</p>
              </div>
              <div>
                <span className="text-gray-600">Airtime/Annual:</span>
                <p className="font-medium">{(results.inputAirtimeHours * 12).toFixed(0)} hours</p>
              </div>
              <div>
                <span className="text-gray-600">Operational Efficiency:</span>
                <p className="font-medium">{results.operationalEfficiency}%</p>
              </div>
              <div>
                <span className="text-gray-600">Ops Time Input (monthly):</span>
                <p className="font-medium">{results.inputOperationHours} hours</p>
              </div>
              <div>
                <span className="text-gray-600">Ops Time/Week (derived):</span>
                <p className="font-medium">{((results.annualManualHours || 0) / 52).toFixed(1)} hours</p>
              </div>
              <div>
                <span className="text-gray-600">Ops Hours/Annual:</span>
                <p className="font-medium">{(results.annualManualHours || 0).toFixed(0)} hours</p>
              </div>
              <div>
                <span className="text-gray-600">Hourly Rate:</span>
                <p className="font-medium">{formatCurrency((results.annualManualLaborCost || 0) / (results.annualManualHours || 1))}</p>
              </div>
              <div>
                <span className="text-gray-600">Step 1 - Monthly:</span>
                <p className="font-medium">{results.manualOperationsPerMonth} hours × {formatCurrency(results.pilotHourlyRate || 157)}</p>
              </div>
              <div>
                <span className="text-gray-600">Monthly Labor Cost:</span>
                <p className="font-medium font-semibold text-green-600">{formatCurrency(results.annualManualLaborCost / 12)}</p>
              </div>
              <div>
                <span className="text-gray-600">Step 2 - Annual:</span>
                <p className="font-medium">{formatCurrency(results.annualManualLaborCost / 12)} × 12</p>
              </div>
              <div>
                <span className="text-gray-600">Annual Labor Cost:</span>
                <p className="font-medium font-semibold text-blue-600">{formatCurrency(results.annualManualLaborCost)}</p>
              </div>
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Salary Breakdown</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Annual Salary:</span>
                <p className="font-medium">{formatCurrency(200000)}</p>
              </div>
              <div>
                <span className="text-gray-600">5% Bonus:</span>
                <p className="font-medium">{formatCurrency(10000)}</p>
              </div>
              <div>
                <span className="text-gray-600">Super (12%):</span>
                <p className="font-medium">{formatCurrency(25200)}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Comp:</span>
                <p className="font-medium">{formatCurrency(235200)}</p>
              </div>
              <div>
                <span className="text-gray-600">25% On Costs:</span>
                <p className="font-medium">{formatCurrency(58800)}</p>
              </div>
              <div>
                <span className="text-gray-600">FIFO Travel:</span>
                <p className="font-medium">{formatCurrency(100000)}</p>
              </div>
              <div className="md:col-span-3">
                <span className="text-gray-600">Total Cost to Business:</span>
                <p className="font-semibold text-medium">{formatCurrency(394000)}</p>
              </div>
            </div>
          </div>

          {/* Work Schedule */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Work Schedule</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Hours per Day:</span>
                <p className="font-medium">12</p>
              </div>
              <div>
                <span className="text-gray-600">Work Days in Year:</span>
                <p className="font-medium">{results.workDaysPerYear}</p>
              </div>
              <div>
                <span className="text-gray-600">Annual Leave:</span>
                <p className="font-medium">{results.annualLeaveDays} days</p>
              </div>
              <div>
                <span className="text-gray-600">Public Holidays:</span>
                <p className="font-medium">{results.publicHolidayDays} days</p>
              </div>
              <div>
                <span className="text-gray-600">Sick Days:</span>
                <p className="font-medium">{results.sickLeaveDays} days</p>
              </div>
              <div>
                <span className="text-gray-600">Net Work Days:</span>
                <p className="font-medium">{results.netWorkDaysPerYear}</p>
              </div>
              <div>
                <span className="text-gray-600">Implicit Day Rate:</span>
                <p className="font-medium">{formatCurrency(394000 / results.netWorkDaysPerYear)}</p>
              </div>
              <div>
                <span className="text-gray-600">Implicit Hourly Rate:</span>
                <p className="font-medium">{formatCurrency(394000 / (results.netWorkDaysPerYear * 12))}</p>
              </div>
            </div>
          </div>

          {/* Sphere Backed Operations */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Sphere Backed Operations</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">HubX Yearly Cost:</span>
                <p className="font-medium">{formatCurrency(results.totalDroneBoxCost || 0)}</p>
              </div>
              <div>
                <span className="text-gray-600">HubX Idle Yearly Cost:</span>
                <p className="font-medium">{formatCurrency(results.hubIdleCost || 0)}</p>
              </div>
              <div>
                <span className="text-gray-600">HubT Yearly Cost:</span>
                <p className="font-medium">{formatCurrency(results.hubtCost || 0)}</p>
              </div>
              <div>
                <span className="text-gray-600">HubT Yearly Idle Cost:</span>
                <p className="font-medium">{formatCurrency(results.hubtIdleCost || 0)}</p>
              </div>
              <div>
                <span className="text-gray-600">Sphere Hourly Rate:</span>
                <p className="font-medium">{formatCurrency(results.sphereHourlyRate || 0)}/hour</p>
              </div>
              <div>
                <span className="text-gray-600">Annual Sphere Cost:</span>
                <p className="font-medium">{formatCurrency(results.annualSphereBackedCost || 0)}</p>
              </div>
              <div>
                <span className="text-gray-600">Sphere Efficiency:</span>
                <p className="font-medium">80% (Fixed)</p>
              </div>
              <div>
                <span className="text-gray-600">Sphere Operations/Month:</span>
                <p className="font-medium">{(results.sphereOperationsPerMonth || 0).toFixed(1)} hours</p>
              </div>
              <div>
                <span className="text-gray-600">Step 1 - Monthly:</span>
                <p className="font-medium">{(results.sphereOperationsPerMonth || 0).toFixed(1)} hours × $110</p>
              </div>
              <div>
                <span className="text-gray-600">Monthly Cost:</span>
                <p className="font-medium font-semibold text-green-600">{formatCurrency(results.monthlySphereBackedCost || 0)}</p>
              </div>
              <div>
                <span className="text-gray-600">Step 2 - Annual:</span>
                <p className="font-medium">{formatCurrency(results.monthlySphereBackedCost || 0)} × 12</p>
              </div>
              <div>
                <span className="text-gray-600">Annual Cost:</span>
                <p className="font-medium font-semibold text-blue-600">{formatCurrency(results.annualSphereBackedCost || 0)}</p>
              </div>
            </div>
          </div>

          {/* Maintenance Calculations */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Maintenance Calculations (Per Hour Rate)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
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
        </CardContent>
      </Card>
      {/* Additional Benefits */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <i className="fa fa-bolt text-blue-600 text-xl"></i>
              </div>
              <h4 className="font-medium text-gray-800 mb-1">Faster Response</h4>
              <p className="text-sm text-gray-600 text-center">Deploy flights instantly without travel delays</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <i className="fa fa-leaf text-green-600 text-xl"></i>
              </div>
              <h4 className="font-medium text-gray-800 mb-1">Reduced Emissions</h4>
              <p className="text-sm text-gray-600 text-center">Eliminate travel-related carbon footprint</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <i className="fa fa-shield-alt text-purple-600 text-xl"></i>
              </div>
              <h4 className="font-medium text-gray-800 mb-1">Improved Safety</h4>
              <p className="text-sm text-gray-600 text-center">Reduce personnel exposure to hazardous environments</p>
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
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-sm">
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
            {[1, 2, 3].map((i) => (
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
