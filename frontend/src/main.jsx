import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
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
    <Root />
  </StrictMode>,
)
