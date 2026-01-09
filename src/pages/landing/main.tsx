import React from 'react';
import ReactDOM from 'react-dom/client';
import { LandingPage } from '../../components/LandingPage';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const handleOptInSuccess = (data: { firstName: string; email: string }) => {
    // Redirect to thank-you page with params
    const params = new URLSearchParams();
    params.set('email', data.email);
    params.set('firstName', data.firstName);
    // Using generic '/thank-you' for cleaner URL if we set up rewrites, 
    // but for pure static without config, '/thank-you.html' might be safer 
    // until we confirm Netlify config. 
    // However, user asked for URL path separation.
    // Standard Netlify behavior for 'thank-you.html' is available at '/thank-you'.
    window.location.href = `/thank-you?${params.toString()}`;
};

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <LandingPage onOptInSuccess={handleOptInSuccess} />
    </React.StrictMode>
);
