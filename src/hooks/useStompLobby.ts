import { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { GameRoom } from '../component/game/GameTypes';

interface UseStompLobbyOptions {
  gameName: string;
  endpoint?: string;
}

export function useStompLobby({ gameName, endpoint = 'http://localhost:8080/ws' }: UseStompLobbyOptions) {
  const stompRef = useRef<Client | null>(null);
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!gameName) return;

    const accessToken = localStorage.getItem('Authorization') ?? '';

    const client = new Client({
      webSocketFactory: () => new SockJS(endpoint),
      connectHeaders: { Authorization: accessToken ? `Bearer ${accessToken}` : '' },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setConnected(true);
      client.subscribe(`/topic/lobby/${gameName}`, (msg: IMessage) => {
        try {
          const body = JSON.parse(msg.body);
          // Assuming the body is the new array of rooms
          setRooms(Array.isArray(body) ? body : []);
        } catch (e) {
          console.error('Invalid lobby payload:', e, msg.body);
        }
      });
    };

    client.onWebSocketError = (error) => {
      console.error('WebSocket error in lobby:', error);
    };

    stompRef.current = client;
    client.activate();

    return () => {
      if (stompRef.current?.active) {
        stompRef.current.deactivate();
      }
    };
  }, [gameName, endpoint]);

  return { rooms, connected };
}
