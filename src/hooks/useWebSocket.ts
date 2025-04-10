// src/hooks/useWebSocket.ts

import { useEffect, useRef, useState } from "react";

interface WebSocketOptions {
  onOpen?: (e: Event) => void;
  onMessage?: (e: MessageEvent) => void;
  onClose?: (e: CloseEvent) => void;
  onError?: (e: Event) => void;
  reconnectInterval?: number;
  protocols?: string | string[];
}

// useWebSocket Export
export const useWebSocket = (
  url: string,
  options: WebSocketOptions = {}
) => {
  const {
    onOpen,
    onMessage,
    onClose,
    onError,
    reconnectInterval = 3000,   // 3 초마다 재 연결 요청을 한다.
    protocols
  } = options;

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = () => {
    const ws = new WebSocket(url, protocols);
    socketRef.current = ws;

    ws.onopen = (e) => {
      setConnected(true);
      onOpen?.(e);
    };

    ws.onmessage = (e) => {
      onMessage?.(e);
    };

    ws.onclose = (e) => {
      setConnected(false);
      onClose?.(e);
      reconnectTimer.current = setTimeout(() => {
        connect(); // 재연결 시도
      }, reconnectInterval);
    };

    ws.onerror = (e) => {
      onError?.(e);
    };
  };

  const sendMessage = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(data);
    } else {
      console.warn("WebSocket is not open. Can't send message.");
    }
  };

  useEffect(() => {
    connect();
    return () => {
      reconnectTimer.current && clearTimeout(reconnectTimer.current);
      socketRef.current?.close();
    };
  }, [url]);

  return {
    sendMessage,
    connected,
    socket: socketRef.current,
  };
};