import { useEffect } from "react";
import { ProducerData } from "~/types/producerData";

/**
 * Custom hook to manage WebSocket connection for a producer.
 * @param {string} producerId - The ID of the producer.
 * @param {React.RefObject<ProducerData[]>} producerDataBufferRef - Ref to the buffer where producer data will be stored.
 */
export const useProducerWebSocketConnectionBuffer = (
  producerId: string,
  producerDataBufferRef: React.RefObject<ProducerData[]>
) => {
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/${producerId}`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producerDataBufferRef.current = [
        ...producerDataBufferRef.current,
        ...dataArray,
      ];
    };
  }, []);
};
