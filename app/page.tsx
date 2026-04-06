import { HomeHero } from "@/components/home-hero";
import { HotOrNotSwiper } from "@/components/hot-or-not-swiper";

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16">
      <HomeHero />

      <div className="border-t border-dead-line" aria-hidden />

      <section id="hot-or-not" className="scroll-mt-24">
        <p className="mb-1 text-center font-display text-[8px] tracking-[0.25em] text-dead-red animate-pulse">
          ● LIVE
        </p>
        <h2 className="font-display mb-2 text-center text-xs tracking-widest text-dead-neon">
          HOT OR NOT: DEAD TECH EDITION
        </h2>
        <p className="font-body mb-8 text-center text-[13px] text-[#d4d4d4]">
          Resurrect it or let it rot? Swipe or tap. One corpse at a time.
        </p>
        <HotOrNotSwiper />
      </section>
    </div>
  );
}
