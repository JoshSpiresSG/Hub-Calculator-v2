import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculationInputSchema, CalculationInput } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Edit3, Info } from "lucide-react";

interface CalculatorFormProps {
  onCalculate: (data: CalculationInput) => void;
  isCalculating: boolean;
}

export default function CalculatorForm({ onCalculate, isCalculating }: CalculatorFormProps) {
  const [editableFields, setEditableFields] = useState<Record<string, boolean>>({});
  
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

  const toggleEdit = (fieldName: string) => {
    setEditableFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };
  
  const onSubmit = (data: CalculationInput) => {
    onCalculate(data);
  };

  const EditableField = ({ 
    name, 
    label, 
    tooltip, 
    placeholder, 
    type = "number", 
    step,
    disabled = false 
  }: {
    name: keyof CalculationInput;
    label: string;
    tooltip: string;
    placeholder: string;
    type?: string;
    step?: string;
    disabled?: boolean;
  }) => {
    const isEditable = editableFields[name] || false;
    
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <FormLabel>{label}</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEdit(name)}
                  className="h-6 px-2 text-xs"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  {isEditable ? 'Lock' : 'Edit'}
                </Button>
              )}
            </div>
            <FormControl>
              <Input 
                type={type}
                placeholder={placeholder}
                step={step}
                {...field} 
                onChange={e => field.onChange(parseFloat(e.target.value))}
                disabled={disabled || !isEditable}
                className={`${(disabled || !isEditable) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
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
                  <EditableField
                    name="numSites"
                    label="Number of Sites"
                    tooltip="Total number of locations where drone operations will be conducted"
                    placeholder="1"
                  />
                  
                  <EditableField
                    name="dronesPerSite"
                    label="Drones per Site"
                    tooltip="Number of drones deployed at each operational site"
                    placeholder="3"
                  />
                  
                  <EditableField
                    name="flightsPerDay"
                    label="Flights per Day per Site"
                    tooltip="Average number of drone flights conducted per day at each site"
                    placeholder="2"
                  />
                  
                  <EditableField
                    name="flightDaysPerWeek"
                    label="Flight Days per Week per Site"
                    tooltip="Number of operational days per week at each site"
                    placeholder="5"
                  />
                </div>
              </div>
              
              {/* 👷 Labour & Travel */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">👷 Labour & Travel</h4>
                <div className="space-y-4">
                  <EditableField
                    name="pilotSalary"
                    label="Pilot Salary ($)"
                    tooltip="Annual salary cost for drone pilots including benefits and overhead"
                    placeholder="200000"
                  />
                  
                  <EditableField
                    name="weeklyHoursPerPilot"
                    label="Weekly Hours per Pilot"
                    tooltip="Standard working hours per week for each pilot"
                    placeholder="38"
                  />
                  
                  <EditableField
                    name="travelAndRelatedCosts"
                    label="Travel & Related Costs ($)"
                    tooltip="Costs for on-site presence including travel, accommodation, and per diems"
                    placeholder="3500"
                  />
                </div>
              </div>
              
              {/* ✈️ Manual Operation Cost */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">✈️ Manual Operation Cost</h4>
                <div className="space-y-4">
                  <EditableField
                    name="pilotTimePerFlight"
                    label="Pilot Time per Flight (hours)"
                    tooltip="Total time required per flight including setup, flying, packdown, and data processing"
                    placeholder="1.0"
                    step="0.1"
                  />
                  
                  <EditableField
                    name="equipmentCostPerYear"
                    label="Equipment Cost per Year ($)"
                    tooltip="Annual cost for drone equipment including purchase, maintenance, batteries, and replacement parts"
                    placeholder="15000"
                  />
                </div>
              </div>
              
              {/* 🛰️ Remote Operation Cost */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">🛰️ Remote Operation Cost (HubX / HubT)</h4>
                <div className="space-y-4">
                  <EditableField
                    name="remoteCostPerYear"
                    label="Cost per Year ($)"
                    tooltip="Fixed annual cost for remote drone platform including HubX or HubT deployment"
                    placeholder="100000"
                    disabled={true}
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