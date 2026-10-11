// The portfolio homepage: Kage's world and layout with portfolio copy, derived from
// the canonical kage.html by scripts/build-portfolio-page.py. Same frame and
// typography recipe as KageLandingPage, pointed at the derived document.
import {
  splitTypographyProps,
  usePageTypography,
  type PageTypographyProps,
} from "./pageTypography";
import { LandingPageFrame, type LandingPageProps } from "./LandingPageFrame";
import { KAGE_TYPOGRAPHY } from "./pageRecipes";

export function PortfolioLandingPage(props: LandingPageProps & PageTypographyProps) {
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(KAGE_TYPOGRAPHY, type);
  return <LandingPageFrame {...frame} customization={customization} title="Chinthan Shetty, software engineer" sourceUrl="/landing-pages/portfolio.html" />;
}
