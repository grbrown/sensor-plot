import { useEffect, useState } from "react";

export type ProducerData = { timestamp: string; value: number };

export function useProducer(id: string, live: boolean = false) {
  const [producerBatchData, setProducerBatchData] = useState<ProducerData[]>(
    []
  );
  useEffect(() => {
    // fetch("http://localhost:8000/")
    //   .then((data) => data.text())
    //   .then((data) => console.log(data));
    const socket = new WebSocket(`ws://localhost:8000/producer/${id}`);

    socket.onopen = () => {
      console.log("WebSocket connected");
      socket.send("Hello Server!");
    };

    socket.onmessage = (event) => {
      console.log("Message from producer:", id);
      const dataArray = JSON.parse(event.data);
      if (!live) {
        console.log(dataArray);
      }
      setProducerBatchData((curr) => {
        return [...curr, ...dataArray];
      });
      //close on first message if not live
      if (live === false) {
        socket.close();
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }, []);
  return producerBatchData;
}
