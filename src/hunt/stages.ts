export interface HuntStage {
  slug: string;
  title: string;
  description: string;
  nextSlug: string | null;
  nextHint?: string;
  isFinal?: boolean;
}

export const HUNT_STAGES: HuntStage[] = [
  {
    slug: "7f3a9c",
    title: "The First Clue",
    description:
      "You've found the beginning of a trail meant only for you. Each step is a piece of the story we're writing.",
    nextSlug: "bd91e2",
    nextHint: "Where we first said hello",
  },
  {
    slug: "bd91e2",
    title: "Second Step",
    description:
      "Some paths are meant to be walked in order. You're right where you're supposed to be.",
    nextSlug: "k9m2x1",
    nextHint: "Where ideas come alive",
  },
  {
    slug: "k9m2x1",
    title: "Halfway There",
    description: "The middle of the journey holds its own magic. Keep going.",
    nextSlug: "p4n8q7",
    nextHint: "Where the sky meets the ground",
  },
  {
    slug: "p4n8q7",
    title: "Getting Closer",
    description:
      "You're doing amazing. Each clue brings you closer to something special.",
    nextSlug: "r6t3y8",
    nextHint: "Where memories are made",
  },
  {
    slug: "r6t3y8",
    title: "Almost There",
    description:
      "One more step before the end of the hunt—and the beginning of something new.",
    nextSlug: "v2w5z0",
  },
  {
    slug: "v2w5z0",
    title: "The Last Clue",
    description:
      "You've followed every clue. Now come find me—I'll be waiting where this all leads.",
    nextSlug: null,
    isFinal: true,
  },
];

const slugToIndex = new Map<string, number>(
  HUNT_STAGES.map((s, i) => [s.slug, i]),
);

export function getStageBySlug(slug: string): HuntStage | undefined {
  return HUNT_STAGES.find((s) => s.slug === slug);
}

export function getStageIndex(slug: string): number {
  const i = slugToIndex.get(slug);
  return i ?? -1;
}

export function isSlugValid(slug: string): boolean {
  return slugToIndex.has(slug);
}

export const ENTRY_SLUG = HUNT_STAGES[0]?.slug ?? "";
