import { useEffect, useMemo, useRef, useState } from "react";
import UPlotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";

export function AutoResizeUPlotReact({
  setOptions,
  ...props
}: Parameters<typeof UPlotReact>[0] & {
  setOptions: React.Dispatch<React.SetStateAction<uPlot.Options>>;
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const { width, height } = chartRef.current.getBoundingClientRect();

      // Update chart options with the container size
      setOptions((prev) => ({
        ...prev,
        width,
        height,
      }));
    }

    // Optional: Add resize listener to update on window resize
    const handleResize = () => {
      if (chartRef.current) {
        const { width, height } = chartRef.current.getBoundingClientRect();

        // Update chart options with the new size
        setOptions((prev) => ({
          ...prev,
          width,
          height,
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ width: "100%", height: "85vh" }} ref={chartRef}>
      <UPlotReact {...props} />
    </div>
  );
}
