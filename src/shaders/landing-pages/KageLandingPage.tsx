// KageLandingPage, taken verbatim from LandingPages.tsx in the ThreeUI bundle.
// That shared file also imports every other ThreeUI landing page (Sylva, Tidecrest,
// Axonis…), which aren't part of this bundle, so it's kept byte-exact for reference
// and excluded from the build; this module re-exports only the Kage component.
import {
  splitTypographyProps,
  usePageTypography,
  type PageTypographyProps,
} from "./pageTypography";
import { LandingPageFrame, type LandingPageProps } from "./LandingPageFrame";
import { KAGE_TYPOGRAPHY } from "./pageRecipes";

export function KageLandingPage(props: LandingPageProps & PageTypographyProps) {
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(KAGE_TYPOGRAPHY, type);
  return <LandingPageFrame {...frame} customization={customization} title="Kage — Where stillness reveals the unseen" sourceUrl="/landing-pages/kage.html" />;
}
