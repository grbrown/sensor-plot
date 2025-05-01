import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useEffect, useMemo, useState } from "react";
import { Plots } from "~/welcome/plots";
import { useProducer } from "~/hooks/useProducer";
import UPlotReact from "uplot-react";
import { data } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [options, setOptions] = useState<uPlot.Options>(
    useMemo(
      () => ({
        title: "Chart",
        width: 400,
        height: 300,
        series: [
          {
            label: "Date",
          },
          {
            label: "",
            points: { show: false },
            stroke: "blue",
            fill: "blue",
          },
        ],
        plugins: [],
        scales: { x: { time: true } },
      }),
      []
    )
  );
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
  const producer1Data = useProducer("1");
  // useProducer("2");
  // useProducer("3");
  // useProducer("4");
  // if (producer1Data !== undefined) {
  //   debugger;
  // }
  const dataX = producer1Data?.reduce((acc, curr) => {
    const unixTs = new Date(curr["timestamp"]).getTime();
    acc.push(unixTs);
    return acc;
  }, []);
  const dataY = producer1Data?.reduce((acc, curr) => {
    acc.push(curr["value"]);
    return acc;
  }, []);

  const data = [dataX, dataY];
  return producer1Data !== undefined ? (
    <UPlotReact
      key="hooks-key"
      options={options}
      data={data}
      //target={root}
      onDelete={(/* chart: uPlot */) => console.log("Deleted from hooks")}
      onCreate={(/* chart: uPlot */) => console.log("Created from hooks")}
    />
  ) : (
    <div>loading...</div>
  );
}
