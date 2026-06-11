import { Hobby, StopReason } from "@/types";

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