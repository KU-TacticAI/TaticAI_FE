import React from 'react';
import './Header.css';
import logo from '../../resource/img/logo.png';
import profilePic from '../../resource/img/profile-icon.png';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { logoutApi } from '../../api/Api';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userProfileLink = useSelector((state: RootState) => state.auth.user?.profileLink);
  const userNickName = useSelector((state: RootState) => state.auth.user?.nickname);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // localStorage.removeItem("Authorization")
      await logoutApi(); // 서버가 refresh 쿠키를 만료(Set-Cookie)
    } catch (_) {
      // 실패해도 클라 정리 계속
    } finally {
      dispatch(logout());
      window.location.href = '/';
    }
  };

  const currentProfileImage = userProfileLink && isAuthenticated ? userProfileLink : profilePic;
  const currentNickName = userNickName && isAuthenticated ? userNickName : "로그인을 해주세요";

  return (
      <header>
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="로고" />
          </Link>
        </div>
        <div className="header-text">개발 - AI 모델들과 경쟁해보세요!</div>
        <div className="login-section">
          <img src={currentProfileImage} alt="프로필 아이콘" className="profile-icon"/>
          <div className="login-links">
            {isAuthenticated ? (
                <>
                  <span className="separator"> {currentNickName} 님 환영합니다.</span>
                  <button onClick={handleLogout} className="auth-link">로그아웃</button>
                  <span className="separator">|</span>
                  <Link to="/mypage">
                    <p>마이페이지</p>
                  </Link>
                </>
            ) : (
                <>
                  <span className="separator"> {currentNickName}</span>
                  <a href="/login" className="auth-link">로그인</a>
                  <span className="separator">|</span>
                  <a href="/signup" className="auth-link">회원가입</a>
                  <span className="separator">|</span>
                  <a href="/find-id" className="auth-link">아이디찾기</a>
                </>
            )}
          </div>
        </div>
      </header>
  );
};

export default Header;
