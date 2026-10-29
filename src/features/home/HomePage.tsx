import { useMeta } from '@/lib/hooks';
import { CabinetSpotlight } from './CabinetSpotlight';
import { HeroSequence } from './HeroSequence';
import { Closing, ExperienceIntro, LatestNews, LegendsRail, Manifesto, Marquee, StadiumTeaser, TrophyShowcase } from './HomeSections';
import { NextMatch } from './NextMatch';

export default function HomePage() {
  useMeta('', 'London is Blue — an immersive, unofficial Chelsea-inspired experience: matchdays, Stamford Bridge, trophies, legends and a demo booking system.');
  return (
    <>
      <HeroSequence />
      <NextMatch />
      <Marquee />
      <Manifesto />
      <ExperienceIntro />
      <CabinetSpotlight />
      <TrophyShowcase />
      <LegendsRail />
      <StadiumTeaser />
      <LatestNews />
      <Closing />
    </>
  );
}
