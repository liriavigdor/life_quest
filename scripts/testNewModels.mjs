import fs from 'fs';
const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);
const key = match[1].trim();

const models = [
  'gemini-3.8-flash',
  'gemini-3.8-flash-lite',
  'gemini-3.5-flash-lite'
];

for (const m of models) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'שלום' }] }] })
    });
    console.log(m, 'Status:', res.status);
    if (res.status === 200) {
      console.log('-> AVAILABLE!');
    } else {
      const err = await res.json();
      console.log('->', err?.error?.message || err?.error?.status);
    }
  } catch (e) {
    console.log(m, 'Error:', e.message);
  }
}

