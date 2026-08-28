const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const btn = document.getElementById("btn");
const imageEl = document.getElementById("afkImage");

// Your original 25 affirmations, kept verbatim (numbering stripped --
// this card format doesn't show numbers, same as the motivation quotes).
const LOCAL_AFFIRMATIONS = [
  "I am enough. I have enough.",
  "I am in the right place, at the right time, doing the right thing.",
  "I can do hard things.",
  "I allow myself to be more fully me.",
  "I believe in myself.",
  "I am grateful for another day of life.",
  "I am worthy of what I desire.",
  "I am resilient in the face of challenges.",
  "I am proud of myself and my achievements.",
  "I will accomplish everything I need to do today.",
  "I do my best, and my best is good enough.",
  "I prioritize my well-being.",
  "I overcome my fears by getting out of my comfort zone.",
  "I am love, and I am loved.",
  "I trust my inner guidance and follow it.",
  "I accept my emotions and let them move through me.",
  "I take care of myself, mind, body, and spirit.",
  "I trust myself to make the right decisions.",
  "I use my voice to speak up for myself and others.",
  "I trust that I'm heading in the right direction.",
  "I allow myself to make mistakes as they help me grow.",
  "I accept myself exactly as I am without judgment.",
  "I have everything I need to achieve my goals.",
  "I am safe and supported.",
  "I love and accept myself.",
  "I am kind to myself and others.",
];

// Calming photo topics -- cycled through so the image varies but always
// stays on-theme (nature / calm / soft light), via Lorem Picsum's seeded
// endpoint (no API key needed, stable and free).
const IMAGE_SEEDS = [
  "allzwell-calm-1", "allzwell-calm-2", "allzwell-calm-3",
  "allzwell-calm-4", "allzwell-calm-5", "allzwell-calm-6",
  "allzwell-calm-7", "allzwell-calm-8",
];

const SOURCES = [
  // Public affirmations API -- https://www.affirmations.dev/
  async function fromAffirmationsApi() {
    const res = await fetch("https://www.affirmations.dev/");
    if (!res.ok) throw new Error("affirmations.dev request failed");
    const data = await res.json();
    if (!data.affirmation) throw new Error("affirmations.dev returned nothing");
    return { content: data.affirmation, tag: "From affirmations.dev" };
  },

  async function fromLocal() {
    const pick = LOCAL_AFFIRMATIONS[Math.floor(Math.random() * LOCAL_AFFIRMATIONS.length)];
    return { content: pick, tag: "Affirmation" };
  },
];

function withTimeout(promise, ms = 5000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timed out")), ms)),
  ]);
}

function nextImage() {
  const seed = IMAGE_SEEDS[Math.floor(Math.random() * IMAGE_SEEDS.length)];
  const next = new Image();
  next.onload = () => {
    imageEl.src = next.src;
    imageEl.classList.add("loaded");
  };
  next.onerror = () => {
    // If the image host is unreachable, just keep whatever was showing.
  };
  next.src = `https://picsum.photos/seed/${seed}/900/500`;
}

async function getAffirmation() {
  if (btn) btn.disabled = true;
  quoteEl.style.opacity = "0.5";

  for (const source of SOURCES) {
    try {
      const { content, tag } = await withTimeout(source());
      quoteEl.innerText = content;
      authorEl.innerText = tag;
      quoteEl.style.opacity = "1";
      if (btn) btn.disabled = false;
      nextImage();
      return;
    } catch (err) {
      console.warn("Affirmation source failed, trying next:", err.message);
    }
  }

  quoteEl.innerText = "You are exactly where you need to be right now.";
  authorEl.innerText = "Affirmation";
  quoteEl.style.opacity = "1";
  if (btn) btn.disabled = false;
  nextImage();
}

window.addEventListener("load", getAffirmation);
if (btn) btn.addEventListener("click", getAffirmation);

function goBack() {
  window.history.back();
}
