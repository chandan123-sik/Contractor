import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import './App.css'

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </>
  )
}

export default App
