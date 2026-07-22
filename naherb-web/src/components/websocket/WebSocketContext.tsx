"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { useGetAuthMe } from '@/services/generated/customer-profile/customer-profile';

type WebSocketContextType = {
  client: Client | null;
  connected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType>({
  client: null,
  connected: false,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  const { data } = useGetAuthMe({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
    }
  });

  const user = data as unknown as { id: string; email: string; name: string; role: string } | undefined;

  useEffect(() => {
    if (!user) {
      if (client) {
        client.deactivate();
        setClient(null);
        setConnected(false);
      }
      return;
    }

    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
    // https://api.example.com/api → wss://api.example.com/ws
    const wsUrl = apiBase
      .replace(/^http:/i, "ws:")
      .replace(/^https:/i, "wss:")
      .replace(/\/api\/?$/i, "/ws");

    const stompClient = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // Pass the session cookie automatically via browser. 
      // If backend requires auth token in header (less likely with STOMP over browser WebSocket), we'd configure it here.
    });

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      setConnected(true);
    };

    stompClient.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      setConnected(false);
    };

    stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [user?.id]); // Re-run if user logs in/out

  return (
    <WebSocketContext.Provider value={{ client, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};
