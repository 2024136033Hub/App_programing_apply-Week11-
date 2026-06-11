import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import TextInputPage from './pages/TextInputPage'
import WebcamPage from './pages/WebcamPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-page-bg flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/text" element={<TextInputPage />} />
            <Route path="/webcam" element={<WebcamPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
