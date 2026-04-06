import Link from "next/link";
import { SubmitForm } from "@/components/submit-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Bury a project",
};

export default async function SubmitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <h1 className="font-display text-sm text-dead-neon">LOG IN TO BURY SOMETHING</h1>
        <p className="font-body text-[13px] text-[#c0c0c0]">
          The graveyard needs auth for rate limits and screenshots. No capes required.
        </p>
        <Link href="/login" className="terminal-btn-primary inline-block">
          LOG IN
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-display text-[8px] tracking-[0.2em] text-dead-red">LAY IT TO REST</p>
        <h1 className="font-display text-sm text-dead-neon sm:text-base">BURY YOUR PROJECT</h1>
        <p className="font-body max-w-xl text-[13px] text-[#d4d4d4]">
          Tell us what broke. Our AI obituary writer will roast the idea, not you. Max two burials per day — even
          cemeteries have visiting hours.
        </p>
      </header>
      <SubmitForm />
    </div>
  );
}
