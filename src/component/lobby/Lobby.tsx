import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createGameRoom, enterGameRoom, getGameRoomsApi } from '../../api/Api';
import { GameRoom } from '../game/GameTypes';
import './Lobby.css';
import Layout from '../layout/Layout';
import CreateRoomModal from '../create_room/CreateRoomModal';
import { useNavigate } from 'react-router-dom';
import { useStompLobby } from '../../hooks/useStompLobby';

const Lobby: React.FC = () => {
    const { gameName = 'all' } = useParams<{ gameName: string }>();
    const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
    const navigate = useNavigate();
    const { rooms } = useStompLobby({ gameName });

    const handleCreateRoom = async (roomDetails: any) => {
        console.log('Creating room:', roomDetails);
        try {
            const response = await createGameRoom(roomDetails);
            setShowCreateRoomModal(false);
            navigate('/waiting-room/' + response.data.roomId);
        } catch (error) {
            console.error('Failed to create room:', error);
        }
    };

    const handleJoinClick = async (id: string) => {
        try {
            await enterGameRoom(id);
            console.log(`Joining room: ${id}`);
            navigate(`/waiting-room/${id}`);
        } catch (error) {
            console.error('Failed to enter room:', error);
        }
    };

    return (
        <Layout>
            <div className="lobby-container">
                <h1>{gameName === 'all' ? 'Overall' : gameName} Game Lobby</h1>
                <button className="create-room-button" onClick={() => setShowCreateRoomModal(true)}>Create Game Room</button>
                <div className="room-list">
                    <div className="room-header">
                        <div className="room-name">Room Name</div>
                        <div className="host-ranking">Host Ranking</div>
                        <div className="player-count">Players</div>
                        <div className="status">Status</div>
                        <div className="action"></div>
                    </div>
                    {rooms.length > 0 ? (
                        rooms.map((room) => (
                            <div className="room" key={room.roomId}>
                                <div className="room-name">{room.roomName}</div>
                                <div className="host-ranking">{room.hostRanking}</div>
                                <div className="player-count">{room.playerCount}/{room.maxPlayers}</div>
                                <div className="status">{room.status}</div>
                                <div className="action">
                                    <button
                                        disabled={room.playerCount >= room.maxPlayers}
                                        onClick={() => handleJoinClick(room.roomId)}
                                    >
                                        {room.playerCount >= room.maxPlayers ? 'Full' : 'Join'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No rooms available.</p>
                    )}
                </div>
            </div>
            {showCreateRoomModal && (
                <CreateRoomModal
                    gameName={gameName === 'all' ? 'chess' : gameName || ''}
                    onClose={() => setShowCreateRoomModal(false)}
                    onCreate={handleCreateRoom}
                />
            )}
        </Layout>
    );
};

export default Lobby;