import { useState, useEffect } from "react";
import CalculatorForm from "./CalculatorForm";
import CalculatorResults from "./CalculatorResults";
import { CalculationInput, CalculationResult } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { calculateResults } from "@/lib/calculatorUtils";
import { Button } from "@/components/ui/button";

const defaultValues: CalculationInput = {
  annualSalary: 200000,
  airtimeHours: 21.1,
  operationHours: 62.6,
};

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

  // Load default results when component mounts
  useEffect(() => {
    handleCalculate(defaultValues);
  }, []);

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
    <div className="bg-white">
      {/* Header Section */}
      <header className="bg-white border-b border-[#ececec] h-[60px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center h-[60px]">
          <div className="flex gap-[20px] content-baseline"><div><img src="https://cdn.prod.website-files.com/667cf0e5d33cd95d355e2846/67a04249abc45b4c901454ae_logo-Sphere-HOR-COL@2x.avif" alt="Sphere Logo" className="w-[100px]"
/>
</div><div><a className="text-sm underline text-[#e85833] hover:text-[#bc4200]" href="https://www.spheredrones.com.au">Back to Sphere</a></div>
          </div>
          <div>
            <button className="transition-colors border border-[#e85833] bg-[#e85833] bg-[linear-gradient(35deg,#e85833_30%,#ff8543)] tracking-normal normal-case rounded-[20px] px-[28px] py-[8px] text-[14px] font-semibold leading-[18px] text-white hover:border-[#bc4200] hover:bg-[#bc4200] hover:bg-none">
  Contact us
</button>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Section */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold">Remote Drone Operations ROI Calculator</h1>
          <h2 className="text-m font-semibold mb-4">Estimate your remote drone ops ROI in 60 seconds</h2>
          <p className="mb-4">Thinking of switching to remote drone operations but not sure what the savings look like? Compare manual vs remote drone ops to see how much time and money you could save. Get an instant cost breakdown with 5-year projections.</p>
          <p className="text-sm text-gray-500 mb-4"><strong>Disclaimer:</strong> These results are indicative only. Real-world savings may vary depending on your setup, team, and operational needs.</p>
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
            
            {/* PDF and Email Actions - Hidden while feature is being built */}
            {/* {results && (
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
            )} */}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#f4f4f4] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-[#838182]">© 2025 Sphere Communications Pty. Ltd. • ABN: 61 003 102 663 • ReOC: 1114</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
