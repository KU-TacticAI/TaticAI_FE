import React, { useState, useEffect } from 'react';
import Layout from "../../layout/Layout";
import './MyRecordDetail.css';
import { getGameResultDetail, getAiListApi } from '../../../api/Api'

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

interface IAiInfo {
    aiId: number;
    name: string;
}

const MyRecordDetail = () => {
    const [ticTacToeGameRecords, setGameRecords] = useState<IGameDetail[]>([]);
    const [omokGameRecords, setOmokGameRecords] = useState<IGameDetail[]>([]);
    const [chessGameRecords, setChessGameRecords] = useState<IGameDetail[]>([]);
    const [othelloGameRecords, setOthelloGameRecords] = useState<IGameDetail[]>([]);

    useEffect(() => {
        const initData = async () => {
            try {
                // 1. AI 목록 먼저 가져오기
                const aiResponse = await getAiListApi();
                const aiList: IAiInfo[] = aiResponse.data;

                // AI ID를 키로, AI 이름을 값으로 하는 맵 생성
                const aiMap = new Map<number, string>();
                aiList.forEach((ai: IAiInfo) => {
                    aiMap.set(ai.aiId, ai.name);
                });

                // 2. 게임 결과 가져오기
                const gameResponse = await getGameResultDetail();

                // 3. 게임 결과에 AI 이름 추가
                const enrichedData = gameResponse.data.map((record: IGameDetail) => ({
                    ...record,
                    aiName: aiMap.get(record.aiId) || `AI #${record.aiId}`
                }));

                // 4. 게임 타입별로 분류
                setGameRecords(enrichedData.filter((data: IGameDetail) => data.gameType === 'GameType.TICTACTOE'));
                setOmokGameRecords(enrichedData.filter((data: IGameDetail) => data.gameType === 'GameType.OMOK'));
                setChessGameRecords(enrichedData.filter((data: IGameDetail) => data.gameType === 'GameType.CHESS'));
                setOthelloGameRecords(enrichedData.filter((data: IGameDetail) => data.gameType === 'GameType.OTHELLO'));
            } catch (error) {
                console.error('Failed to fetch game records:', error);
            }
        }

        initData();
    }, []);

    const formatDate = (date: string | Date) => {
        const d = new Date(date);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    };

    const formatGameType = (type: string) => {
        switch (type) {
            case 'GameType.TICTACTOE': return '틱택토'; // 또는 'Tic-Tac-Toe'
            case 'GameType.OMOK': return '오목';       // 또는 'Omok'
            case 'GameType.CHESS': return '체스';      // 또는 'Chess'
            case 'GameType.OTHELLO': return '오셀로';   // 또는 'Othello'
            default: return type.replace('GameType.', ''); // 그 외의 경우 접두사만 제거
        }
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
                        // 무승부 판단 로직 (winnerAiId가 없거나 0이면 무승부)
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