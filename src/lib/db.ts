import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';

// Initialize Redis only if variables are present. If not, redis will throw on operation.
let redis: Redis | null = null;
try {
  redis = Redis.fromEnv();
} catch (e) {
  console.warn("Upstash Redis is not configured. Falling back to local files only.");
}

export async function getDbData(key: string, localFilename: string) {
  if (redis) {
    try {
      const data = await redis.get(key);
      if (data) return data;
    } catch (e) {
      console.warn(`Redis get error for ${key}, falling back to local file.`);
    }
  }

  // Fallback to local file
  try {
    const filePath = path.join(process.cwd(), `src/data/${localFilename}`);
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileData || '[]');
    }
  } catch (e) {
    console.warn(`Failed to read local ${localFilename}`, e);
  }
  return [];
}

export async function setDbData(key: string, data: any, localFilename: string) {
  if (redis) {
    try {
      await redis.set(key, data);
    } catch (e) {
      console.warn(`Redis set error for ${key}`, e);
    }
  }

  // Attempt to write locally (will fail on Vercel, but works in dev)
  try {
    const filePath = path.join(process.cwd(), `src/data/${localFilename}`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    // We ignore the read-only error on Vercel since it's expected
    if ((e as any).code !== 'EROFS') {
      console.warn(`Failed to write local ${localFilename}`, e);
    }
  }
}
