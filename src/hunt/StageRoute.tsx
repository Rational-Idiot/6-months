import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import StageView from "./StageView";
import { getStageBySlug, ENTRY_SLUG } from "./stages";
import { fetchProgress, completeStage } from "./huntProgress";
import type { HuntProgressState } from "./huntProgress";

export default function StageRoute() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [progress, setProgress] = useState<HuntProgressState>({
    status: "loading",
  });
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      const p = await fetchProgress();
      if (alive) setProgress(p);
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  if (!slug) return <Navigate to={`/hunt/${ENTRY_SLUG}`} replace />;

  const stage = getStageBySlug(slug);
  if (!stage) return <Navigate to={`/hunt/${ENTRY_SLUG}`} replace />;

  if (progress.status === "loading") return null;

  const completedSlugs =
    progress.status === "ready" ? progress.completedSlugs : [];

  useEffect(() => {
    if (!completedSlugs.includes(stage.slug)) {
      setIsCompleting(true);
      completeStage(stage.slug)
        .catch(() => { })
        .finally(() => setIsCompleting(false));
    }
  }, [stage.slug]);

  return <StageView stage={stage} completedSlugs={completedSlugs} />;
}
