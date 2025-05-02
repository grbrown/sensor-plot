import { SensorGraph } from "~/graphing/sensor-graph";
import { Plots } from "~/welcome/plots";
import { PlotsThree } from "~/welcome/plots-three";
import { PlotsTwo } from "~/welcome/plots-two";

export default function MultiLive() {
  const oneToTen = [...Array(10)].map((_, i) => i + 1);
  return (
    <div>
      {oneToTen.map((i) => (
        <SensorGraph key={i} sensorNum={i} live={false} />
      ))}
    </div>
  );
}
