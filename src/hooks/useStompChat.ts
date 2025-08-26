import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { GameRoomDetail } from '../component/game/GameTypes';

export interface ChatMessage {
  user: string;
  message: string;
}

interface UseStompChatOptions {
  roomId: string;
  endpoint?: string;
}

export function useStompChat({ roomId, endpoint = 'http://localhost:8080/ws' }: UseStompChatOptions) {
  const stompRef = useRef<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roomState, setRoomState] = useState<GameRoomDetail | null>(null);
  const [connected, setConnected] = useState(false);

  const safePublish = useCallback((destination: string, body: any) => {
    const client = stompRef.current;
    if (!client || !client.connected) return;
    client.publish({ destination, body: JSON.stringify(body) });
  }, []);

  const sendChat = useCallback((user: string, text: string) => {
    if (!text.trim()) return;
    safePublish(`/app/chat.room.${roomId}.send`, {
      type: 'chatMessage',
      roomId: roomId,
      user,
      message: text.trim(),
    });
  }, [roomId, safePublish]);

  const sendReady = useCallback((userId: string) => {
    safePublish(`/app/game.room.${roomId}.ready`, {
      type: 'ready',
      roomId: roomId,
      userId,
    });
  }, [roomId, safePublish]);

  const sendLeave = useCallback((userId: string) => {
    safePublish(`/app/game.room.${roomId}.leave`, {
      type: 'leave',
      roomId: roomId,
      userId,
    });
  }, [roomId, safePublish]);

  const startGame = useCallback(() => {
    safePublish(`/app/game.room.${roomId}.start`, null);
  }, [roomId, safePublish]);

  const selectAi = useCallback((aiId: number) => {
    safePublish(`/app/game.room.${roomId}.selectAi`, {
      type: 'selectAi',
      roomId: roomId,
      aiId,
    });
  }, [roomId, safePublish]);

  useEffect(() => {
    if (!roomId) return;

    const accessToken = localStorage.getItem('Authorization') ?? '';

    const client = new Client({
      webSocketFactory: () => new SockJS(endpoint),
      connectHeaders: { Authorization: accessToken ? `Bearer ${accessToken}` : '' },
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {},
    });

    client.onConnect = () => {
      setConnected(true);

      client.subscribe(`/topic/chat.room.${roomId}`, (msg: IMessage) => {
        try {
          const body = JSON.parse(msg.body);
          setMessages((prev) => [...prev, body]);
        } catch (e) {
          console.error('Invalid chat payload:', e, msg.body);
        }
      });

      client.subscribe(`/topic/game.room.${roomId}.state`, (msg: IMessage) => {
        try {
          const body = JSON.parse(msg.body);
          setRoomState(body);
        } catch (e) {
          console.error('Invalid room state payload:', e, msg.body);
        }
      });

      client.publish({
        destination: `/app/chat.room.${roomId}.join`,
        body: JSON.stringify({ type: 'joinRoom', roomId: roomId }),
      });

      console.log('STOMP connected!');
    };

    client.onWebSocketClose = () => setConnected(false);
    client.onDisconnect = () => setConnected(false);
    client.onWebSocketError = (e) => console.error('WebSocket error:', e);
    client.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers?.message, frame.body);
      if (frame.headers?.message === '401 Unauthorized') {
        alert('로그인하세요');
      }
    };

    stompRef.current = client;
    client.activate();

    return () => {
      setConnected(false);
      try {
        if (stompRef.current?.active) stompRef.current.deactivate();
      } finally {
        stompRef.current = null;
      }
    };
  }, [roomId, endpoint, selectAi]);

  return {
    connected,
    messages,
    roomState,
    sendChat,
    sendReady,
    sendLeave,
    startGame,
    selectAi,
  };
}