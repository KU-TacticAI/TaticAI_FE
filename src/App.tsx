import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './store/slices/authSlice';
import SignIn from './component/signin/SiginIn';
import Main from './component/main/Main';
import Login from './component/login/Login';
import Ranking from './ranking/page/Ranking';
import MyPage from "./component/my_page/MyPage";
import Game from "./component/game/Game";
import {getUser} from "./api/Api";
import GamePage from "./component/game/page/GamePage"
import Lobby from "./component/lobby/Lobby";
import WaitingRoom from "./pages/waiting_room/WaitingRoom";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('Authorization');

    const restoreLogin = async () => {
      if (token) {
        try {
          const response = await getUser();
          const userData = response.data;

          dispatch(login({
            token: token,
            user: {
              nickname: userData.nickname,
              profileLink: userData.profileLink ?? null,
            },
          }));
        } catch (error) {
          console.error('Failed to restore login session:', error);
        }
      }
    };

    restoreLogin();

  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/lobby/:gameName" element={<Lobby />} />
        <Route path="/waiting-room/:roomId" element={<WaitingRoom />} />
      </Routes>
    </Router>
  );
};

export default App;
