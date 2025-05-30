import { useState } from "react";
import CalculatorForm from "./CalculatorForm";
import CalculatorResults from "./CalculatorResults";
import { CalculationInput, CalculationResult } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { calculateResults } from "@/lib/calculatorUtils";
import { Button } from "@/components/ui/button";

export default function Calculator() {
  const { toast } = useToast();
  const [results, setResults] = useState<CalculationResult | null>(null);

  // Calculation mutation
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

  const handleCalculate = (data: CalculationInput) => {
    calculationMutation.mutate(data);
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation and download
    toast({
      title: "PDF Download",
      description: "PDF download feature will be implemented soon!",
    });
  };

  const handleEmailReport = () => {
    // TODO: Implement email functionality
    toast({
      title: "Email Report",
      description: "Email report feature will be implemented soon!",
    });
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Estimate your drone ops ROI in 60 seconds</h2>
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

        {/* Calculator Layout - Form and Results Side by Side */}
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
            
            {/* PDF and Email Actions - Show when results are available */}
            {results && (
              <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Get Your Report</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleDownloadPDF}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <i className="fa fa-file-pdf mr-2"></i>
                    Download PDF Report
                  </Button>
                  <Button 
                    onClick={handleEmailReport}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <i className="fa fa-envelope mr-2"></i>
                    Email Report to Me
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2025 Sphere. All rights reserved.</p>
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