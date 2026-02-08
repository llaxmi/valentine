import type { LetterData } from "../components/ComposeLetter";
import { supabase } from "./supabase";

export interface LetterRow {
  id: string;
  sender_token: string;
  recipient: string;
  opening: string;
  body: string;
  signature: string;
  postscript: string;
  sticker: string;
  tone: number;
  response: "yes" | "no" | null;
  responded_at: string | null;
  opened_at: string | null;
  created_at: string;
}

export async function saveLetter(
  data: LetterData,
): Promise<{ id: string; senderToken: string } | null> {
  if (!supabase) return null;

  const { data: row, error } = await supabase
    .from("valentines")
    .insert({
      recipient: data.recipient,
      opening: data.opening,
      body: data.body,
      signature: data.signature,
      postscript: data.postscript,
      sticker: data.sticker,
      tone: data.tone,
    })
    .select("id, sender_token")
    .single();

  if (error || !row) {
    console.error("Failed to save letter", error);
    return null;
  }

  return { id: row.id, senderToken: row.sender_token };
}

export async function fetchLetter(id: string): Promise<LetterRow | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("valentines")
    .select("id, recipient, opening, body, signature, postscript, sticker, tone, response, responded_at, opened_at, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Failed to fetch letter", error);
    return null;
  }

  return { ...data, sender_token: "" } as LetterRow;
}

export async function markOpened(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.rpc("mark_opened", { letter_id: id });

  if (error) {
    // Fall back to client-side timestamp if RPC doesn't exist
    const { error: updateError } = await supabase
      .from("valentines")
      .update({ opened_at: new Date().toISOString() })
      .eq("id", id)
      .is("opened_at", null);

    if (updateError) {
      console.error("Failed to mark letter as opened", updateError);
      return false;
    }
  }
  return true;
}

export async function recordResponse(
  id: string,
  answer: "yes" | "no",
): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.rpc("record_response", {
    letter_id: id,
    answer,
  });

  if (error) {
    console.error("Failed to record response", error);
    return false;
  }
  return true;
}

export async function fetchStatus(
  senderToken: string,
): Promise<LetterRow | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("valentines")
    .select("*")
    .eq("sender_token", senderToken)
    .single();

  if (error || !data) {
    console.error("Failed to fetch status", error);
    return null;
  }

  return data as LetterRow;
}
