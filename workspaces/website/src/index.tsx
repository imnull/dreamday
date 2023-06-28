import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'

const app = document.getElementById('app') || document.createDocumentFragment()
createRoot(app).render(<App />)

if (!app.parentNode) {
    document.body.appendChild(app)
}

