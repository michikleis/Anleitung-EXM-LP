import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThankYouPage } from '../../components/ThankYouPage';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

// Extract user data from URL params
const params = new URLSearchParams(window.location.search);
const userData = {
    email: params.get('email') || '',
    firstName: params.get('firstName') || ''
};

// Only pass userData if we actually have it
const props = (userData.email && userData.firstName) ? { userData } : {};

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <ThankYouPage {...props} />
    </React.StrictMode>
);
