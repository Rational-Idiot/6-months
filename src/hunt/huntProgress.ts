import {
  getStorageMode,
  getDeviceId,
  fetchProgressLocal,
  fetchProgressSupabase,
  completeStageLocal,
  completeStageSupabase,
  type HuntProgressState,
} from "./storage";

export type { HuntProgressState } from "./storage";
export { getDeviceId, getStorageMode } from "./storage";

export async function fetchProgress(): Promise<HuntProgressState> {
  if (getStorageMode() === "local") {
    return fetchProgressLocal();
  }
  return fetchProgressSupabase();
}

export async function completeStage(
  slug: string,
): Promise<{ ok: boolean; error?: string }> {
  if (getStorageMode() === "local") {
    return completeStageLocal(slug);
  }
  return completeStageSupabase(slug);
}

export function hasUnlockedStage(
  completedSlugs: string[],
  stageIndex: number,
): boolean {
  if (stageIndex <= 0) return true;
  return completedSlugs.length >= stageIndex;
}
