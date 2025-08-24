import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getGameRoomDetailApi } from '../../api/Api';
import { GameRoomDetail, Player } from '../game/GameTypes';
import './WaitingRoom.css';
import Layout from '../layout/Layout';
import { io, Socket } from 'socket.io-client';
import { Box, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

interface ChatMessage {
    user: string;
    message: string;
}

const WaitingRoom: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const [room, setRoom] = useState<GameRoomDetail | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            if (roomId) {
                try {
                    const response = await getGameRoomDetailApi(roomId);
                    setRoom(response.data);
                    setPlayers(response.data.players);
                } catch (error) {
                    console.error('Failed to fetch room details:', error);
                }
            }
        };

        fetchRoomDetails();

        // Initialize WebSocket connection
        // IMPORTANT: Replace with your actual WebSocket server URL
        const jwtToken = localStorage.getItem('Authorization');
        const newSocket = io('http://localhost:8080/api/game/ws/chat', {
            extraHeaders: {
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
            newSocket.emit('joinRoom', roomId); // Join the specific room
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        newSocket.on('chatMessage', (message: ChatMessage) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Clean up on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, [roomId]);

    const handleReady = () => {
        // TODO: Implement ready logic
        if (socket) {
            socket.emit('ready', { roomId, userId: 'currentUserId' }); // Replace with actual user ID
        }
    };

    const handleStartGame = () => {
        // TODO: Implement start game logic
        if (socket) {
            socket.emit('startGame', { roomId });
        }
    };

    const handleSelectAi = () => {
        // TODO: Implement AI selection logic
    };

    const handleSendMessage = useCallback(() => {
        if (newMessage.trim() && socket) {
            const message: ChatMessage = { user: 'CurrentUser', message: newMessage }; // Replace with actual user
            socket.emit('chatMessage', { roomId, message });
            setNewMessage('');
        }
    }, [newMessage, socket, roomId]);

    if (!room) {
        return <div>Loading...</div>;
    }

    const renderPlayer = (player: Player | undefined) => {
        if (!player) {
            return <div className="player-section empty">Empty</div>;
        }

        return (
            <div className="player-section">
                <div className="player-info-layout">
                    <img src={player.profileImage} alt={player.nickname} className="profile-image" />
                    <div className="player-details">
                        <h2>{player.nickname}</h2>
                        <p>Rank: {player.ranking}</p>
                        <p>{player.isReady ? 'Ready' : 'Not Ready'}</p>
                    </div>
                </div>
                <div className="ai-info">
                    <h3 className={!player.selectedAi ? 'hidden-ai-info' : ''}>Selected AI: {player.selectedAi?.aiName}</h3>
                    <p className={!player.selectedAi ? 'hidden-ai-info' : ''}>{player.selectedAi?.description}</p>
                    {!player.selectedAi && <p>No AI selected.</p>}
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <Box className="waiting-room-container">
                <Box className="top-sections-wrapper">
                    {renderPlayer(players[0])}
                    {/*{renderPlayer(players[1])}*/}
                    <Box className="game-info-section">
                        <Box className="game-details">
                            <h2>{room.gameType}</h2>
                            <p>{room.roomName}</p>
                            {/* TODO: Add more game info/rules */}
                        </Box>
                        <Button variant="contained" onClick={handleSelectAi}>Select AI</Button>
                        <Box className="buttons">
                            <Button variant="contained" onClick={handleReady}>Ready</Button>
                            <Button variant="contained" onClick={handleStartGame}>Start Game</Button>
                        </Box>
                    </Box>
                </Box>
                <Box className="chat-container-full-width">
                    <List className="chat-messages">
                        {messages.map((msg, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={<strong>{msg.user}:</strong>} secondary={msg.message} />
                            </ListItem>
                        ))}
                    </List>
                    <Box className="chat-input">
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Type a message..."
                        />
                        <Button variant="contained" onClick={handleSendMessage} sx={{ ml: 1 }}>Send</Button>
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
};

export default WaitingRoom;