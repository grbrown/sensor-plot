import { Plots } from "~/welcome/plots";
import type { Route } from "./+types/home";
import { PlotsTwo } from "~/welcome/plots-two";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <PlotsTwo></PlotsTwo>;
}
