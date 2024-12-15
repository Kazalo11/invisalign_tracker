import { Card, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsStopwatchFill } from "react-icons/bs";
import { LuTimerReset } from "react-icons/lu";
import "./Stopwatch.css";
import { Button } from "./ui/button";

export default function Stopwatch() {
  const [time, setTime] = useState(0);

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const hours = Math.floor(time / 360000);

  const minutes = Math.floor((time % 360000) / 6000);

  const seconds = Math.floor((time % 6000) / 100);

  const milliseconds = time % 100;

  const startAndStop = () => {
    setIsRunning(!isRunning);
  };
  const reset = () => {
    setTime(0);
  };
  return (
    <Card.Root width="40vw">
      <Card.Title>
        <Heading size="xl" textAlign={"center"}>
          Timer
        </Heading>
      </Card.Title>
      <Card.Body className="stopwatch-time">
        {hours}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}:
        {milliseconds.toString().padStart(2, "0")}
      </Card.Body>
      <Card.Footer className="stopwatch-buttons">
        <Button colorPalette="gray" onClick={startAndStop} variant={"surface"}>
          {isRunning ? "Start" : "Stop"} <BsStopwatchFill />
        </Button>
        <Button colorPalette="gray" variant={"surface"} onClick={reset}>
          Reset
          <LuTimerReset />
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
