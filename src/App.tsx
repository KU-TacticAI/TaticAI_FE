import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './component/signin/SiginIn'
import Main from './component/main/Main'; // 홈 컴포넌트 (또는 App 내 기본 페이지)
import Login from './component/login/Login';

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<SignIn />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
  );
};

export default App;
