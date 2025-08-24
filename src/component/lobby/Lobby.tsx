import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {createGameRoom, getGameRoomsApi} from '../../api/Api';
import { GameRoom } from '../game/GameTypes';
import './Lobby.css';
import Layout from '../layout/Layout';
import CreateRoomModal from '../create_room/CreateRoomModal';
import {useNavigate} from 'react-router-dom';

const Lobby: React.FC = () => {
    const { gameName } = useParams<{ gameName: string }>();
    const [rooms, setRooms] = useState<GameRoom[]>([]);
    const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGameRooms = async () => {
            if (gameName) {
                try {
                    // 일단 "all"일 경우 chess로 하드코딩
                    const actualGameName = gameName === 'all' ? 'all' : gameName;
                    const response = await getGameRoomsApi(actualGameName);
                    setRooms(response.data);
                } catch (error) {
                    console.error('Failed to fetch game rooms:', error);
                }
            }
        };

        fetchGameRooms();
    }, [gameName]);

    const handleCreateRoom = async (roomDetails: any) => {
        console.log('Creating room:', roomDetails);
        // TODO: Implement actual API call to create room
        const response = await createGameRoom(roomDetails);
        setShowCreateRoomModal(false);
        navigate('/wating-room/' + response.data.roomId);
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
                                    <Link to={`/waiting-room/${room.roomId}`}>
                                        <button disabled={room.playerCount >= room.maxPlayers}>
                                            {room.playerCount >= room.maxPlayers ? 'Full' : 'Join'}
                                        </button>
                                    </Link>
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
