import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
const result = config({ path: resolve(process.cwd(), '.env.local') });

console.log('🔍 Environment Debug Info\n');

console.log('Dotenv result:', result.error ? 'ERROR' : 'SUCCESS');
if (result.error) {
  console.log('Dotenv error:', result.error);
}

console.log('\n📋 Environment Variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');

if (process.env.DATABASE_URL) {
  console.log('\n🔗 DATABASE_URL Details:');
  console.log('Full URL:', process.env.DATABASE_URL);
  console.log('Contains supabase.com:', process.env.DATABASE_URL.includes('supabase.com'));
  console.log('Contains localhost:', process.env.DATABASE_URL.includes('localhost'));
}

console.log('\n📁 Current working directory:', process.cwd());
console.log('📄 .env.local path:', resolve(process.cwd(), '.env.local'));