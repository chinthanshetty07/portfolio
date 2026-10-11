import { KageLandingPage } from "./shaders/landing-pages/KageLandingPage";
import "./shaders/threeui.css";
import "./kage-scene.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <KageLandingPage
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

export default Scene;
