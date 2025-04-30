import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useEffect } from "react";
import { Plots } from "~/welcome/plots";
import { useProducer } from "~/hooks/useProducer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  // useEffect(() => {
  //   // fetch("http://localhost:8000/")
  //   //   .then((data) => data.text())
  //   //   .then((data) => console.log(data));
  //   const socket = new WebSocket("ws://localhost:8000/producer/1");

  //   socket.onopen = () => {
  //     console.log("WebSocket connected");
  //     socket.send("Hello Server!");
  //   };

  //   socket.onmessage = (event) => {
  //     console.log("Message from server:", event.data);
  //     socket.close();
  //   };

  //   socket.onclose = () => {
  //     console.log("WebSocket disconnected");
  //   };

  // }, []);
  useProducer("1");
  useProducer("2");
  useProducer("3");
  useProducer("4");

  return <Plots />;
}
