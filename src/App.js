import './App.css';
import {Route, Routes, useNavigate} from 'react-router-dom'
import { Login } from './components/Login';
import { Home } from './container/Home';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_KEY}>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/*' element={<Home/>}/>
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
