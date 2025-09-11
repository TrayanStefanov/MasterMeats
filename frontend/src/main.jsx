import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18next.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div data-theme="mytheme">
      <App />
    </div>
  </StrictMode>,
)
