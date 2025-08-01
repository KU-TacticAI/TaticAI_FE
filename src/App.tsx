import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './component/signin/SiginIn';
import Main from './component/main/Main'; // 홈 컴포넌트 (또는 App 내 기본 페이지)

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
      </Router>
  );
};

export default App;
