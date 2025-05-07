import { MultiSensorGraph } from "~/graphing/multi-sensor-graph";

export default function MultiSensorLiveWindowed() {
  return <MultiSensorGraph live={true} windowed={true} />;
}
