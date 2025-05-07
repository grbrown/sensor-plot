import { useEffect, useMemo, useRef, useState } from "react";
import "uplot/dist/uPlot.min.css";
import { useIsDarkMode } from "~/hooks/useIsDarkMode";
import { darkColors, lightColors } from "~/constants/colors";
import { AutoResizeUPlotReact } from "~/components/AutoResizeUPlotReact";
import {
  convertMultiProducerDataToUPlotArrayAndAppend,
  type MultiLinePlotData,
} from "~/util/convertMultiProducerDataToUPlotArrayAndAppend";
import { DEFAULT_DATA_POINT_MAXIMUM } from "~/routes/home";

export type SensorGraphProps = {
  live?: boolean;
  windowed?: boolean;
};

export type ProducerData = { timestamp: string; value: number };

const getGraphTitle = (windowed: boolean, maximumDataPointValue: number) => {
  if (windowed) {
    return (
      "Multi Sensor Graph, Time Windowed - Maximum Data Points: " +
      maximumDataPointValue
    );
  } else {
    return "Multi Sensor Graph - Maximum Data Points: " + maximumDataPointValue;
  }
};

export function MultiSensorGraph({ live, windowed = false }: SensorGraphProps) {
  const maximumDataPointsRef = useRef(DEFAULT_DATA_POINT_MAXIMUM);
  useEffect(() => {
    const storedMaxPoints = localStorage.getItem("dataPointMaximum");
    if (storedMaxPoints) {
      maximumDataPointsRef.current = parseFloat(storedMaxPoints);
      setOptions((prev) => ({
        ...prev,
        title: getGraphTitle(windowed, maximumDataPointsRef.current),
      }));
    }
  }, []);
  const oneToTen = [...Array(10)].map((_, i) => i + 1);
  const isDarkMode = useIsDarkMode();

  // Track whether we're in a zoomed state
  const needsZoomReset = useRef(false);

  const [graphData, setGraphData] = useState<MultiLinePlotData>([
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ]);

  // Store the current scale state
  const scaleStateRef = useRef<{ min: number; max: number } | null>(null);

  const colorSchemeOptions = isDarkMode
    ? {
        axes: [
          {
            // x-axis
            grid: {
              stroke: "#607d8b",
              width: 1,
            },
            ticks: {
              stroke: "#607d8b",
              width: 1,
            },
            stroke: "#c7d0d9",
          },
          {
            // y-axis
            grid: {
              stroke: "#607d8b",
              width: 1,
            },
            ticks: {
              stroke: "#607d8b",
              width: 1,
            },
            stroke: "#c7d0d9",
          },
        ],
      }
    : {};

  const [options, setOptions] = useState<uPlot.Options>(
    useMemo(
      () => ({
        title: getGraphTitle(windowed, maximumDataPointsRef.current),
        ...colorSchemeOptions,
        width: 400,
        height: 300,
        series: [
          {
            label: "Time",
          },
          ...oneToTen.map((i) => ({
            label: "Value" + i,
            points: { show: false },
            stroke: isDarkMode ? darkColors[i - 1] : lightColors[i - 1],
          })),
        ],
        scales: { x: { time: true } },
        // Add custom handling for auto-ranging to preserve zoom
        hooks: {
          // Track when user zooms in
          setScale: [
            (u) => {
              // Get x-scale min/max
              const xScaleMin = u.scales.x.min!;
              const xScaleMax = u.scales.x.max!;

              // Get full data range
              const xData = u.data[0];
              const dataMin = Math.min(...xData);
              const dataMax = Math.max(...xData);

              // Check if we're zoomed in (allowing for small floating point differences)
              const isZoomed =
                Math.abs(xScaleMin - dataMin) > 0.001 ||
                Math.abs(xScaleMax - dataMax) > 0.001;

              if (needsZoomReset.current) {
                needsZoomReset.current = false;
                scaleStateRef.current = null;
              } else {
                if (isZoomed) {
                  // Save the current scale state
                  if (!scaleStateRef.current) {
                    scaleStateRef.current = {
                      min: xScaleMin,
                      max: xScaleMax,
                    };
                  }
                }
              }
            },
          ],

          setSelect: [
            (u) => {
              if (scaleStateRef.current != null) {
                scaleStateRef.current = null;
              }
            },
          ],
        },
      }),
      []
    )
  );

  const producer1DataRef = useRef<ProducerData[]>([]);
  const producer2DataRef = useRef<ProducerData[]>([]);
  const producer3DataRef = useRef<ProducerData[]>([]);
  const producer4DataRef = useRef<ProducerData[]>([]);
  const producer5DataRef = useRef<ProducerData[]>([]);
  const producer6DataRef = useRef<ProducerData[]>([]);
  const producer7DataRef = useRef<ProducerData[]>([]);
  const producer8DataRef = useRef<ProducerData[]>([]);
  const producer9DataRef = useRef<ProducerData[]>([]);
  const producer10DataRef = useRef<ProducerData[]>([]);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/1`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer1DataRef.current = [...producer1DataRef.current, ...dataArray];
      const producersData = [
        producer1DataRef.current,
        producer2DataRef.current,
        producer3DataRef.current,
        producer4DataRef.current,
        producer5DataRef.current,
        producer6DataRef.current,
        producer7DataRef.current,
        producer8DataRef.current,
        producer9DataRef.current,
        producer10DataRef.current,
      ];
      if (!producersData.find((pd) => pd.length === 0)) {
        const prod1StartLen = producer1DataRef.current.length;
        const bufferMinLength = Math.min(
          ...producersData.map((pd) => pd.length)
        );
        const bufferData: ProducerData[][] = [];
        producersData.forEach((pd) => {
          bufferData.push(pd.splice(0, bufferMinLength));
        });
        //todo: evaluate this code
        const prod1EndLen = producer1DataRef.current.length;
        if (prod1StartLen - bufferData[0].length !== prod1EndLen) {
          console.error("diag- producer1 length mismatch");
        }
        setGraphData((curr) => {
          //todo factor into method
          var newData = convertMultiProducerDataToUPlotArrayAndAppend(
            bufferData,
            curr
          );

          if (newData[0].length > maximumDataPointsRef.current) {
            if (!windowed) {
              var indicesToDelete: Set<number> = new Set();
              const secondsSpan =
                newData[0][newData[0].length - 1] - newData[0][0];
              const desiredPointDensity =
                secondsSpan / maximumDataPointsRef.current;

              var currTs = newData[0][0];
              newData[0].forEach((curr, index) => {
                if (index === 0) {
                  return;
                }
                if (index >= newData[0].length) {
                  return;
                }
                const nextTs = curr;

                const timeDelta = Math.abs(nextTs - currTs);
                if (timeDelta < desiredPointDensity) {
                  indicesToDelete.add(index);
                } else {
                  currTs = nextTs;
                }
              });
              newData = newData.map((xOrYArray) =>
                xOrYArray.filter((_, index) => {
                  return !indicesToDelete.has(index);
                })
              );
            } else {
              // If we're in windowed mode, we want to keep the last 1000 points
              newData = newData.map((xOrYArray) =>
                xOrYArray.slice(
                  Math.max(0, xOrYArray.length - maximumDataPointsRef.current)
                )
              );
            }
          }

          return newData;
        });
      }
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/2`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer2DataRef.current = [...producer2DataRef.current, ...dataArray];
    };
  }, []);
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/3`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer3DataRef.current = [...producer3DataRef.current, ...dataArray];
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/4`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer4DataRef.current = [...producer4DataRef.current, ...dataArray];
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/5`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer5DataRef.current = [...producer5DataRef.current, ...dataArray];
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/6`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer6DataRef.current = [...producer6DataRef.current, ...dataArray];
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/7`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer7DataRef.current = [...producer7DataRef.current, ...dataArray];
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/8`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer8DataRef.current = [...producer8DataRef.current, ...dataArray];
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/9`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer9DataRef.current = [...producer9DataRef.current, ...dataArray];
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/10`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);

      producer10DataRef.current = [...producer10DataRef.current, ...dataArray];
    };
  }, []);

  const zoomEnabled = scaleStateRef.current !== null;
  const zoomedData = (() => {
    if (needsZoomReset.current) {
      return graphData;
    }
    if (!zoomEnabled) {
      return null;
    }
    const xScaleMin = scaleStateRef.current!.min;
    const xScaleMax = scaleStateRef.current!.max;
    const startPointIndex = graphData[0].findIndex((x) => x >= xScaleMin);
    const endPointIndex = graphData[0].findIndex((x) => x >= xScaleMax);
    const zoomedData = graphData.map((arr) =>
      arr.slice(startPointIndex, endPointIndex)
    );
    return zoomedData;
  })();

  const plotData = zoomedData ?? graphData;

  const averages = zoomedData?.slice(1).map((arr) => {
    return arr.reduce((acc, curr) => acc + curr, 0) / arr.length;
  });
  const maximums = zoomedData?.slice(1).map((arr) => {
    return Math.max(...arr);
  });
  const minimums = zoomedData?.slice(1).map((arr) => {
    return Math.min(...arr);
  });

  useEffect(() => {
    if (zoomEnabled === true) {
      setOptions((prev) => ({
        ...prev,
        width: prev.width - 300,
      }));
    }
  }, [zoomEnabled]);

  return (
    <div className="w-full flex flex-row flex-nowrap">
      <AutoResizeUPlotReact
        key="hooks-key"
        setOptions={setOptions}
        options={options}
        data={plotData as uPlot.AlignedData}
      />
      {zoomEnabled && (
        <div className="w-[400px]">
          <button
            onClick={() => {
              needsZoomReset.current = true;
              setOptions((prev) => ({
                ...prev,
                width: prev.width + 300,
              }));
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reset zoom
          </button>
          <table>
            <tr>
              <th>Producer</th>
              <th>Min</th>
              <th>Max</th>
              <th>Avg</th>
            </tr>
            {oneToTen.map((index) => {
              return (
                <tr>
                  <th>Producer {index}</th>
                  <td>{minimums?.[index - 1]?.toFixed(4)}</td>
                  <td>{maximums?.[index - 1]?.toFixed(4)}</td>
                  <td>{averages?.[index - 1]?.toFixed(4)}</td>
                </tr>
              );
            })}
          </table>
        </div>
      )}
    </div>
  );
}
