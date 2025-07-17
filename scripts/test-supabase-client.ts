import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

async function testSupabaseClient() {
    try {
        console.log('🔍 Testing Supabase Client Connection...\n');

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        console.log('Supabase URL:', supabaseUrl ? 'SET' : 'NOT SET');
        console.log('Supabase Key:', supabaseKey ? 'SET' : 'NOT SET');

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase credentials');
        }

        // Create Supabase client
        const supabase = createClient(supabaseUrl, supabaseKey);

        console.log('✅ Supabase client created successfully');

        // Test query using Supabase client
        console.log('🔍 Testing products query via Supabase...');
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .limit(3);

        if (error) {
            console.error('❌ Supabase query error:', error);
            return;
        }

        console.log('✅ Supabase query successful!');
        console.log(`📦 Found ${data?.length || 0} products`);

        if (data && data.length > 0) {
            console.log('\n📋 Sample products:');
            data.forEach((product: any, index: number) => {
                console.log(`${index + 1}. ${product.name} - $${product.price} (Stock: ${product.stock_quantity})`);
            });
        }

    } catch (error) {
        console.error('❌ Supabase client test failed:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
        }
    }
}

testSupabaseClient();