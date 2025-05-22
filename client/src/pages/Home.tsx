import { Helmet } from "react-helmet";
import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Drone ROI Calculator</title>
        <meta name="description" content="Calculate the ROI of remote drone platforms versus manual flights. See how much time and money you can save with automated drone operations." />
        <meta property="og:title" content="Drone ROI Calculator" />
        <meta property="og:description" content="Compare costs and benefits of remote drone platforms versus manual flights. Calculate your potential savings." />
        <meta property="og:type" content="website" />
      </Helmet>
      <Calculator />
    </>
  );
}
