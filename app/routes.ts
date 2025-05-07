import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/multi-sensor-live", "routes/multi-sensor-live.tsx"),
  route("/multi-sensor-live-windowed", "routes/multi-sensor-live-windowed.tsx"),
] satisfies RouteConfig;
