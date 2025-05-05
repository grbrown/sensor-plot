import { useEffect, useState } from "react";

const MAXIMUM_POINT_WINDOW = 100;

export type ProducerData = { timestamp: string; value: number };

export function useProducer(id: string, live: boolean = false) {
  const [producerBatchData, setProducerBatchData] = useState<ProducerData[]>(
    []
  );
  useEffect(() => {
    // fetch("http://localhost:8000/")
    //   .then((data) => data.text())
    //   .then((data) => console.log(data));
    const socket = new WebSocket(`ws://localhost:8000/producer/${id}`);

    socket.onopen = () => {
      console.log("WebSocket connected");
      socket.send("Hello Server!");
    };

    socket.onmessage = (event) => {
      console.log("Message from producer:", id);
      const dataArray = JSON.parse(event.data);
      if (!live) {
        console.log(dataArray);
      }
      setProducerBatchData((curr) => {
        const newLength = curr.length + dataArray.length;
        if (newLength > MAXIMUM_POINT_WINDOW) {
          const msSpan =
            new Date(dataArray[dataArray.length - 1].timestamp).getTime() -
            new Date(curr[0].timestamp).getTime();
          const desiredPointDensity = msSpan / MAXIMUM_POINT_WINDOW;

          const ret = [];
          for (let i = 0; i < newLength; i++) {
            if (i == 0) {
              ret.push(curr[0]);
              continue;
            }
            const currentPoint =
              i < curr.length ? curr[i] : dataArray[i - curr.length];
            const prevPoint = ret[ret.length - 1];
            const currTs = new Date(currentPoint.timestamp).getTime();
            const prevTs = new Date(prevPoint.timestamp).getTime();
            const timeDelta = Math.abs(currTs - prevTs);
            if (timeDelta > desiredPointDensity) {
              ret.push(currentPoint);
            } else {
              const a = 1;
              //console.log(`Producer ${id} dropping point ${currentPoint}`);
            }
          }

          // console.log(
          //   `Producer ${id} 's points span ${

          //   }  ms`
          // );
          // const excess = newLength - MAXIMUM_POINT_WINDOW;
          // const pointDropInterval = Math.ceil(newLength / excess);
          // const expectedDroppedPoints = Math.floor(
          //   newLength / pointDropInterval
          // );
          // const ret = [...new Array(newLength - expectedDroppedPoints)];
          // let retIndex = 0;
          // for (let i = 0; i < newLength; i++) {
          //   if (i % pointDropInterval !== 0) {
          //     ret[retIndex] =
          //       i < curr.length ? curr[i] : dataArray[i - curr.length];
          //     retIndex++;
          //   }
          // }
          return ret;
        }
        return [...curr, ...dataArray];
      });
      //close on first message if not live
      if (live === false) {
        socket.close();
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }, []);
  return producerBatchData;
}
