import { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { GameRoom } from '../component/game/GameTypes';
import { getGameRoomsApi } from '../api/Api';

interface UseStompLobbyOptions {
  gameName: string;
  endpoint?: string;
}

// export function useStompLobby({ gameName, endpoint = 'http://localhost:8080/ws' }: UseStompLobbyOptions) {
export function useStompLobby({ gameName, endpoint = 'https://ec2-52-79-222-76.ap-northeast-2.compute.amazonaws.com:8080/ws' }: UseStompLobbyOptions) {
  const stompRef = useRef<Client | null>(null);
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const fetchInitialRooms = async () => {
      try {
        const response = await getGameRoomsApi(gameName);
        setRooms(response.data);
      } catch (error) {
        console.error('Failed to fetch initial game rooms:', error);
      }
    };

    fetchInitialRooms();
  }, [gameName]);

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
