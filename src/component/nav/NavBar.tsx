import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import './NavBar.css';
import { Link } from 'react-router-dom';


// const navigate = useNavigate();

const NavigationBar = () => {
  return (
      <nav className="main-nav">
        <Link to="/my-record">내 기록 보기</Link>
        <Link to="/ranking">Ai 승률 랭킹</Link>
        <Link to="/info">게임 소개</Link>
        <Link to="/my-ai">내 AI 관리</Link>
      </nav>
  );
};

export default NavigationBar;
