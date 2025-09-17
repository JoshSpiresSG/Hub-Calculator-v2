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
      annualSalary: 200000,
      airtimeHours: 21.1,
      operationHours: 62.6,
    },
    mode: "onChange", // Enable validation on change
  });

  const onSubmit = (data: CalculationInput) => {
    // Ensure all values are valid numbers before submission
    const sanitizedData: CalculationInput = {
      annualSalary: Number(data.annualSalary) || 0,
      airtimeHours: Number(data.airtimeHours) || 0,
      operationHours: Number(data.operationHours) || 0,
    };
    
    console.log("Submitting calculation data:", sanitizedData);
    onCalculate(sanitizedData);
  };

  // Calculate operational efficiency display value
  const operationalEfficiency = form.watch("operationHours") > 0 
    ? ((form.watch("airtimeHours") || 0) / (form.watch("operationHours") || 1) * 100).toFixed(2)
    : "0.00";

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="space-y-6 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Drone Operations Calculator</h2>
          <p className="text-gray-600">Enter your operational parameters to calculate cost efficiency</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Inputs Section */}
            <div className="bg-yellow-50 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inputs</h3>
              
              <FormField
                control={form.control}
                name="annualSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Salary ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="200000"
                        {...field}
                        value={field.value?.toString() || ""}
                        onChange={e => {
                          const value = e.target.value;
                          const numValue = value === "" ? 0 : parseFloat(value);
                          field.onChange(isNaN(numValue) ? 0 : numValue);
                        }}
                        data-testid="input-annual-salary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="airtimeHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Airtime (hours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="21.1"
                          step="0.1"
                          {...field}
                          value={field.value?.toString() || ""}
                          onChange={e => {
                            const value = e.target.value;
                            const numValue = value === "" ? 0 : parseFloat(value);
                            field.onChange(isNaN(numValue) ? 0 : numValue);
                          }}
                          data-testid="input-airtime-hours"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="operationHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ops Time (hours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="62.6"
                          step="0.1"
                          {...field}
                          value={field.value?.toString() || ""}
                          onChange={e => {
                            const value = e.target.value;
                            const numValue = value === "" ? 0 : parseFloat(value);
                            field.onChange(isNaN(numValue) ? 0 : numValue);
                          }}
                          data-testid="input-operation-hours"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                <div className="font-medium">Operational Efficiency: {operationalEfficiency}%</div>
                <div className="text-xs text-gray-500 mt-1">
                  Calculated as: Airtime hours ÷ Operation hours × 100
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isCalculating}
              data-testid="button-calculate"
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
  );
}