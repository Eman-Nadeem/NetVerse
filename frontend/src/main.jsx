import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.jsx'
import { useThemeStore } from './store/themeStore.js'

const Root = () => {
  const initializeTheme = useThemeStore((state)=>state.initializeTheme);

  useEffect(()=>{
    initializeTheme();
  }, [initializeTheme]);

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
      <Toaster position="top-right" richColors theme="system" />
    </BrowserRouter>
  </StrictMode>
)
