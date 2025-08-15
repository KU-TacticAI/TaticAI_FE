import React from 'react';
import './Header.css';
import logo from '../../resource/img/logo.png';
import profilePic from '../../resource/img/profile-icon.png';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { logoutApi } from '../../api/Api';

const Header: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutApi(); // 서버가 refresh 쿠키를 만료(Set-Cookie)
    } catch (_) {
      // 실패해도 클라 정리 계속
    } finally {
      localStorage.removeItem('Authorization');
      dispatch(logout());
      window.location.href = '/';
    }
  };

  return (
      <header>
        <div className="logo">
          <a href="/"><img src={logo} alt="로고" /></a>
        </div>
        <div className="header-text">개발 - AI 모델들과 경쟁해보세요!</div>
        <div className="login">
          <img src={profilePic} alt="프로필 아이콘" />
          <div className="login-links">
            {isAuthenticated ? (
                <>
                  <button onClick={handleLogout} className="logout-button">로그아웃</button> |
                  <a href="/mypage">마이페이지</a>
                </>
            ) : (
                <>
                  <a href="/login">로그인</a> |
                  <a href="/signup">회원가입</a> |
                  <a href="/find-id">아이디찾기</a>
                </>
            )}
          </div>
        </div>
      </header>
  );
};

export default Header;
