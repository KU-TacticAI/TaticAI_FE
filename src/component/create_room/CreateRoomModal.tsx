import React, { useState } from 'react';
import './CreateRoomModal.css';

interface CreateRoomModalProps {
    gameName: string;
    onClose: () => void;
    onCreate: (roomDetails: any) => void; // TODO: Define a proper interface for roomDetails
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ gameName, onClose, onCreate }) => {
    const [roomName, setRoomName] = useState('');
    const [selectedGameType, setSelectedGameType] = useState(gameName);
    const [maxPlayers, setMaxPlayers] = useState(2);
    const [isPrivate, setIsPrivate] = useState(false);

    const handleCreate = () => {
        const roomDetails = {
            roomName,
            gameType: selectedGameType,
            maxPlayers,
            isPrivate,
        };
        onCreate(roomDetails);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create New Game Room</h2>
                <div className="form-group">
                    <label>Room Name:</label>
                    <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Game Type:</label>
                    <select value={selectedGameType} onChange={(e) => setSelectedGameType(e.target.value)}>
                        {/* TODO: Dynamically load game types */}
                        <option value="chess">Chess</option>
                        <option value="othello">Othello</option>
                        <option value="tictactoe">TicTacToe</option>
                        <option value="baduk">Baduk</option>
                    </select>
                </div>
                {/*<div className="form-group">*/}
                {/*    <label>Max Players:</label>*/}
                {/*    <input type="number" value={maxPlayers} onChange={(e) => setMaxPlayers(parseInt(e.target.value))} min="2" max="2" />*/}
                {/*</div>*/}
                {/*<div className="form-group checkbox-group">*/}
                {/*    <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} id="isPrivate" />*/}
                {/*    <label htmlFor="isPrivate">Private Room</label>*/}
                {/*</div>*/}
                <div className="modal-actions">
                    <button onClick={handleCreate}>Create</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default CreateRoomModal;
