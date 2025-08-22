import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface ChatMessage {
  user: string;
  message: string;
}

interface UseStompChatOptions {
  roomId: string;
  endpoint?: string; // 기본값: 'http://localhost:8080/ws'
}

export function useStompChat({ roomId, endpoint = 'http://localhost:8080/ws' }: UseStompChatOptions) {
  const stompRef = useRef<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);

  // 안전 publish
  const safePublish = useCallback((destination: string, body: any) => {
    const client = stompRef.current;
    if (!client || !client.connected) return;
    client.publish({ destination, body: JSON.stringify(body) });
  }, []);

  // 채팅 전송
  const sendChat = useCallback((user: string, text: string) => {
    if (!text.trim()) return;
    safePublish(`/app/chat.room.${roomId}.send`, {
      type: 'chatMessage',
      roomId,
      user,
      message: text.trim(),
    });
  }, [roomId, safePublish]);

  // 게임 이벤트
  const sendReady = useCallback((userId: string) => {
    safePublish(`/app/game.room.${roomId}.ready`, {
      type: 'ready',
      roomId,
      userId,
    });
  }, [roomId, safePublish]);

  const startGame = useCallback(() => {
    safePublish(`/app/game.room.${roomId}.startGame`, {
      type: 'startGame',
      roomId,
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

      // 입장 알림
      client.publish({
        destination: `/app/chat.room.${roomId}.join`,
        body: JSON.stringify({ type: 'joinRoom', roomId }),
      });
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
  }, [roomId, endpoint]);

  return {
    connected,
    messages,
    sendChat,
    sendReady,
    startGame,
  };
}
