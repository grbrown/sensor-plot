import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/asdf", "routes/asdf.tsx"),
  route("/live", "routes/live.tsx"),
  route("/hardcoded", "routes/hardcoded.tsx"),
  route("producer/:id", "routes/producer.$id.tsx"), // Dynamic route ("/producer/:id")
] satisfies RouteConfig;
