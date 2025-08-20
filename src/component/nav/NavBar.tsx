import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';

// const navigate = useNavigate();

const NavigationBar = () => {

  return (
      <nav className="main-nav">
        <a href="/">내 기록 보기</a>
        <a href="/ranking">Ai 승률 랭킹</a>
        <a href="#">게임 소개</a>
        <a href="#">내 AI 관리</a>
      </nav>
  );
};

export default NavigationBar;
