import { Routes, Route } from 'react-router-dom';
import { ClockView } from './pages/ClockView';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';

function App() {
    return (
        <Routes>
            <Route path="/" element={<ClockView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
        </Routes>
    );
}

export default App;
