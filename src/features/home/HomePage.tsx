import { useMeta } from '@/lib/hooks';
import { HeroSequence } from './HeroSequence';
import { Closing, ExperienceIntro, LatestNews, LegendsRail, Marquee, StadiumTeaser, TrophyShowcase } from './HomeSections';
import { NextMatch } from './NextMatch';

export default function HomePage() {
  useMeta('', 'London is Blue — an immersive, unofficial Chelsea-inspired experience: matchdays, Stamford Bridge, trophies, legends and a demo booking system.');
  return (
    <>
      <HeroSequence />
      <NextMatch />
      <Marquee />
      <ExperienceIntro />
      <TrophyShowcase />
      <LegendsRail />
      <StadiumTeaser />
      <LatestNews />
      <Closing />
    </>
  );
}
