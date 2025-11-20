import React, { useState, useEffect } from 'react';
import Layout from "../../layout/Layout";
import './MyRecordDetail.css';
import { getGameResultDetail } from '../../../api/Api'

interface IGameInfo {
    id: number;
    playerIds: number[];
    aiIds: number[];
    createAt: Date;
    gameType: string;
    winnerAiId: number;
}

interface IGameDetail {
    id: number;
    playerId: number;
    enemyId: number;
    aiId: number;
    aiName?: string;
    gameType: string;
    winnerAiId: number;
    responseTimeMs: number;
    turnCount: number;
    moveData: string;
    isWin:Boolean;
    createdAt: string;
}

interface ILogOutput {
    id: number;
}

interface IBoardSnapshot {
    id: number;
}

interface IGameRecordDto {
    // gameInfo: IGameInfo;
    gameDetails: IGameDetail;
}

const MyRecordDetail = () => {
    const [ticTacToeGameRecords, setGameRecords] = useState<IGameDetail[]>([]);
    const [omokGameRecords, setOmokGameRecords] = useState<IGameDetail[]>([]);
    const [chessGameRecords, setChessGameRecords] = useState<IGameDetail[]>([]);
    const [othelloGameRecords, setOthelloGameRecords] = useState<IGameDetail[]>([]);

    useEffect(() => {
        const initData = async () => {
            const response = await getGameResultDetail();
            setGameRecords(response.data.filter((data: IGameDetail) => data.gameType == 'GameType.TICTACTOE'));
            setOmokGameRecords(response.data.filter((data: IGameDetail) => data.gameType == 'GameType.OMOK'));
            setChessGameRecords(response.data.filter((data: IGameDetail) => data.gameType == 'GameType.CHESS'));
            setOthelloGameRecords(response.data.filter((data: IGameDetail) => data.gameType == 'GameType.OTHELLO'));
        }

        initData();
    }, []);

    const formatDate = (date: string | Date) => {
        const d = new Date(date);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    };

    const formatGameType = (type: string) => {
        switch (type) {
            case 'GameType.TICTACTOE':
                return '틱택토'; // 또는 'Tic-Tac-Toe'
            case 'GameType.OMOK':
                return '오목';       // 또는 'Omok'
            case 'GameType.CHESS':
                return '체스';      // 또는 'Chess'
            case 'GameType.OTHELLO':
                return '오셀로';   // 또는 'Othello'
            default:
                return type.replace('GameType.', ''); // 그 외의 경우 접두사만 제거
        }
    };

    const renderGameTable = (gameRecords: IGameDetail[], gameType: string) => {
        if (gameRecords.length === 0) {
            return null;
        }

        return (
            <div className="game-section">
                {/* 섹션 제목은 이미 파라미터로 예쁘게 들어오므로 그대로 둠 */}
                <h2 className="game-section-title">{gameType}</h2>
                <table className="game-table">
                    <thead>
                    <tr>
                        <th>AI 이름</th>
                        <th>게임 타입</th>
                        <th>날짜</th>
                        <th>평균 응답시간</th>
                        <th>턴수</th>
                        <th>승패 여부</th>
                    </tr>
                    </thead>
                    <tbody>
                    {gameRecords.map((record) => {
                        // 무승부 판단 로직 (winnerAiId가 없거나 0이면 무승부)
                        // 주의: 백엔드 데이터가 -1 등을 쓴다면 조건 수정 필요
                        const isDraw = !record.winnerAiId || record.winnerAiId === 0;

                        let resultText = '패배';
                        let rowClass = 'lose-row';

                        if (record.isWin) {
                            resultText = '승리';
                            rowClass = 'win-row';
                        } else if (isDraw) {
                            resultText = '무승부';
                            rowClass = 'draw-row'; // CSS 추가 필요
                        }

                        return (
                            <tr key={record.id} className={rowClass}>
                                <td>{record.aiName || '이름'}</td>

                                {/* 여기를 수정했습니다: 게임 타입 변환 */}
                                <td>{formatGameType(record.gameType)}</td>

                                <td>{formatDate(record.createdAt)}</td>
                                <td>{record.responseTimeMs}ms</td>
                                <td>{record.turnCount}</td>
                                <td>{resultText}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    };
};
export default MyRecordDetail;