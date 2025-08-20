import Game from "../Game";
import { useEffect, useState } from "react";
import { getGameLobbyApi } from "../../../api/Api";
import Layout from "../../layout/Layout";

interface GameProps {
  gameType: string;
  sessionId: string;
  player_names: string[];
}

const GamePage = () => {
  const [gameProbs, setGameProbs] = useState<GameProps | null>(null);

  useEffect(() => {
    const fetchGameLobby = async () => {
      try {
        const roomId = '1';

        const response = await getGameLobbyApi(roomId);

        // setGameProbs에 객체 형태로 데이터를 저장
        setGameProbs({
          gameType: response.data.gameType,
          sessionId: response.data.sessionId,
          player_names: response.data.player_names,
        });

      } catch (error) {
        console.error("Failed to fetch game lobby data:", error);
      }
    };

    fetchGameLobby();
  }, []);

  if (!gameProbs) {
    return <div>게임 데이터를 불러오는 중...</div>;
  }

  return (
      <Layout>
          <Game
              gameType={gameProbs.gameType}
              sessionId={gameProbs.sessionId}
              player_names={gameProbs.player_names}
              player={gameProbs.player_ids && gameProbs.player_ids[0]}
          />
      </Layout>
  );
};

export default GamePage;
