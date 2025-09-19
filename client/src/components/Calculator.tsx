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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white border-b border-[#ececec]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="25" viewBox="0 0 100 25" fill="none">
<g clip-path="url(#clip0_130_610)">
<mask id="mask0_130_610" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="4" y="15" width="18" height="11">
<path d="M6.00843 21.639C5.73212 20.8673 5.76714 20.0368 6.1135 19.2925C6.45986 18.5483 7.07085 17.9881 7.82972 17.71L11.3672 16.4212L10.9158 15.1677L7.4678 16.4251L7.38996 16.4525C6.29252 16.8521 5.413 17.659 4.91876 18.7245C4.42063 19.79 4.37004 20.9848 4.76699 22.0934C5.16783 23.1981 5.96562 24.0834 7.02415 24.5809C7.58844 24.8472 8.19554 24.9883 8.79874 25C9.32023 25.0078 9.8456 24.9217 10.3515 24.7375L21.8124 20.5578L21.361 19.3043L9.97013 23.4566L9.91176 23.4762C9.1451 23.7543 8.32007 23.7151 7.58065 23.3704C6.84124 23.0218 6.28473 22.4068 6.00843 21.6351" fill="white"></path>
</mask>
<g mask="url(#mask0_130_610)">
<mask id="mask1_130_610" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="2" y="13" width="22" height="14">
<path d="M23.7584 13.209H2.55273V26.9587H23.7584V13.209Z" fill="white"></path>
</mask>
<g mask="url(#mask1_130_610)">
<mask id="mask2_130_610" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="2" y="13" width="22" height="14">
<path d="M23.7584 13.209H2.55273V26.9587H23.7584V13.209Z" fill="white"></path>
</mask>
<g mask="url(#mask2_130_610)">
<rect x="2.44336" y="13.025" width="21.4819" height="14.1022" fill="url(#pattern0_130_610)"></rect>
</g>
</g>
</g>
<mask id="mask3_130_610" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="2" y="8" width="23" height="13">
<path d="M24.6659 14.8464C24.269 13.7418 23.4673 12.8565 22.4088 12.3551L14.4776 8.61798L13.9133 9.82842L21.2763 13.2991L21.8445 13.5655C22.5839 13.9141 23.1404 14.5291 23.4167 15.3008C23.693 16.0725 23.6541 16.903 23.3116 17.6473C22.9653 18.3916 22.3543 18.9517 21.5876 19.2338C20.8327 19.508 20.0154 19.4727 19.2838 19.1358L3.07114 11.4933L2.51074 12.6998L18.7 20.3345C19.2643 20.6009 19.8675 20.7419 20.4785 20.7498C21.0078 20.7615 21.537 20.6714 22.0469 20.4834C23.1443 20.0838 24.0238 19.2769 24.5181 18.2114C25.0162 17.1459 25.0668 15.9511 24.6698 14.8464" fill="white"></path>
</mask>
<g mask="url(#mask3_130_610)">
<mask id="mask4_130_610" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="6" width="27" height="17">
<path d="M26.8759 6.65936H0.560547V22.7084H26.8759V6.65936Z" fill="white"></path>
</mask>
<g mask="url(#mask4_130_610)">
<mask id="mask5_130_610" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="6" width="27" height="17">
<path d="M26.8759 6.65936H0.560547V22.7084H26.8759V6.65936Z" fill="white"></path>
</mask>
<g mask="url(#mask5_130_610)">
<rect x="0.389648" y="6.63196" width="26.5255" height="16.1705" fill="url(#pattern1_130_610)"></rect>
</g>
</g>
</g>
<path d="M4.30033 13.1267C2.49849 13.0954 0.875668 11.9281 0.260786 10.2201C-0.560354 7.93637 0.614927 5.40973 2.88376 4.57927L3.31185 4.42258L14.7261 0.266356C15.232 0.0822446 15.7574 -0.00785249 16.2905 -1.79582e-05C18.0924 0.0313202 19.7152 1.19867 20.3301 2.90659C20.727 4.01126 20.6764 5.20603 20.1783 6.27153C19.6802 7.33702 18.8045 8.14398 17.7071 8.54354L5.8531 12.8643C5.35886 13.0445 4.83348 13.1346 4.30033 13.1228M16.2672 1.33577C15.8975 1.32794 15.5278 1.39061 15.1775 1.51988L15.0491 1.56689L3.33519 5.83671C1.75518 6.41255 0.934043 8.17532 1.51001 9.76573C1.93809 10.9566 3.07056 11.7675 4.32368 11.791C4.69727 11.7988 5.06309 11.7361 5.41334 11.6068L5.45615 11.5912L17.2518 7.29002C18.0184 7.01189 18.6294 6.4478 18.9758 5.70744C19.3221 4.96316 19.3571 4.12878 19.0808 3.361C18.6528 2.17015 17.5203 1.35927 16.2672 1.33577Z" fill="url(#paint0_radial_130_610)"></path>
<path d="M41.8746 11.9007C41.2441 11.317 40.3529 10.9214 39.2088 10.7138L35.2626 10.0282C34.6011 9.91071 34.0835 9.67568 33.7099 9.31921C33.3324 8.96665 33.1456 8.53184 33.1456 8.01084V6.81216C33.1456 6.17756 33.3946 5.67223 33.8967 5.29226C34.3987 4.9162 35.0642 4.72817 35.9009 4.72817H38.3915C39.1699 4.72817 39.7964 4.97104 40.2634 5.4607C40.7343 5.94644 40.9678 6.60062 40.9678 7.4115H42.5556C42.5556 6.16972 42.1742 5.1669 41.4076 4.40695C40.6448 3.647 39.6369 3.26703 38.3876 3.26703H35.897C34.5738 3.26703 33.5114 3.58824 32.7136 4.23068C31.9158 4.87311 31.515 5.73491 31.515 6.81216V8.01084C31.515 8.92748 31.8224 9.69135 32.4412 10.2946C33.06 10.9018 33.9239 11.3013 35.0408 11.4933L39.0064 12.1592C39.6836 12.2611 40.2128 12.4922 40.6059 12.8447C40.995 13.1973 41.1896 13.6282 41.1896 14.1296V15.5477C41.1896 16.1823 40.925 16.6993 40.3957 17.0871C39.8665 17.4789 39.1699 17.6747 38.302 17.6747H35.8581C34.9747 17.6747 34.2664 17.3927 33.7293 16.8247C33.1923 16.2567 32.9237 15.5124 32.9237 14.5958H31.3398C31.3398 15.4967 31.5266 16.2919 31.9002 16.9814C32.2738 17.6669 32.7992 18.1997 33.4725 18.5796C34.1496 18.9557 34.928 19.1437 35.8075 19.1437H38.3409C39.6758 19.1437 40.7577 18.8147 41.5788 18.1566C42.3999 17.4985 42.8124 16.6327 42.8124 15.5516V14.1335C42.8124 13.2326 42.4972 12.4883 41.8629 11.9046L41.8746 11.9007Z" fill="#332C31"></path>
<path d="M54.3354 8.85304C53.6077 8.09701 52.6581 7.72095 51.4789 7.72095H49.895C49.3813 7.72095 48.8676 7.87372 48.3656 8.1871C47.8597 8.49657 47.4511 8.90396 47.1397 9.40537V7.89722H45.5986V23.3783L47.1825 22.7985V17.7452C47.4627 18.1605 47.848 18.4934 48.35 18.752C48.8521 19.0105 49.3268 19.1398 49.7822 19.1398H51.3661C52.5842 19.1398 53.5649 18.7206 54.3082 17.8863C55.0476 17.0519 55.4212 15.9472 55.4212 14.5722V11.8458C55.4212 10.6041 55.0593 9.60515 54.3315 8.84912L54.3354 8.85304ZM53.8373 14.5762C53.8373 15.5202 53.6116 16.2841 53.1562 16.8599C52.7009 17.4358 52.0899 17.7256 51.3272 17.7256H49.8756C49.1829 17.7256 48.5874 17.4749 48.0893 16.9696C47.5912 16.4682 47.2876 15.8258 47.1864 15.0384V11.7126C47.3771 10.9566 47.7235 10.3416 48.2216 9.85978C48.7197 9.37795 49.2801 9.139 49.8989 9.139H51.44C52.16 9.139 52.7398 9.38579 53.1796 9.88328C53.6193 10.3808 53.8412 11.035 53.8412 11.8458V14.5722L53.8373 14.5762Z" fill="#332C31"></path>
<path d="M66.8275 8.76296C66.201 8.0696 65.3837 7.72096 64.3719 7.72096H62.8308C62.286 7.72096 61.7528 7.87374 61.2236 8.18712C60.6943 8.49658 60.2623 8.91181 59.9237 9.42889V3.43939L58.3359 4.02307V18.9674H59.9237V12.026C60.0677 11.1838 60.4258 10.4944 60.99 9.95381C61.5543 9.41323 62.1848 9.14685 62.8736 9.14685H64.3252C64.8856 9.14685 65.3331 9.3623 65.6717 9.78928C66.0103 10.2163 66.1776 10.7725 66.1776 11.4502V18.9674H67.7615V11.4933C67.7615 10.373 67.4502 9.46023 66.8275 8.76688V8.76296Z" fill="#332C31"></path>
<path d="M80.3665 13.8005V11.8497C80.3665 10.608 80.0046 9.60907 79.2885 8.85304C78.5685 8.09701 77.6229 7.72095 76.4476 7.72095H74.6418C73.4082 7.72095 72.4158 8.10876 71.6647 8.88438C70.9136 9.66391 70.54 10.6863 70.54 11.9594V15.1324C70.54 16.3468 70.9136 17.3183 71.6647 18.0508C72.4158 18.7833 73.4082 19.1476 74.6418 19.1476H76.3192C77.5217 19.1476 78.4907 18.8107 79.2262 18.1409C79.9617 17.4671 80.3276 16.5857 80.3276 15.4889H78.7826C78.7826 16.1705 78.5569 16.7111 78.1015 17.1185C77.6462 17.5259 77.0508 17.7296 76.3192 17.7296H74.6418C73.8908 17.7296 73.2876 17.4867 72.8244 17.0088C72.3613 16.527 72.1317 15.9041 72.1317 15.1363V13.8045H80.3704L80.3665 13.8005ZM72.1278 11.9594C72.1278 11.1172 72.3574 10.4356 72.8205 9.91853C73.2837 9.40146 73.8908 9.14292 74.638 9.14292H76.4437C77.1481 9.14292 77.7124 9.3897 78.1404 9.8872C78.5646 10.3847 78.7787 11.0389 78.7787 11.8497V12.4256H72.1278V11.9594Z" fill="#332C31"></path>
<path d="M87.8817 7.85414C87.2356 7.85414 86.613 8.01866 86.0176 8.33988C85.4221 8.66501 84.9785 9.08808 84.6866 9.60516V7.89723H83.1455V18.9635H84.7294V12.5744C84.7294 11.5873 85.0213 10.7882 85.6011 10.1888C86.181 9.58949 86.9438 9.29177 87.8817 9.29177H88.8507V7.85022H87.8817V7.85414Z" fill="#332C31"></path>
<path d="M100 13.8005V11.8497C100 10.608 99.6383 9.60907 98.9223 8.85304C98.2023 8.09701 97.2566 7.72095 96.0814 7.72095H94.2756C93.042 7.72095 92.0496 8.10876 91.2985 8.88438C90.5474 9.66391 90.1738 10.6863 90.1738 11.9594V15.1324C90.1738 16.3468 90.5474 17.3183 91.2985 18.0508C92.0496 18.7833 93.042 19.1476 94.2756 19.1476H95.9529C97.1555 19.1476 98.1245 18.8107 98.86 18.1409C99.5955 17.4671 99.9613 16.5857 99.9613 15.4889H98.4164C98.4164 16.1705 98.1906 16.7111 97.7353 17.1185C97.28 17.5259 96.6846 17.7296 95.9529 17.7296H94.2756C93.5245 17.7296 92.9213 17.4867 92.4582 17.0088C91.9951 16.527 91.7655 15.9041 91.7655 15.1363V13.8045H100.004L100 13.8005ZM91.7616 11.9594C91.7616 11.1172 91.9912 10.4356 92.4543 9.91853C92.9174 9.40146 93.5245 9.14292 94.2717 9.14292H96.0775C96.7819 9.14292 97.3462 9.3897 97.7742 9.8872C98.1984 10.3847 98.4125 11.0389 98.4125 11.8497V12.4256H91.7616V11.9594Z" fill="#332C31"></path>
</g>
<defs>
<pattern id="pattern0_130_610" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_130_610" transform="scale(0.00877193 0.0133333)"></use>
</pattern>
<pattern id="pattern1_130_610" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image1_130_610" transform="scale(0.00714286 0.0117647)"></use>
</pattern>
<radialGradient id="paint0_radial_130_610" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17.9951 1.183) scale(11.889 11.9673)">
<stop stop-color="#FF7843"></stop>
<stop offset="0.63" stop-color="#E85833"></stop>
</radialGradient>
<clipPath id="clip0_130_610">
<rect width="100" height="25" fill="white"></rect>
</clipPath>
<image id="image0_130_610" width="114" height="75" xlink:href="data:image/png;base64,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"></image>
<image id="image1_130_610" width="140" height="85" xlink:href="data:image/png;base64,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"></image>
</defs>
</svg>
          <h1 className="text-2xl font-semibold text-gray-800">Remote Drone Ops ROI Calculator</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Estimate your remote drone ops ROI in 60 seconds</h2>
          <p className="text-gray-600 mb-4">Thinking of switching to remote drone operations but not sure what the savings look like? Compare manual vs remote drone ops to see how much time and money you could save. Get an instant cost breakdown with 5-year projections.</p>
          <p className="text-sm text-gray-500 mb-4"><strong>Disclaimer:</strong> These results are indicative only. Real-world savings may vary depending on your setup, team, and operational needs.</p>
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
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2025 Sphere. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
