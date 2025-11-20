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

    const formatDate = (date: Date) => {
        const d = new Date(date);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    };

    const renderGameTable = (gameRecords: IGameDetail[], gameType: string) => {
        if (gameRecords.length === 0) {
            return null;
        }

        return (
            <div className="game-section">
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
                            const index = record.playerId
                            const isWin = record.isWin;
                            return (
                                <tr key={record.id} className={isWin ? 'win-row' : 'lose-row'}>
                                    <td>{record.aiName || '이름'}</td>
                                    <td>{record.gameType}</td>
                                    {/*<td>{formatDate(record.createAt)}</td>*/}
                                    <td>{formatDate(new Date("2025-03-04"))}</td>
                                    <td>{record.responseTimeMs}ms</td>
                                    <td>{record.turnCount}</td>
                                    <td>{isWin ? '승리' : '패배'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <Layout>
            <div className="record-detail-container">
                <h1 className="detail-page-title">나의 대전기록 상세</h1>
                {renderGameTable(ticTacToeGameRecords, 'TicTacToe')}
                {renderGameTable(omokGameRecords, 'Omok')}
                {renderGameTable(chessGameRecords, 'Chess')}
                {renderGameTable(othelloGameRecords, 'Othello')}
            </div>
        </Layout>
    );
};

export default MyRecordDetail;