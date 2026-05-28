import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/typography.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
