import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculationInputSchema, CalculationInput } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      projectName: "Site Survey Project",
      numSites: 10,
      flightFrequency: 4,
      travelCost: 250,
      pilotHourly: 75,
      hoursPerFlight: 4,
      equipmentCost: 17000,
      platformCost: 100000,
      droneBoxCost: 8000,
      remoteHours: 0.5,
      remoteHourly: 75,
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
              {/* Project Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">Project Details</h4>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Site Survey Project" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="numSites"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Sites</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="10" 
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
                    name="flightFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flight Frequency (per year)</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseFloat(value))} 
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="4">Quarterly</SelectItem>
                            <SelectItem value="12">Monthly</SelectItem>
                            <SelectItem value="26">Bi-weekly</SelectItem>
                            <SelectItem value="52">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Manual Drone Cost */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">Manual Drone Operation</h4>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="travelCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Travel Cost per Site Visit ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="250" 
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
                    name="pilotHourly"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pilot Hourly Rate ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="75" 
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
                    name="hoursPerFlight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours per Flight (incl. setup)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="4" 
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
                    name="equipmentCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment Cost per Year ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="17000" 
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
              
              {/* Remote Drone Cost */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">Remote Drone Platform</h4>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="platformCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform Subscription ($/year)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="100000" 
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
                    name="droneBoxCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drone Box Cost per Site ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="8000" 
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
                    name="remoteHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remote Operator Hours per Flight</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.5" 
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
                    name="remoteHourly"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remote Operator Hourly Rate ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="75" 
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
              <span>Equipment depreciation calculated over 3 years</span>
            </li>
            <li className="flex items-start">
              <i className="fa fa-info-circle text-blue-500 mt-1 mr-2"></i>
              <span>Remote platform includes maintenance and updates</span>
            </li>
            <li className="flex items-start">
              <i className="fa fa-info-circle text-blue-500 mt-1 mr-2"></i>
              <span>Analysis does not include data processing time savings</span>
            </li>
            <li className="flex items-start">
              <i className="fa fa-info-circle text-blue-500 mt-1 mr-2"></i>
              <span>Travel costs include fuel, accommodation, and per diems</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
