
const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const btn = document.getElementById("btn");


const LOCAL_QUOTES = [
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { content: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { content: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { content: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { content: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  { content: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { content: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
];


const SOURCES = [

  async function fromDummyJson() {
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (!res.ok) throw new Error("DummyJSON request failed");
    const data = await res.json();
    if (!data.quote) throw new Error("DummyJSON returned no quote");
    return { content: data.quote, author: data.author || "Unknown" };
  },


  async function fromAdviceSlip() {
    const res = await fetch("https://api.adviceslip.com/advice");
    if (!res.ok) throw new Error("Advice Slip request failed");
    const data = await res.json();
    if (!data.slip || !data.slip.advice) throw new Error("Advice Slip returned no advice");
    return { content: data.slip.advice, author: "Life Advice" };
  },


  async function fromLocal() {
    const pick = LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)];
    return pick;
  },
];


function withTimeout(promise, ms = 5000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timed out")), ms)),
  ]);
}

async function getQuote() {
  if (btn) btn.disabled = true;
  quoteEl.style.opacity = "0.5";

  for (const source of SOURCES) {
    try {
      const { content, author } = await withTimeout(source());
      quoteEl.innerText = content;
      authorEl.innerText = `— ${author}`;
      quoteEl.style.opacity = "1";
      if (btn) btn.disabled = false;
      return;
    } catch (err) {
      console.warn("Quote source failed, trying next:", err.message);
    }
  }


  quoteEl.innerText = "Every day is a fresh start.";
  authorEl.innerText = "";
  quoteEl.style.opacity = "1";
  if (btn) btn.disabled = false;
}

window.addEventListener("load", getQuote);
if (btn) btn.addEventListener("click", getQuote);


setInterval(getQuote, 20000);

function goBack() {
  window.history.back();
}
