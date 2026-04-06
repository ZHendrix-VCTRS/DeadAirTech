import { HomeHero } from "@/components/home-hero";
import { HotOrNotSwiper } from "@/components/hot-or-not-swiper";

export default function HomePage() {
  return (
    <div>
      <HomeHero />

      <section
        id="hot-or-not"
        className="scroll-mt-24 border-t border-[rgba(57,255,20,0.15)] bg-[rgba(57,255,20,0.02)] pt-20"
      >
        <p className="mb-1 text-center font-display text-[10px] tracking-[0.25em] text-dead-red animate-pulse">
          ● LIVE
        </p>
        <h2 className="font-display mb-2 text-center text-[18px] tracking-widest text-dead-neon">
          HOT OR NOT: DEAD TECH EDITION
        </h2>
        <p className="font-body mb-8 text-center text-[15px] text-[#d4d4d4]">
          Resurrect it or let it rot? Swipe or tap. One corpse at a time.
        </p>
        <HotOrNotSwiper />
      </section>
    </div>
  );
}
