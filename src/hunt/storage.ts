const DEVICE_ID_KEY = "hunt_device_id";
const LOCAL_PROGRESS_KEY = "hunt_completed_slugs";

export type HuntProgressState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; completedSlugs: string[] };

export function getDeviceId(): string {
  if (typeof localStorage === "undefined") {
    return "ssr";
  }
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getStorageMode(): "local" | "supabase" {
  if (
    window.location.hostname.startsWith("172.") ||
    window.location.hostname === "localhost"
  ) {
    return "local";
  }

  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (url && key && typeof url === "string" && url.trim() !== "") {
    return "supabase";
  }
  return "local";
}

function getLocalProgress(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_PROGRESS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((s): s is string => typeof s === "string")
      : [];
  } catch {
    return [];
  }
}

function setLocalProgress(slugs: string[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(slugs));
}

export async function fetchProgressLocal(): Promise<HuntProgressState> {
  const completedSlugs = getLocalProgress();
  return { status: "ready", completedSlugs };
}

export async function completeStageLocal(
  slug: string,
): Promise<{ ok: boolean; error?: string }> {
  const current = getLocalProgress();
  if (current.includes(slug)) return { ok: true };
  setLocalProgress([...current, slug]);
  return { ok: true };
}

export async function fetchProgressSupabase(): Promise<HuntProgressState> {
  const { supabase } = await import("../supabaseClient");
  const deviceId = getDeviceId();
  try {
    const { data, error } = await supabase
      .from("hunt_progress")
      .select("completed_slugs")
      .eq("device_id", deviceId)
      .maybeSingle();

    if (error) {
      return { status: "error", message: error.message };
    }

    const completedSlugs = (data?.completed_slugs as string[] | null) ?? [];
    return { status: "ready", completedSlugs };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load progress";
    return { status: "error", message };
  }
}

export async function completeStageSupabase(
  slug: string,
): Promise<{ ok: boolean; error?: string }> {
  const { supabase } = await import("../supabaseClient");
  const deviceId = getDeviceId();
  try {
    const { data: existing } = await supabase
      .from("hunt_progress")
      .select("completed_slugs")
      .eq("device_id", deviceId)
      .maybeSingle();

    const current = (existing?.completed_slugs as string[] | null) ?? [];
    if (current.includes(slug)) return { ok: true };

    const nextSlugs = [...current, slug];

    const { error } = await supabase.from("hunt_progress").upsert(
      {
        device_id: deviceId,
        completed_slugs: nextSlugs,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "device_id" },
    );

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : "Failed to save progress";
    return { ok: false, error };
  }
}
