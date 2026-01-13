import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useWebhook = (eventName: string) => {
    // We don't need to fetch URL anymore, we just trigger the function

    const trigger = useCallback(async (payload: any) => {
        try {
            const { data, error } = await supabase.functions.invoke('trigger-webhook', {
                body: {
                    event_name: eventName,
                    payload: payload
                }
            });

            if (error) {
                // Error handled silently or minimal logging
                return false;
            }

            return true;

        } catch (err) {
            console.error('Unexpected error triggering webhook:', err);
            return false;
        }
    }, [eventName]);

    // isReady is logically always true now since we don't wait for a fetch, 
    // but we allow the component to render immediately.
    return { trigger, isReady: true };
};
