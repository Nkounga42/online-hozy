import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './assets/style/index.css'
import App from './App.tsx'
import authService from './services/authService'
import themeService from './services/themeService'
import { UserProvider } from './services/userService.tsx'

// Initialiser le service d'authentification
authService.setupAxiosInterceptors();

// Initialiser le service de thème (charge automatiquement le thème sauvegardé)
themeService.getCurrentTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </UserProvider>
  </StrictMode>,
)


