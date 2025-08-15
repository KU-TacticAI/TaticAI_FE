import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './store/slices/authSlice';
import SignIn from './component/signin/SiginIn';
import Main from './component/main/Main';
import Login from './component/login/Login';
import Ranking from './ranking/page/Ranking';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    if (token) {
      dispatch(loginSuccess(token));
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </Router>
  );
};

export default App;
