import { Helmet } from "react-helmet";
import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Remote vs Manual Drone Ops ROI Calculator - Sphere</title>
        <meta name="description" content="Thinking of switching to remote drone operations but not sure what the savings look like? Compare manual vs remote drone ops to see how much time and money you could save. Get an instant cost breakdown with 5-year projections." />
        <meta property="og:title" content="Remote vs Manual Drone Ops ROI Calculator - Sphere" />
        <meta property="og:description" content="Compare costs and benefits of remote drone platforms versus manual flights. Calculate your potential savings." />
        <meta property="og:type" content="website" />
      </Helmet>
      <Calculator />
    </>
  );
}
