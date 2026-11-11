import fs from 'fs';

const data = JSON.parse(fs.readFileSync('public/staged_images/approved_manifest.json', 'utf8'));
console.log('Total items:', data.length);
data.forEach((item, index) => {
  console.log(`\n--- Item #${index + 1} ---`);
  console.log('ID:', item.id);
  console.log('Title:', item.title);
  console.log('Image:', item.imageUrl);
  console.log('Caption:', item.caption);
  console.log('Keywords:', item.keywords);
  console.log('AssociatedTasks:', item.associatedTasks);
});

