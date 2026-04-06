import { cookies } from "next/headers";

const FP_COOKIE = "deadair_voter_fp";

export async function getServerFingerprint(): Promise<string> {
  const jar = await cookies();
  return jar.get(FP_COOKIE)?.value ?? "anonymous";
}
