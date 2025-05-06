import { useEffect, useMemo, useRef, useState } from "react";
import { useProducer, type ProducerData } from "~/hooks/useProducer";
import UPlotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { convertProducerDataToUPlotArray } from "~/util/convertProducerDataToUPlotArray";
import { useColorScheme } from "~/hooks/useColorScheme";
import { darkColors, lightColors } from "~/constants/colors";
import {
  convertMultiProducerDataToUPlotArray,
  type MultiLinePlotData,
} from "~/util/convertMultiProducerDataToUPlotArray";
import { AutoResizeUPlotReact } from "~/components/AutoResizeUPlotReact";
import { convertMultiProducerDataToUPlotArrayAndAppend } from "~/util/convertMultiProducerDataToUPlotArrayAndAppend";

const loadStartTime = performance.now();

const dummyPlugin = (): uPlot.Plugin => ({
  hooks: {
    init(u: uPlot, opts: uPlot.Options) {
      void u;
      void opts;
    },
  },
});

export type SensorGraphProps = {
  live?: boolean;
};

export function MultiSensorGraph({ live }: SensorGraphProps) {
  const oneToTen = [...Array(10)].map((_, i) => i + 1);
  const colorScheme = useColorScheme();

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

  const [options, setOptions] = useState<uPlot.Options>(
    useMemo(
      () => ({
        title: "Chart",
        width: 400,
        height: 300,
        series: [
          {
            label: "Time",
          },
          ...oneToTen.map((i) => ({
            label: "Value" + i,
            points: { show: false },
            stroke: colorScheme ? darkColors[i - 1] : lightColors[i - 1],
          })),
        ],
        plugins: [dummyPlugin()],
        scales: { x: { time: true } },
        // Add custom handling for auto-ranging to preserve zoom
        hooks: {
          // Track when user zooms in
          setScale: [
            (u) => {
              console.log("hook-setScale");
              // Get x-scale min/max
              const xScaleMin = u.scales.x.min;
              const xScaleMax = u.scales.x.max;

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
              console.log("hook-setSelect");
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
        const bufferMinLength = Math.min(
          ...producersData.map((pd) => pd.length)
        );
        const bufferData: ProducerData[][] = [];
        producersData.forEach((pd) => {
          bufferData.push(pd.splice(0, bufferMinLength));
        });
        setGraphData((curr) => {
          const newData = convertMultiProducerDataToUPlotArrayAndAppend(
            bufferData,
            curr
          );
          return newData;
        });
      }
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/1`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer2DataRef.current = [...producer2DataRef.current, ...dataArray];
    };
  }, []);
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/1`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer3DataRef.current = [...producer3DataRef.current, ...dataArray];
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/1`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer4DataRef.current = [...producer4DataRef.current, ...dataArray];
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/1`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer5DataRef.current = [...producer5DataRef.current, ...dataArray];
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/1`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer6DataRef.current = [...producer6DataRef.current, ...dataArray];
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/1`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer7DataRef.current = [...producer7DataRef.current, ...dataArray];
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/1`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer8DataRef.current = [...producer8DataRef.current, ...dataArray];
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/1`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer9DataRef.current = [...producer9DataRef.current, ...dataArray];
    };
  }, []);

  //const [dataLength, setDataLength] = useState(0);
  const dataLength = graphData[0].length;

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/1`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);

      producer10DataRef.current = [...producer10DataRef.current, ...dataArray];
      //setDataLength(producer10DataRef.current.length);
    };
  }, []);

  // const producer2Data = useProducer("2", live);
  // const producer3Data = useProducer("3", live);
  // const producer4Data = useProducer("4", live);
  // const producer5Data = useProducer("5", live);
  // const producer6Data = useProducer("6", live);
  // const producer7Data = useProducer("7", live);
  // const producer8Data = useProducer("8", live);
  // const producer9Data = useProducer("9", live);
  // const producer10Data = useProducer("10", live);

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

  if (zoomedData !== null) {
    console.log("zoomedData", zoomedData);
  }
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
  const stdDevs = zoomedData?.slice(1).map((arr) => {
    const avg = arr.reduce((acc, curr) => acc + curr, 0) / arr.length;
    const variance =
      arr.reduce((acc, curr) => acc + (curr - avg) ** 2, 0) / arr.length;
    return Math.sqrt(variance);
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
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
      }}
    >
      <AutoResizeUPlotReact
        key="hooks-key"
        setOptions={setOptions}
        options={options}
        data={plotData}
        //target={root}
        onDelete={(/* chart: uPlot */) => console.log("Deleted from hooks")}
        onCreate={(/* chart: uPlot */) => console.log("Created from hooks")}
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
          >
            Reset zoom
          </button>
          <table>
            <tr>
              <th>Producer</th>
              <th>Min</th>
              <th>Max</th>
              <th>{dataLength}</th>
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
