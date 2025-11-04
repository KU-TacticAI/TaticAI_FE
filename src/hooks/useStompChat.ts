import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { GameRoomDetail } from '../component/game/GameTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export interface ChatMessage {
  user: string;
  message: string;
}

interface UseStompChatOptions {
  roomId: string;
  endpoint?: string;
}

// export function useStompChat({ roomId, endpoint = 'http://localhost:8080/ws' }: UseStompChatOptions) {
export function useStompChat({ roomId, endpoint = 'http://ec2-52-79-222-76.ap-northeast-2.compute.amazonaws.com:8080/ws' }: UseStompChatOptions) {
  const stompRef = useRef<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roomState, setRoomState] = useState<GameRoomDetail | null>(null);
  const [connected, setConnected] = useState(false);

  // 3. useSelector를 사용해 Redux 스토어에서 user 정보 가져오기
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

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

  const sendReady = useCallback(() => {
    if (!user) return;
    safePublish(`/app/game.room.${roomId}.ready`, {
      type: 'ready',
      userId: user.userId,
      roomId: roomId,
    });
  }, [roomId, safePublish]);

  const sendLeave = useCallback(() => {
    if (!user) return;
    safePublish(`/app/game.room.${roomId}.leave`, { type: 'leave', roomId, userId: user.userId });
  }, [roomId, user, safePublish]);

  const startGame = useCallback(() => {
    safePublish(`/app/game.room.${roomId}.start`, {
      type: 'startGame',
      roomId: roomId,
    });
  }, [roomId, safePublish]);

  const selectAi = useCallback((aiId: number) => {
    if (!user) return;
    safePublish(`/app/game.room.${roomId}.selectAi`, {
      type: 'selectAi',
      userId: user.userId,
      roomId: roomId,
      aiId,
    });
  }, [roomId, user, safePublish]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stompRef.current?.connected && user) {
        stompRef.current.publish({
          destination: `/app/game.room.${roomId}.leave`,
          body: JSON.stringify({ type: 'leave', roomId, userId: user.userId }),
        });
        stompRef.current.deactivate(); // 연결 끊기
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [roomId, user]);

  useEffect(() => {
    // 4. user나 token 정보가 없으면 연결을 시도하지 않음
    if (!roomId || !user || !token) {
      console.log('🔁 필요한 값 부족 - roomId, user, token:', roomId, user, token);
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(endpoint),
      // 5. Redux 스토어의 토큰을 사용
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {},
    });

    client.onConnect = () => {
      setConnected(true);
      console.log('STOMP connected!');

      // 구독 로직 (변경 없음)
      client.subscribe(`/topic/game.room.${roomId}`, (msg: IMessage) => {/* ... */});
      client.subscribe(`/topic/game.room.${roomId}.state`, (msg: IMessage) => {
        const payload = JSON.parse(msg.body);
        setRoomState(payload);  // 🚨 반드시 상태 반영
      });

      // 6. joinRoom 시 Redux 스토어의 userId 전송
      client.publish({
        destination: `/app/game.room.${roomId}.join`,
        body: JSON.stringify({
          type: 'joinRoom',
          roomId: roomId,
          userId: user.userId, // Redux에서 가져온 userId 사용
        }),
      });
    };

    client.onWebSocketClose = () => setConnected(false);
    client.onDisconnect = () => setConnected(false);
    client.onWebSocketError = (e) => console.error('WebSocket error:', e);
    client.onStompError = (frame) => {/* ... */};

    stompRef.current = client;
    client.activate();

    return () => {
      console.log('Deactivating STOMP client...');
      setConnected(false);

      try {
        // ✅ URL 변경 등으로 빠질 때도 leave 메시지 전송
        if (stompRef.current?.connected && user) {
          stompRef.current.publish({
            destination: `/app/game.room.${roomId}.leave`,
            body: JSON.stringify({ type: 'leave', roomId, userId: user.userId }),
          });
        }

        if (stompRef.current?.active) {
          stompRef.current.deactivate();
        }
      } finally {
        stompRef.current = null;
      }
    };
  }, [roomId, endpoint, user, token]);

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