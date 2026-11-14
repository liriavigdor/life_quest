import { findBestUserImagesForTask } from '../src/utils/userImageRepository.js';

console.log('--- Testing findBestUserImagesForTask("פסנתר", 5): ---');
const res = findBestUserImagesForTask('פסנתר', 5);
console.log('Result count:', res.length);
res.forEach((r, idx) => console.log(idx + 1, r.title, '| keywords:', r.keywords, '| matchReason:', r.matchReason));

