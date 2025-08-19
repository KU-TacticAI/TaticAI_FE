import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('Authorization');
    dispatch(logout());
    window.location.href = '/';
  };

  return (
    <nav>
      <a href="/">내 기록 보기</a> |
      <a href="/ranking">Ai 승률 랭킹</a> |
      {isAuthenticated ? (
        <>
          <button onClick={handleLogout} className="logout-button">로그아웃</button> |
          <a href="/mypage">마이페이지</a>
        </>
      ) : (
        <>
          <a href="/login">로그인</a> |
          <a href="/signup">회원가입</a>
        </>
      )}
    </nav>
  );
};

export default NavigationBar;
