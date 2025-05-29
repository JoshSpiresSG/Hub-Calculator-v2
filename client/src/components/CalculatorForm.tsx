import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculationInputSchema, CalculationInput } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface CalculatorFormProps {
  onCalculate: (data: CalculationInput) => void;
  isCalculating: boolean;
}

export default function CalculatorForm({ onCalculate, isCalculating }: CalculatorFormProps) {
  const form = useForm<CalculationInput>({
    resolver: zodResolver(calculationInputSchema),
    defaultValues: {
      // Operation Requirements
      numSites: 1,
      dronesPerSite: 3,
      flightsPerDay: 2,
      flightDaysPerWeek: 5,
      
      // Labour & Travel
      pilotSalary: 200000,
      weeklyHoursPerPilot: 38,
      travelAndRelatedCosts: 3500,
      
      // Manual Operation Cost
      pilotTimePerFlight: 1.0,
      equipmentCostPerYear: 15000,
      
      // Remote Operation Cost (fixed)
      remoteCostPerYear: 100000,
    },
  });
  
  const onSubmit = (data: CalculationInput) => {
    onCalculate(data);
  };

  return (
    <>
      <Card className="shadow-sm mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Input Parameters</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 🛠️ Operation Requirements */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">🛠️ Operation Requirements</h4>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="numSites"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Sites</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="1" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dronesPerSite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drones per Site</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="3" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="flightsPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flights per Day per Site</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="2" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="flightDaysPerWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flight Days per Week per Site</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="5" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* 👷 Labour & Travel */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">👷 Labour & Travel</h4>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="pilotSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pilot Salary ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="200000" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="weeklyHoursPerPilot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weekly Hours per Pilot</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="38" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="travelAndRelatedCosts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Travel & Related Costs ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="3500" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* ✈️ Manual Operation Cost */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">✈️ Manual Operation Cost</h4>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="pilotTimePerFlight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pilot Time per Flight (hours)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="1.0" 
                            step="0.1"
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="equipmentCostPerYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment Cost per Year ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="15000" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* 🛰️ Remote Operation Cost */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">🛰️ Remote Operation Cost (HubX / HubT)</h4>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="remoteCostPerYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost per Year ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="100000" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            disabled
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">Fixed cost (non-editable)</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-blue-600" 
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  'Calculate ROI'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Assumptions Section */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Assumptions</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <i className="fa fa-info-circle text-blue-500 mt-1 mr-2"></i>
              <span>Remote operation cost includes HubX or HubT deployment</span>
            </li>
            <li className="flex items-start">
              <i className="fa fa-info-circle text-blue-500 mt-1 mr-2"></i>
              <span>Travel costs include on-site presence, power, and networking</span>
            </li>
            <li className="flex items-start">
              <i className="fa fa-info-circle text-blue-500 mt-1 mr-2"></i>
              <span>Equipment costs include purchase, maintenance, batteries, and parts</span>
            </li>
            <li className="flex items-start">
              <i className="fa fa-info-circle text-blue-500 mt-1 mr-2"></i>
              <span>Pilot time includes setup, flying, packdown, and data processing</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}