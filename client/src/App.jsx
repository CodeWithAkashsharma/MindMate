import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard'; 
import Journal from './components/Journal'; 
import Login from './components/Login';
import Register from './components/Register';
import History from './pages/History';
import Landing from "./pages/Landing"

const token = localStorage.getItem('token');


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
       <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/dashboard" element={<Layout> <Dashboard /></Layout> } />
<Route path="/journal" element={<Layout><Journal /></Layout>} />
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/history" element={<History />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;