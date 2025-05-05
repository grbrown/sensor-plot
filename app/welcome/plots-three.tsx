import { Welcome } from "./welcome";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProducer } from "~/hooks/useProducer";
import UPlotReact from "uplot-react";
import { data } from "react-router";
import "uplot/dist/uPlot.min.css";

export function PlotsThree() {
  const [options, setOptions] = useState<uPlot.Options>(
    useMemo(
      () => ({
        title: "Chart",
        width: 300,
        height: 400,
        series: [
          {
            label: "Date",
          },
          {
            label: "Sensor",
            points: { show: true }, // Show points for better hover interaction
            stroke: "blue",
            width: 2, // Line width
          },
          {
            label: "Sensor2",
            points: { show: true }, // Show points for better hover interaction
            stroke: "red",
            width: 2, // Line width
          },
        ],
      }),
      []
    )
  );

  const initialState = useMemo<uPlot.AlignedData>(
    () => [
      [1, 2, 3],
      [58.046204, 59.848854, 58.390514],
      [70.046204, 47.848854, 47.390514],
    ],
    []
  );
  const [data, setData] = useState<uPlot.AlignedData>(initialState);

  const chartRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (chartRef.current) {
      const { width, height } = chartRef.current.getBoundingClientRect();
      setDimensions({ width, height });

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
        setDimensions({ width, height });

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
    <div className="w-[100%] h-[85vh]" ref={chartRef}>
      <UPlotReact
        key="hooks-key2"
        options={options}
        data={data}
        //target={root}
        onDelete={(/* chart: uPlot */) => console.log("Deleted from hooks")}
        onCreate={(/* chart: uPlot */) => console.log("Created from hooks")}
      />
    </div>
  );
}
