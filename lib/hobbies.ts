import { Hobby, StopReason, SkillLevelOption } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// HOBBIES
// Add new hobbies here. `image` should match the filename in /public/images/
// The grid in HobbyPicker is flexible — it will grow automatically.
// ─────────────────────────────────────────────────────────────────────────────
export const HOBBIES: Hobby[] = [
  { id: "photography", label: "Photography", image: "/images/camera_select.png" },
  { id: "painting",    label: "Painting",    image: "/images/painting_select.png"    },
  { id: "drawing",     label: "Drawing",     image: "/images/drawing_select.png"     },
  { id: "writing",     label: "Writing",     image: "/images/writing_select.png"     },
  // ← add more hobbies here in the future; UI adapts automatically
];

// ─────────────────────────────────────────────────────────────────────────────
// STOP REASONS
// Shown on the "Why did you stop?" page as clickable chips.
// ─────────────────────────────────────────────────────────────────────────────
export const STOP_REASONS: StopReason[] = [
  { id: "no-time",       label: "Didn't have time"         },
  { id: "lost-interest", label: "Lost interest"            },
  { id: "too-hard",      label: "It got too difficult"     },
  { id: "no-supplies",   label: "No supplies / equipment"  },
  { id: "life-happened", label: "Life just got in the way" },
  { id: "no-community",  label: "No one to do it with"     },
  // ← add more reasons here
];

// ─────────────────────────────────────────────────────────────────────────────
// SKILL LEVELS
// Shown on the dashboard as a horizontal pill row. Stored in the Zustand store.
// ─────────────────────────────────────────────────────────────────────────────
export const SKILL_LEVELS: SkillLevelOption[] = [
  { id: "novice",       label: "Novice",       blurb: "Just starting out" },
  { id: "getting-good", label: "Getting good", blurb: "Past the basics"   },
  { id: "advanced",     label: "Advanced",     blurb: "Confident & capable" },
  { id: "expert",       label: "Expert",       blurb: "Deep experience"   },
  { id: "just-for-fun", label: "Just for fun", blurb: "No pressure at all" },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEW HOBBIES — "Something completely new?" suggestions on the /explore page.
// These reuse the floating home-page illustrations.
// ─────────────────────────────────────────────────────────────────────────────
export const NEW_HOBBIES: Hobby[] = [
  { id: "gardening", label: "Gardening", image: "/images/gardening.png" },
  { id: "cooking",   label: "Cooking",   image: "/images/cooking.png"   },
  { id: "music",     label: "Music",     image: "/images/music.png"     },
  { id: "singing",   label: "Singing",   image: "/images/singing.png"   },
  { id: "karate",    label: "Karate",    image: "/images/karate.png"    },
  { id: "reading",   label: "Reading",   image: "/images/reading.png"   },
];