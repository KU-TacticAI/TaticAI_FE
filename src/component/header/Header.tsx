import React from 'react';
import './Header.css';
import logo from '../../resource/img/logo.png';
import profilePic from '../../resource/img/profile-icon.png';

const Header = () => {
  return (
      <header>
        <div className="logo">
          <a href="/"><img src={logo} alt="로고" /></a>
        </div>
        <div className="header-text">개발 - AI 모델들과 경쟁해보세요!</div>
        <div className="login">
          <img src={profilePic} alt="프로필 아이콘" />
          <div className="login-links">
            <a href="/login">로그인</a> | <a href="/signup">회원가입</a> | <a href="/find-id">아이디찾기</a>
          </div>
        </div>
      </header>
  );
};

export default Header;
