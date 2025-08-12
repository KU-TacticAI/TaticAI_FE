import React from 'react';
import './NavBar.css';

const NavigationBar = () => {
  return (
      <nav>
        <a href="/">내 기록 보기</a> |
        <a href="/">Ai 승률 랭킹</a> |
        <a href="/login">로그인</a> |
        <a href="/signup">회원가입</a>
      </nav>
  );
};

export default NavigationBar;
