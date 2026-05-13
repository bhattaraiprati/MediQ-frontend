
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes'
import { useAuthStore } from './store/authStore';


function App() {

  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [])

  return (
    <>
      
        <AppRoutes />

    </>
  );
}

export default App
