import React from 'react';
import ReactDOM from 'react-dom/client';
import { SurveyWizard } from '../../components/SurveyWizard';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center pt-4 pb-12 px-4 w-full">
            <SurveyWizard />
        </div>
    </React.StrictMode>
);
