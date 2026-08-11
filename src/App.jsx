import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Claim from './pages/Claim'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Claim />} />
        <Route path="*" element={<Claim />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
