"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { addInvestorNote, advanceOrder, createCheckoutOrder, getInvestorByEmail, markPassAdded, toggleInvestorTag, type CheckoutInput } from "@/lib/data/store";
import type { PassPlatform } from "@/lib/data/types";

const INVESTOR_COOKIE = "fc_investor";

export async function markPassAddedAction(passId: string, platform: PassPlatform) {
  markPassAdded(passId, platform);
  revalidatePath(`/wallet/${passId}`);
  revalidatePath("/lumen/investors");
  revalidatePath("/issuer", "layout");
}

export async function advanceOrderAction(orderId: string, passId: string) {
  advanceOrder(orderId);
  revalidatePath(`/wallet/${passId}`);
  revalidatePath("/lumen/investors", "layout");
  revalidatePath("/issuer", "layout");
}

export async function createCheckoutAction(input: CheckoutInput): Promise<{ orderId: string; passId: string; investorId: string }> {
  const { investor, order, pass } = createCheckoutOrder(input);
  const jar = await cookies();
  jar.set(INVESTOR_COOKIE, investor.id, { httpOnly: true, sameSite: "lax", path: "/" });
  revalidatePath("/issuer", "layout");
  revalidatePath("/lumen/investors", "layout");
  return { orderId: order.id, passId: pass.id, investorId: investor.id };
}

export async function investorLoginAction(email: string): Promise<{ ok: boolean; message?: string }> {
  const inv = getInvestorByEmail(email);
  if (!inv) return { ok: false, message: "No investor record for that email in this demo. Try jordan.ellis@example.com." };
  const jar = await cookies();
  jar.set(INVESTOR_COOKIE, inv.id, { httpOnly: true, sameSite: "lax", path: "/" });
  revalidatePath("/lumen/investors", "layout");
  return { ok: true };
}

export async function investorLogoutAction() {
  const jar = await cookies();
  jar.delete(INVESTOR_COOKIE);
  revalidatePath("/lumen/investors", "layout");
}

/** The signed-in investor for the issuer-website dashboard, or null when logged out. */
export async function currentInvestorId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(INVESTOR_COOKIE)?.value ?? null;
}

export async function addNoteAction(investorId: string, text: string) {
  if (text.trim()) addInvestorNote(investorId, text.trim());
  revalidatePath(`/issuer/investors/${investorId}`);
}

export async function toggleTagAction(investorId: string, tag: string) {
  toggleInvestorTag(investorId, tag);
  revalidatePath(`/issuer/investors/${investorId}`);
  revalidatePath("/issuer/investors");
}
