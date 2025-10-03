import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, logout } from './store/slices/authSlice';
import SignIn from './component/signin/SiginIn';
import Main from './component/main/Main';
import Login from './component/login/Login';
import Ranking from './ranking/page/Ranking';
import MyPage from "./component/my_page/MyPage";
import MyRecord from "./component/my-record/MyRecord";
import Info from "./component/info/Info";
import Game from "./component/game/Game";
import {getUser} from "./api/Api";
import GamePage from "./component/game/page/GamePage"
import Lobby from "./component/lobby/Lobby";
import WaitingRoom from "./pages/waiting_room/WaitingRoom";
import AiModelList from "./component/my-ai/list/AiModelList";
import AiModelDetail from "./component/my-ai/detail/AiModelDetail";
import AiModelUpload from "./component/my-ai/upload/AiModelUpload";
import MyRecordDetail from "./component/my-record/detail/MyRecordDetail";

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
              userId: userData.id,
              nickname: userData.nickname,
              profileLink: userData.profileLink ?? null,
            },
          }));
        } catch (error) {
          console.error('Failed to restore login session:', error);
          localStorage.removeItem('Authorization');
          dispatch(logout());
        }
      }
    };

    restoreLogin();

  }, [dispatch]);

  return (
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/my-record" element={<MyRecord />} />
        <Route path="/my-record/detail" element={<MyRecordDetail />} />
        <Route path="/info" element={<Info />} />
        <Route path="/lobby/:gameName" element={<Lobby />} />
        <Route path="/waiting-room/:id" element={<WaitingRoom />} />
        <Route path="/my-ai" element={<AiModelList />} />
        <Route path="/my-ai/:id" element={<AiModelDetail />} />
        <Route path="/my-ai/upload" element={<AiModelUpload />} />
        <Route path="/my-ai/edit/:id" element={<AiModelUpload />} />
      </Routes>
  );
};

export default App;
