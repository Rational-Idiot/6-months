import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getStageBySlug,
  getStageIndex,
  isSlugValid,
  ENTRY_SLUG,
} from "./stages";
import { fetchProgress, completeStage, hasUnlockedStage } from "./huntProgress";
import type { HuntProgressState } from "./huntProgress";
import StageView from "./StageView";

type ViewState = "loading" | "locked" | "stage" | "network_error";

const HuntApp: React.FC = () => {
  const { slug } = useParams<"slug">();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<HuntProgressState>({
    status: "loading",
  });
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [isCompleting, setIsCompleting] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);

  const currentSlug = slug ?? "";

  useEffect(() => {
    if (!slug) {
      navigate(`/hunt/${ENTRY_SLUG}`, { replace: true });
      return;
    }

    let cancelled = false;

    async function run() {
      if (!isSlugValid(currentSlug)) {
        if (!cancelled) setViewState("locked");
        return;
      }

      const progressResult = await fetchProgress();
      if (cancelled) return;
      setProgress(progressResult);

      if (progressResult.status === "error") {
        setViewState("network_error");
        return;
      }

      if (progressResult.status !== "ready") return;

      const index = getStageIndex(currentSlug);
      const unlocked = hasUnlockedStage(progressResult.completedSlugs, index);
      setViewState(unlocked ? "stage" : "locked");
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [slug, currentSlug, navigate]);

  const handleComplete = async () => {
    const stage = getStageBySlug(currentSlug);
    if (!stage) return;

    setCompleteError(null);
    setIsCompleting(true);
    const result = await completeStage(currentSlug);
    setIsCompleting(false);

    if (!result.ok) {
      setCompleteError(result.error ?? "Could not save progress.");
      return;
    }

    if (stage.nextSlug) {
      navigate(`/hunt/${stage.nextSlug}`, { replace: true });
    } else {
      setProgress((prev) =>
        prev.status === "ready"
          ? {
              status: "ready",
              completedSlugs: [...prev.completedSlugs, currentSlug],
            }
          : prev,
      );
    }
  };

  const stage = getStageBySlug(currentSlug);

  const content =
    viewState === "loading" ? (
      <div className="min-h-screen flex items-center justify-center font-poppins">
        <motion.div
          className="text-gray-500 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading…
        </motion.div>
      </div>
    ) : viewState === "network_error" ? (
      <div className="min-h-screen flex items-center justify-center font-poppins px-6">
        <motion.div
          className="max-w-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Check your connection and try again. Your place in the hunt is safe.
          </p>
        </motion.div>
      </div>
    ) : (
      <AnimatePresence mode="wait">
        <StageView
          key={currentSlug}
          stage={stage}
          onComplete={handleComplete}
          isCompleting={isCompleting}
          completeError={completeError}
        />
      </AnimatePresence>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-lavender-50 to-mint-50 font-poppins">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-start p-4">
        <Link
          to="/"
          className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
        >
          ← Home
        </Link>
      </header>
      {content}
    </div>
  );
};

export default HuntApp;
