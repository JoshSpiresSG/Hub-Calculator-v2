import { useMemo } from "react";
import { CalculationResult } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/calculatorUtils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CalculatorResultsProps {
  results: CalculationResult | null;
  isLoading: boolean;
}

export default function CalculatorResults({ results, isLoading }: CalculatorResultsProps) {
  const chartData = useMemo(() => {
    if (!results) return [];
    
    return [
      {
        name: 'Year 1',
        Manual: results.yearlyManualCosts[0],
        Remote: results.yearlyRemoteCosts[0],
      },
      {
        name: 'Year 2',
        Manual: results.yearlyManualCosts[1],
        Remote: results.yearlyRemoteCosts[1],
      },
      {
        name: 'Year 3',
        Manual: results.yearlyManualCosts[2],
        Remote: results.yearlyRemoteCosts[2],
      },
      {
        name: 'Year 4',
        Manual: results.yearlyManualCosts[3],
        Remote: results.yearlyRemoteCosts[3],
      },
      {
        name: 'Year 5',
        Manual: results.yearlyManualCosts[4],
        Remote: results.yearlyRemoteCosts[4],
      },
      {
        name: '5-Year Total',
        Manual: results.fiveYearManualCost,
        Remote: results.fiveYearRemoteCost,
      },
    ];
  }, [results]);

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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm border-l-4 border-primary">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-500">5-Year Savings</h4>
            <p className="text-2xl font-semibold text-gray-800">{formatCurrency(results.fiveYearSavings)}</p>
            <p className="text-sm text-green-600 flex items-center">
              <i className="fa fa-arrow-up mr-1"></i>
              <span>{results.savingsPercentage}%</span>&nbsp;cost reduction
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-secondary">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-500">Time Saved (5-Year)</h4>
            <p className="text-2xl font-semibold text-gray-800">{results.fiveYearHoursSaved.toLocaleString()} hours</p>
            <p className="text-sm text-green-600 flex items-center">
              <i className="fa fa-arrow-up mr-1"></i>
              <span>{results.efficiencyGain}%</span>&nbsp;efficiency gain
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-accent">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-500">ROI Timeframe</h4>
            <p className="text-2xl font-semibold text-gray-800">{results.roiTimeframe.toFixed(1)} years</p>
            <p className="text-sm text-blue-600 flex items-center">
              <i className="fa fa-check-circle mr-1"></i>
              <span>Positive long-term ROI</span>
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Comparison Chart */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 30,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value) => [`${formatCurrency(value as number)}`, undefined]}
                />
                <Legend />
                <Bar dataKey="Manual" name="Manual Drone Operations" fill="#3B82F6" />
                <Bar dataKey="Remote" name="Remote Drone Platform" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Manual Drone Operations</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Travel Costs</span>
                <span className="font-medium text-gray-800">{formatCurrency(results.annualTravelCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Labor Costs</span>
                <span className="font-medium text-gray-800">{formatCurrency(results.annualManualLaborCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Equipment Costs</span>
                <span className="font-medium text-gray-800">{formatCurrency(results.yearlyManualCosts[0] - results.annualTravelCost - results.annualManualLaborCost)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Total Annual Cost</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(results.annualManualTotalCost)}</span>
                </div>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-700 font-medium">5-Year Cost</span>
                <span className="font-semibold text-gray-800">{formatCurrency(results.fiveYearManualCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Remote Drone Platform</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Subscription</span>
                <span className="font-medium text-gray-800">{formatCurrency(results.yearlyRemoteCosts[1] - results.annualRemoteLaborCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Labor Costs</span>
                <span className="font-medium text-gray-800">{formatCurrency(results.annualRemoteLaborCost)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Total Annual Cost</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(results.subsequentYearRemoteCost)}</span>
                </div>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-700 font-medium">5-Year Cost</span>
                <span className="font-semibold text-gray-800">{formatCurrency(results.fiveYearRemoteCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
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
      
      {/* Chart Loading */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
      
      {/* Detailed Comparison Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[1, 2].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-40 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
