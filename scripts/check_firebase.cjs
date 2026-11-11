const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  const env = {};
  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  console.log('Firebase configured:', Boolean(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID));
  console.log('Project ID:', env.VITE_FIREBASE_PROJECT_ID);

  if (env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID) {
    // Test fetch from Firestore REST API
    const url = `https://firestore.googleapis.com/v1/projects/${env.VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents/user_mnemonic_images?pageSize=100`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const docs = data.documents || [];
        console.log('Firestore document count in user_mnemonic_images:', docs.length);
        if (docs.length > 0) {
          console.log('Sample recent titles:');
          docs.slice(0, 10).forEach(d => {
            const fields = d.fields || {};
            const title = fields.title?.stringValue || fields.name?.stringValue || 'no title';
            const updatedAt = fields.updatedAt?.integerValue || fields.updatedAt?.doubleValue || 0;
            console.log(`- ${title} (updated: ${new Date(Number(updatedAt)).toISOString()})`);
          });
        }
      })
      .catch(err => {
        console.error('Firestore fetch error:', err.message);
      });
  }
} else {
  console.log('No .env found');
}

