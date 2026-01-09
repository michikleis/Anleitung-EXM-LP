// Setup instructions:
// 1. Create a function named 'trigger-webhook' in Supabase Dashboard.
// 2. Paste this code.
// 3. Deploy/Save.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Get the request body
        const { event_name, payload } = await req.json()

        if (!event_name) {
            throw new Error('Missing event_name')
        }

        // 2. Initialize Supabase Client with Service Role Key (Admin rights)
        // This allows us to read the table even if we lock it down for public.
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        const supabase = createClient(supabaseUrl, supabaseKey)

        // 3. Fetch the secure URL from the database
        const { data, error } = await supabase
            .from('webhook_configs')
            .select('url')
            .eq('event_name', event_name)
            .single()

        if (error || !data) {
            console.error('Config Error:', error)
            throw new Error(`No configuration found for event: ${event_name}`)
        }

        const targetUrl = data.url
        console.log(`Forwarding ${event_name} to secure target...`)

        // 4. Send the payload to Make.com (Server-to-Server)
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw new Error(`Webhook target responded with ${response.status}`)
        }

        // 5. Respond to the Frontend (Success)
        return new Response(
            JSON.stringify({ success: true, message: 'Data secured and sent.' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
