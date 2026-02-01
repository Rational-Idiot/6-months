export interface HuntStage {
  slug: string;
  title: string;
  description: string;
  nextSlug: string | null;
  nextHint?: string;
  isFinal?: boolean;
}

export const HUNT_STAGES: HuntStage[] = [
  // Hawa Point
  {
    slug: "7f3a9c",
    title: "Hawa Hawa Ee Hawa Mujhko Udaalee~~",
    description:
      "You Have found the beginning to a mystery, where shall this lead you",
    nextSlug: "bd91e2",
    nextHint: "18th January 2025",
  },
  // CC3 Terrace
  {
    slug: "bd91e2",
    title: "Forbidden Doors",
    description:
      "You found the place where our sould first touched, It's time to go further",
    nextSlug: "k9m2x1",
    nextHint: "Our Mythical Spot",
  },
  // Besides Audi
  {
    slug: "k9m2x1",
    title: "Halfway There",
    description: "Do you remember the shadow of the guard spawning behind us",
    nextSlug: "p4n8q7",
    nextHint:
      "Where i first experienced divinity and you couldn't hold yourself back",
  },
  // Lohri Bench
  {
    slug: "p4n8q7",
    title: "Utter Magnificence",
    description: "You have come so far, only a short while remains",
    nextSlug: "r6t3y8",
    nextHint: "Jaha Aapne mujhe traumatise kiya tha",
  },
  // Squash Court
  {
    slug: "r6t3y8",
    title: "Definetly the best game ever",
    description: "One more last hint ~",
    nextHint: "Where we met the last time, you need a long hug",
    nextSlug: "v2w5z0",
  },
  //LitRoom
  {
    slug: "v2w5z0",
    title: "Turn Around My Love",
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
