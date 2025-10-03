import React, { useState, useEffect } from 'react';
import Layout from "../../layout/Layout";
import './MyRecordDetail.css';

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
    aiId: number;
    aiName?: string;
    gameinfoId: number;
    responseTimeMs: number;
    boardSnapShot: IBoardSnapshot;
    turnCount: number;
    moveData: string;
    status: 'successs' | 'failed' | 'timeout';
    logOutput: ILogOutput;
}

// TODO: playerIds, aiIds, log_output, board_snapshot 이 ERD 에서 json 타입으로 되어있는데, 정확한 DTO 구조 체크후 작성필요
interface ILogOutput {
    id: number;
}

interface IBoardSnapshot {
    id: number;
}

interface IGameRecordDto {
    gameInfo: IGameInfo;
    gameDetails: IGameDetail;
}

const MyRecordDetail = () => {
    // TicTacToe 목업 데이터
    const ticTacToeMockData: IGameRecordDto[] = [
        {
            gameInfo: {
                id: 1,
                playerIds: [1, 2],
                aiIds: [1, 2],
                createAt: new Date('2025-09-15'),
                gameType: 'TicTacToe',
                winnerAiId: 1
            },
            gameDetails: {
                id: 1,
                aiId: 1,
                aiName: 'MyTicTacToeAI_v1',
                gameinfoId: 1,
                responseTimeMs: 150,
                boardSnapShot: { id: 1 },
                turnCount: 9,
                moveData: 'X-O-X-O-X-O-X-O-X',
                status: 'successs',
                logOutput: { id: 1 }
            }
        },
        {
            gameInfo: {
                id: 2,
                playerIds: [1, 3],
                aiIds: [1, 3],
                createAt: new Date('2025-09-20'),
                gameType: 'TicTacToe',
                winnerAiId: 3
            },
            gameDetails: {
                id: 2,
                aiId: 1,
                aiName: 'MyTicTacToeAI_v2',
                gameinfoId: 2,
                responseTimeMs: 200,
                boardSnapShot: { id: 2 },
                turnCount: 7,
                moveData: 'X-O-X-O-X-O-X',
                status: 'successs',
                logOutput: { id: 2 }
            }
        },
        {
            gameInfo: {
                id: 3,
                playerIds: [1, 4],
                aiIds: [1, 4],
                createAt: new Date('2025-09-25'),
                gameType: 'TicTacToe',
                winnerAiId: 1
            },
            gameDetails: {
                id: 3,
                aiId: 1,
                aiName: 'MyTicTacToeAI_v1',
                gameinfoId: 3,
                responseTimeMs: 180,
                boardSnapShot: { id: 3 },
                turnCount: 8,
                moveData: 'X-O-X-O-X-O-X-O',
                status: 'successs',
                logOutput: { id: 3 }
            }
        },
        {
            gameInfo: {
                id: 4,
                playerIds: [1, 5],
                aiIds: [1, 5],
                createAt: new Date('2025-10-01'),
                gameType: 'TicTacToe',
                winnerAiId: 1
            },
            gameDetails: {
                id: 4,
                aiId: 1,
                aiName: 'MyTicTacToeAI_v3',
                gameinfoId: 4,
                responseTimeMs: 120,
                boardSnapShot: { id: 4 },
                turnCount: 6,
                moveData: 'X-O-X-O-X-O',
                status: 'successs',
                logOutput: { id: 4 }
            }
        }
    ];

    // Omok 목업 데이터
    const omokMockData: IGameRecordDto[] = [
        {
            gameInfo: {
                id: 5,
                playerIds: [1, 2],
                aiIds: [2, 3],
                createAt: new Date('2025-09-10'),
                gameType: 'Omok',
                winnerAiId: 2
            },
            gameDetails: {
                id: 5,
                aiId: 2,
                aiName: 'MyOmokAI_v1',
                gameinfoId: 5,
                responseTimeMs: 300,
                boardSnapShot: { id: 5 },
                turnCount: 25,
                moveData: 'omok-moves',
                status: 'successs',
                logOutput: { id: 5 }
            }
        },
        {
            gameInfo: {
                id: 6,
                playerIds: [1, 3],
                aiIds: [2, 4],
                createAt: new Date('2025-09-18'),
                gameType: 'Omok',
                winnerAiId: 4
            },
            gameDetails: {
                id: 6,
                aiId: 2,
                aiName: 'MyOmokAI_v2',
                gameinfoId: 6,
                responseTimeMs: 250,
                boardSnapShot: { id: 6 },
                turnCount: 30,
                moveData: 'omok-moves',
                status: 'successs',
                logOutput: { id: 6 }
            }
        },
        {
            gameInfo: {
                id: 7,
                playerIds: [1, 4],
                aiIds: [2, 5],
                createAt: new Date('2025-09-22'),
                gameType: 'Omok',
                winnerAiId: 2
            },
            gameDetails: {
                id: 7,
                aiId: 2,
                aiName: 'MyOmokAI_v1',
                gameinfoId: 7,
                responseTimeMs: 280,
                boardSnapShot: { id: 7 },
                turnCount: 28,
                moveData: 'omok-moves',
                status: 'successs',
                logOutput: { id: 7 }
            }
        },
        {
            gameInfo: {
                id: 8,
                playerIds: [1, 5],
                aiIds: [2, 6],
                createAt: new Date('2025-09-28'),
                gameType: 'Omok',
                winnerAiId: 2
            },
            gameDetails: {
                id: 8,
                aiId: 2,
                aiName: 'MyOmokAI_v3',
                gameinfoId: 8,
                responseTimeMs: 220,
                boardSnapShot: { id: 8 },
                turnCount: 22,
                moveData: 'omok-moves',
                status: 'successs',
                logOutput: { id: 8 }
            }
        }
    ];

    // Chess 목업 데이터
    const chessMockData: IGameRecordDto[] = [
        {
            gameInfo: {
                id: 9,
                playerIds: [1, 2],
                aiIds: [3, 4],
                createAt: new Date('2025-09-12'),
                gameType: 'Chess',
                winnerAiId: 3
            },
            gameDetails: {
                id: 9,
                aiId: 3,
                aiName: 'MyChessAI_v1',
                gameinfoId: 9,
                responseTimeMs: 500,
                boardSnapShot: { id: 9 },
                turnCount: 45,
                moveData: 'chess-moves',
                status: 'successs',
                logOutput: { id: 9 }
            }
        },
        {
            gameInfo: {
                id: 10,
                playerIds: [1, 3],
                aiIds: [3, 5],
                createAt: new Date('2025-09-19'),
                gameType: 'Chess',
                winnerAiId: 5
            },
            gameDetails: {
                id: 10,
                aiId: 3,
                aiName: 'MyChessAI_v2',
                gameinfoId: 10,
                responseTimeMs: 480,
                boardSnapShot: { id: 10 },
                turnCount: 52,
                moveData: 'chess-moves',
                status: 'successs',
                logOutput: { id: 10 }
            }
        },
        {
            gameInfo: {
                id: 11,
                playerIds: [1, 4],
                aiIds: [3, 6],
                createAt: new Date('2025-09-26'),
                gameType: 'Chess',
                winnerAiId: 3
            },
            gameDetails: {
                id: 11,
                aiId: 3,
                aiName: 'MyChessAI_v1',
                gameinfoId: 11,
                responseTimeMs: 520,
                boardSnapShot: { id: 11 },
                turnCount: 48,
                moveData: 'chess-moves',
                status: 'successs',
                logOutput: { id: 11 }
            }
        },
        {
            gameInfo: {
                id: 12,
                playerIds: [1, 5],
                aiIds: [3, 7],
                createAt: new Date('2025-10-02'),
                gameType: 'Chess',
                winnerAiId: 3
            },
            gameDetails: {
                id: 12,
                aiId: 3,
                aiName: 'MyChessAI_v3',
                gameinfoId: 12,
                responseTimeMs: 450,
                boardSnapShot: { id: 12 },
                turnCount: 40,
                moveData: 'chess-moves',
                status: 'successs',
                logOutput: { id: 12 }
            }
        }
    ];

    // Othello 목업 데이터
    const othelloMockData: IGameRecordDto[] = [
        {
            gameInfo: {
                id: 13,
                playerIds: [1, 2],
                aiIds: [4, 5],
                createAt: new Date('2025-09-14'),
                gameType: 'Othello',
                winnerAiId: 4
            },
            gameDetails: {
                id: 13,
                aiId: 4,
                aiName: 'MyOthelloAI_v1',
                gameinfoId: 13,
                responseTimeMs: 350,
                boardSnapShot: { id: 13 },
                turnCount: 35,
                moveData: 'othello-moves',
                status: 'successs',
                logOutput: { id: 13 }
            }
        },
        {
            gameInfo: {
                id: 14,
                playerIds: [1, 3],
                aiIds: [4, 6],
                createAt: new Date('2025-09-21'),
                gameType: 'Othello',
                winnerAiId: 6
            },
            gameDetails: {
                id: 14,
                aiId: 4,
                aiName: 'MyOthelloAI_v2',
                gameinfoId: 14,
                responseTimeMs: 320,
                boardSnapShot: { id: 14 },
                turnCount: 38,
                moveData: 'othello-moves',
                status: 'successs',
                logOutput: { id: 14 }
            }
        },
        {
            gameInfo: {
                id: 15,
                playerIds: [1, 4],
                aiIds: [4, 7],
                createAt: new Date('2025-09-27'),
                gameType: 'Othello',
                winnerAiId: 4
            },
            gameDetails: {
                id: 15,
                aiId: 4,
                aiName: 'MyOthelloAI_v1',
                gameinfoId: 15,
                responseTimeMs: 380,
                boardSnapShot: { id: 15 },
                turnCount: 32,
                moveData: 'othello-moves',
                status: 'successs',
                logOutput: { id: 15 }
            }
        },
        {
            gameInfo: {
                id: 16,
                playerIds: [1, 5],
                aiIds: [4, 8],
                createAt: new Date('2025-10-03'),
                gameType: 'Othello',
                winnerAiId: 4
            },
            gameDetails: {
                id: 16,
                aiId: 4,
                aiName: 'MyOthelloAI_v3',
                gameinfoId: 16,
                responseTimeMs: 310,
                boardSnapShot: { id: 16 },
                turnCount: 30,
                moveData: 'othello-moves',
                status: 'successs',
                logOutput: { id: 16 }
            }
        }
    ];

    const [ticTacToeGameRecords, setGameRecords] = useState<IGameRecordDto[]>(ticTacToeMockData);
    const [omokGameRecords, setOmokGameRecords] = useState<IGameRecordDto[]>(omokMockData);
    const [chessGameRecords, setChessGameRecords] = useState<IGameRecordDto[]>(chessMockData);
    const [othelloGameRecords, setOthelloGameRecords] = useState<IGameRecordDto[]>(othelloMockData);

    const formatDate = (date: Date) => {
        const d = new Date(date);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    };

    const renderGameTable = (gameRecords: IGameRecordDto[], gameType: string) => {
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
                            const myGameDetail = record.gameDetails;
                            const isWin = record.gameInfo.winnerAiId === myGameDetail?.aiId;
                            return (
                                <tr key={record.gameInfo.id} className={isWin ? 'win-row' : 'lose-row'}>
                                    <td>{record.gameDetails.aiName || '이름'}</td>
                                    <td>{record.gameInfo.gameType}</td>
                                    <td>{formatDate(record.gameInfo.createAt)}</td>
                                    <td>{record.gameDetails.responseTimeMs}ms</td>
                                    <td>{record.gameDetails.turnCount}</td>
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