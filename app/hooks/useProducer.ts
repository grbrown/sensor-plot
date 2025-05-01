import { useEffect, useState } from "react";

export function useProducer(id: string) {
  const [producerBatchData, setProducerBatchData] = useState<any>();
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
      console.log(dataArray);
      setProducerBatchData(dataArray);
      socket.close();
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }, []);
  return producerBatchData;
}
