import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './AppRoot';
import '@/styles/variables.css';
import '@/styles/globals.css';
import '@/styles/animations.css';
import '@/styles/hero.css';
import '@/styles/sections.css';
import '@/styles/admin.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);