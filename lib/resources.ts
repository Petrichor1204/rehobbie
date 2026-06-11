import { HobbyResources } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCES
// Hardcoded starter resources keyed by hobby id (books / YouTube / communities).
// Later: replace `getResources` with a Foundry IQ call that returns the same
// shape, personalised to skill level + stop reasons.
// ─────────────────────────────────────────────────────────────────────────────
export const RESOURCES: Record<string, HobbyResources> = {
  photography: {
    books: [
      { kind: "book", title: "Understanding Exposure", by: "Bryan Peterson", note: "The classic for nailing manual mode" },
      { kind: "book", title: "Read This If You Want to Take Great Photographs", by: "Henry Carroll", note: "Short, visual, beginner-friendly" },
    ],
    videos: [
      { kind: "video", title: "Sean Tucker", by: "YouTube", note: "Thoughtful craft + composition", url: "https://youtube.com/@seantucker" },
      { kind: "video", title: "Peter McKinnon", by: "YouTube", note: "Punchy tutorials & gear", url: "https://youtube.com/@petermckinnon" },
    ],
    communities: [
      { kind: "community", title: "r/photography", by: "Reddit", note: "3M+ shooters, weekly critiques", url: "https://reddit.com/r/photography" },
      { kind: "community", title: "r/photocritique", by: "Reddit", note: "Honest, kind feedback", url: "https://reddit.com/r/photocritique" },
    ],
  },
  painting: {
    books: [
      { kind: "book", title: "Color and Light", by: "James Gurney", note: "How light actually behaves" },
      { kind: "book", title: "Alla Prima II", by: "Richard Schmid", note: "A painter's painter's bible" },
    ],
    videos: [
      { kind: "video", title: "Proko", by: "YouTube", note: "Fundamentals, clearly taught", url: "https://youtube.com/@ProkoTV" },
      { kind: "video", title: "Ian Roberts", by: "YouTube", note: "Composition & plein air", url: "https://youtube.com/@t516ian" },
    ],
    communities: [
      { kind: "community", title: "r/painting", by: "Reddit", note: "Share works in progress", url: "https://reddit.com/r/painting" },
      { kind: "community", title: "r/learnart", by: "Reddit", note: "Beginners welcome", url: "https://reddit.com/r/learnart" },
    ],
  },
  drawing: {
    books: [
      { kind: "book", title: "Keys to Drawing", by: "Bert Dodson", note: "Build the habit of seeing" },
      { kind: "book", title: "Drawing on the Right Side of the Brain", by: "Betty Edwards", note: "The confidence-builder" },
    ],
    videos: [
      { kind: "video", title: "Proko", by: "YouTube", note: "Figure & gesture basics", url: "https://youtube.com/@ProkoTV" },
      { kind: "video", title: "Marc Brunet", by: "YouTube", note: "Digital + fundamentals", url: "https://youtube.com/@MarcBrunet" },
    ],
    communities: [
      { kind: "community", title: "r/learntodraw", by: "Reddit", note: "Daily encouragement", url: "https://reddit.com/r/learntodraw" },
      { kind: "community", title: "r/sketchdaily", by: "Reddit", note: "A prompt every day", url: "https://reddit.com/r/sketchdaily" },
    ],
  },
  writing: {
    books: [
      { kind: "book", title: "Bird by Bird", by: "Anne Lamott", note: "On showing up, badly, anyway" },
      { kind: "book", title: "On Writing", by: "Stephen King", note: "Half memoir, half toolkit" },
    ],
    videos: [
      { kind: "video", title: "Brandon Sanderson Lectures", by: "YouTube", note: "Free university-level craft", url: "https://youtube.com/@BrandSanderson" },
      { kind: "video", title: "Abbie Emmons", by: "YouTube", note: "Story structure, made simple", url: "https://youtube.com/@AbbieEmmonsWriter" },
    ],
    communities: [
      { kind: "community", title: "r/writing", by: "Reddit", note: "Craft talk & accountability", url: "https://reddit.com/r/writing" },
      { kind: "community", title: "r/writingprompts", by: "Reddit", note: "A spark whenever you're stuck", url: "https://reddit.com/r/writingprompts" },
    ],
  },
};

// Fallback for hobbies without curated resources yet (e.g. the "new" hobbies).
function genericResources(label: string): HobbyResources {
  const q = encodeURIComponent(`${label} for beginners`);
  return {
    books: [
      { kind: "book", title: `The Beginner's Guide to ${label}`, by: "Start here", note: "Search your library or local bookshop" },
    ],
    videos: [
      { kind: "video", title: `${label} for beginners`, by: "YouTube", note: "Free starter playlists", url: `https://youtube.com/results?search_query=${q}` },
    ],
    communities: [
      { kind: "community", title: `r/${label.toLowerCase()}`, by: "Reddit", note: "Find your people", url: `https://reddit.com/search?q=${q}` },
    ],
  };
}

export function getResources(hobbyId: string, hobbyLabel: string): HobbyResources {
  return RESOURCES[hobbyId] ?? genericResources(hobbyLabel);
}
