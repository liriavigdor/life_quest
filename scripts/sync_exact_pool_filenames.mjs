import fs from 'node:fs';
import path from 'node:path';
import { STAGED_IMAGES_POOL } from '../src/data/stagedImagesPool.js';

const POOL_DIR = path.resolve('public/staged_images/pool');

// Check all items whose id does not start with item_
for (const item of STAGED_IMAGES_POOL) {
  if (!item.id.startsWith('item_')) {
    console.log(item.id.padEnd(28), '->', path.basename(item.imageUrl));
  }
}

