import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard'; 
import Journal from './pages/Journal'; 
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import Landing from "./pages/Landing"
import Mood from './pages/Mood';
import Breathing from './pages/Breathing';
import Meditation from './pages/Meditation'
import SleepLog from './pages/SleepLog';

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
<Route path="/mood" element={<Layout> <Mood/></Layout> } />
<Route path="meditation" element={<Layout> <Meditation/></Layout> } />

<Route path="/breathing" element={<Layout><Breathing/></Layout> } />
<Route path="/sleep" element={<Layout><SleepLog/></Layout> } />
               
                
               

                {/* <Route path="/assessment" element={<Placeholder title="Self-Assessment" />} />
                <Route path="/resources" element={<Placeholder title="Resources" />} />
                <Route path="/insights" element={<Placeholder title="Insights & Reports" />} />  */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;