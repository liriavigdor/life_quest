import fs from 'node:fs';

// Helper to validate that no branch contains any word from the root
export function validateBranches(rootName, branches) {
  const rootWords = rootName
    .replace(/[()\/\"'’`\-]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 1);

  const invalid = [];
  branches.forEach(b => {
    const cleanB = b.replace('#', '').trim();
    const branchWords = cleanB.split(/\s+/).map(w => w.trim());

    for (const rw of rootWords) {
      for (const bw of branchWords) {
        // Exact match of word, or prefix/suffix stem match for words > 2 chars
        if (bw === rw) {
          invalid.push({ branch: cleanB, matchedRootWord: rw, reason: 'exact word match' });
        } else if (rw.length >= 3 && bw.includes(rw)) {
          invalid.push({ branch: cleanB, matchedRootWord: rw, reason: 'stem contains root' });
        }
      }
    }
  });

  return invalid;
}


