import fs from 'fs';
import { RAW_USER_TEXT } from './parse_user_500_list.mjs';

const currentArsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));
console.log('Current repository count:', currentArsenal.length);

// Parse the 500 items
const lines = RAW_USER_TEXT.split('\n');
const parsed500 = [];
let currentCategory = 'כללי';

for (let line of lines) {
  line = line.trim();
  if (!line) continue;

  // Check section header
  if (line.startsWith('🎬') || line.startsWith('🏢') || line.startsWith('🎨') || line.startsWith('🧠') || line.startsWith('🚗') || line.startsWith('🌿') || line.startsWith('⚽') || line.startsWith('🛠️') || line.startsWith('🗂️') || line.startsWith('🖼️') || line.startsWith('🏜️') || line.startsWith('🔱') || line.startsWith('🧪') || line.startsWith('⚠️')) {
    currentCategory = line;
    continue;
  }

  // Check numbered item: "1. מיקי מאוס (או הצללית שלו)" or "1. דארת' ויידר: הקסדה..."
  const match = line.match(/^(\d+)\.\s*(.+)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    const fullText = match[2].trim();

    let name = fullText;
    let desc = '';

    if (fullText.includes(':')) {
      const parts = fullText.split(':');
      name = parts[0].trim();
      desc = parts.slice(1).join(':').trim();
    } else if (fullText.includes('(')) {
      const idx = fullText.indexOf('(');
      name = fullText.substring(0, idx).trim();
      desc = fullText.substring(idx).trim();
    }

    parsed500.push({
      num,
      name,
      fullText,
      desc,
      category: currentCategory
    });
  }
}

console.log('Total parsed items from user input:', parsed500.length);

fs.writeFileSync('scripts/parsed_user_500.json', JSON.stringify(parsed500, null, 2), 'utf8');
console.log('Saved scripts/parsed_user_500.json');
