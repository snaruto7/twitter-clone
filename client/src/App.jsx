import './lib/hexStyles.css'
import Home from "./pages/home.jsx"
import Profile from "./pages/profile.jsx"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TwitterProvider } from './context/TwitterContext'

function App() {
  return (
    <div>
      <BrowserRouter>
        <TwitterProvider>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/profile" element={<Profile/>} />
          </Routes>
        </TwitterProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
