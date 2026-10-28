import { LinkButton } from '@/components/ui';
import { useMeta } from '@/lib/hooks';

export default function NotFoundPage() {
  useMeta('Page not found');
  return (
    <section className="container-x grid min-h-[80vh] place-items-center pt-[var(--nav-h)] text-center">
      <div>
        <p className="font-display text-[34vw] leading-none text-white/[0.06] sm:text-[220px]">404</p>
        <h1 className="display -mt-10 text-5xl sm:text-7xl">Offside.</h1>
        <p className="mt-4 text-ivory-muted">This page isn’t on the team sheet.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton to="/">Back to the Bridge</LinkButton>
          <LinkButton to="/matches" variant="ghost">
            Matches
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
