import { useEffect } from "react";

export function useProducer(id: string) {
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
      console.log(JSON.parse(event.data));
      socket.close();
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }, []);
}
