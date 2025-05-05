import { SensorGraph } from "~/graphing/sensor-graph";

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
