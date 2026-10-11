import { PortfolioLandingPage } from "./shaders/landing-pages/PortfolioLandingPage";
import "./shaders/threeui.css";
import "./kage-scene.css";

export default function PortfolioScene() {
  return (
    <div className="shader-frame">
      <PortfolioLandingPage
        headingFont="onest"
        bodyFont="onest"
        headingWeight="400"
        bodyWeight="300"
        primaryColor="#e0231c"
        headingSize={46}
        bodySize={17}
        headingLetterSpacing={-0.012}
      />
    </div>
  );
}
