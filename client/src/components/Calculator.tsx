import { useState } from "react";
import CalculatorForm from "./CalculatorForm";
import CustomerInfoForm from "./CustomerInfoForm";
import CalculatorResults from "./CalculatorResults";
import { CalculationInput, CalculationResult, InsertCustomer } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { calculateResults } from "@/lib/calculatorUtils";
import { Button } from "@/components/ui/button";
import { Check, Save } from "lucide-react";

export default function Calculator() {
  const { toast } = useToast();
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [customerInfo, setCustomerInfo] = useState<InsertCustomer | null>(null);
  const [currentStep, setCurrentStep] = useState("calculate");
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<number | null>(null);

  // Calculation mutation - only calculates without saving
  const calculationMutation = useMutation({
    mutationFn: async (data: CalculationInput) => {
      const response = await apiRequest("POST", "/api/calculate", data);
      return response.json();
    },
    onSuccess: (data: CalculationResult) => {
      setResults(data);
    },
    onError: (error) => {
      toast({
        title: "Calculation Error",
        description: error instanceof Error ? error.message : "Failed to calculate results",
        variant: "destructive",
      });
      
      // Fallback to client-side calculation if the server fails
      try {
        const clientResults = calculateResults(calculationMutation.variables as CalculationInput);
        setResults(clientResults);
      } catch (err) {
        console.error("Client-side calculation failed:", err);
      }
    },
  });

  // Submission mutation - saves customer info and calculation
  const submissionMutation = useMutation({
    mutationFn: async (data: { customer: InsertCustomer, calculation: CalculationInput }) => {
      const response = await apiRequest("POST", "/api/submit", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data.results);
      setSubmissionId(data.calculationId);
      setSubmitted(true);
      
      toast({
        title: "Success!",
        description: "Your calculation has been saved. Thanks for your submission!",
        duration: 5000,
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to save your information",
        variant: "destructive",
      });
    }
  });

  const handleCalculate = (data: CalculationInput) => {
    calculationMutation.mutate(data);
  };

  const handleCustomerInfoChange = (data: InsertCustomer) => {
    setCustomerInfo(data);
  };

  const handleSubmit = () => {
    if (!customerInfo || !calculationMutation.variables) {
      toast({
        title: "Missing Information",
        description: "Please fill out both your information and the calculation parameters.",
        variant: "destructive",
      });
      return;
    }

    submissionMutation.mutate({
      customer: customerInfo,
      calculation: calculationMutation.variables as CalculationInput
    });
  };

  const moveToStep = (step: string) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Drone ROI Calculator</h1>
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Beta</span>
          </div>
          <div>
            <button className="bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <i className="fa fa-question-circle mr-2"></i>Help
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Calculate Your Savings with Remote Drone Platform</h2>
          <p className="text-gray-600 mb-4">Compare the costs and benefits of our remote drone platform versus manual drone flights. See exactly how much time and money you could save.</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
              <i className="fa fa-clock mr-2"></i>
              <span>Save Time</span>
            </div>
            <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
              <i className="fa fa-dollar-sign mr-2"></i>
              <span>Reduce Costs</span>
            </div>
            <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
              <i className="fa fa-chart-line mr-2"></i>
              <span>Increase Efficiency</span>
            </div>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-between">
                <div className={`flex items-center ${currentStep === 'calculate' || currentStep === 'customer' || currentStep === 'review' ? 'text-primary' : 'text-gray-500'}`}>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStep === 'calculate' || currentStep === 'customer' || currentStep === 'review' ? 'bg-primary text-white' : 'border-2 border-gray-300 bg-white'}`}>
                    <span className="text-sm font-medium">1</span>
                  </span>
                  <span className="ml-3 text-sm font-medium">Calculate</span>
                </div>
                <div className={`flex items-center ${currentStep === 'customer' || currentStep === 'review' ? 'text-primary' : 'text-gray-500'}`}>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStep === 'customer' || currentStep === 'review' ? 'bg-primary text-white' : 'border-2 border-gray-300 bg-white'}`}>
                    <span className="text-sm font-medium">2</span>
                  </span>
                  <span className="ml-3 text-sm font-medium">Your Info</span>
                </div>
                <div className={`flex items-center ${currentStep === 'review' ? 'text-primary' : 'text-gray-500'}`}>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStep === 'review' ? 'bg-primary text-white' : 'border-2 border-gray-300 bg-white'}`}>
                    <span className="text-sm font-medium">3</span>
                  </span>
                  <span className="ml-3 text-sm font-medium">Save Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div>
          {currentStep === 'calculate' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Section */}
              <div className="lg:col-span-1">
                <CalculatorForm 
                  onCalculate={handleCalculate}
                  isCalculating={calculationMutation.isPending}
                />
              </div>
              
              {/* Results Section */}
              <div className="lg:col-span-2">
                <CalculatorResults 
                  results={results} 
                  isLoading={calculationMutation.isPending}
                />
                
                {results && (
                  <div className="mt-8 flex justify-end">
                    <Button 
                      onClick={() => moveToStep('customer')}
                      className="bg-primary hover:bg-blue-600"
                    >
                      Next: Enter Your Info
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 'customer' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Customer Info Section */}
              <div className="lg:col-span-1">
                <CustomerInfoForm onCustomerInfoChange={handleCustomerInfoChange} />
                
                <div className="mt-6 flex flex-col gap-4">
                  <Button 
                    onClick={() => moveToStep('calculate')}
                    variant="outline"
                  >
                    Back to Calculator
                  </Button>
                  
                  <Button 
                    onClick={() => moveToStep('review')}
                    className="bg-primary hover:bg-blue-600"
                    disabled={!customerInfo?.firstName || !customerInfo?.lastName || !customerInfo?.email || !customerInfo?.company}
                  >
                    Next: Review & Submit
                  </Button>
                </div>
              </div>
              
              {/* Results Preview */}
              <div className="lg:col-span-2">
                <CalculatorResults 
                  results={results} 
                  isLoading={false}
                />
              </div>
            </div>
          )}
          
          {currentStep === 'review' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Review & Submit</h3>
                
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Thank you for your submission!</h2>
                    <p className="text-gray-600 mb-6">Your calculation has been saved with ID: {submissionId}</p>
                    <div className="flex justify-center">
                      <Button 
                        onClick={() => {
                          setCurrentStep('calculate');
                          setSubmitted(false);
                          setResults(null);
                          setCustomerInfo(null);
                        }}
                        className="bg-primary hover:bg-blue-600"
                      >
                        Start New Calculation
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Your Information</h4>
                        <div className="space-y-2">
                          <p><span className="text-gray-500">Name:</span> {customerInfo?.firstName} {customerInfo?.lastName}</p>
                          <p><span className="text-gray-500">Email:</span> {customerInfo?.email}</p>
                          <p><span className="text-gray-500">Phone:</span> {customerInfo?.phone || 'Not provided'}</p>
                          <p><span className="text-gray-500">Company:</span> {customerInfo?.company}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Calculation Summary</h4>
                        <div className="space-y-2">
                          <p><span className="text-gray-500">Project:</span> {calculationMutation.variables?.projectName}</p>
                          <p><span className="text-gray-500">Sites:</span> {calculationMutation.variables?.numSites}</p>
                          <p><span className="text-gray-500">5-Year Savings:</span> {results ? new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                          }).format(results.fiveYearSavings) : '-'}</p>
                          <p><span className="text-gray-500">ROI Timeframe:</span> {results ? `${results.roiTimeframe.toFixed(1)} years` : '-'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                      <Button 
                        onClick={() => moveToStep('customer')}
                        variant="outline"
                      >
                        Back
                      </Button>
                      
                      <Button 
                        onClick={handleSubmit}
                        className="bg-primary hover:bg-blue-600"
                        disabled={submissionMutation.isPending}
                      >
                        {submissionMutation.isPending ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save My Results
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2023 Remote Drone Platform. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
