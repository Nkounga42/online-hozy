import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './index.css'
import App from './App.tsx'
import { UserProvider } from './services/userService.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </UserProvider>
  </StrictMode>,
)


