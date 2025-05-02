import { SensorGraph } from "~/graphing/sensor-graph";
import { Plots } from "~/welcome/plots";
import { PlotsThree } from "~/welcome/plots-three";
import { PlotsTwo } from "~/welcome/plots-two";

export default function MultiLive() {
  return <SensorGraph sensorNum={1}></SensorGraph>;
}
