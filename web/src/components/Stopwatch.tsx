import { Card, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsStopwatchFill } from "react-icons/bs";
import { FaSave } from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { MdOutlineWatchLater } from "react-icons/md";

import { usePocket } from "../lib/PocketContext";
import "./Stopwatch.css";
import { Button } from "./ui/button";
import { toaster, Toaster } from "./ui/toaster";

type TimeRecord = {
  timeOut: number;
  user: string;
};

export default function Stopwatch() {
  const [time, setTime] = useState(0);

  const { user, pb } = usePocket();

  const id = user?.id;

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

  async function save() {
    if (!id) {
      console.error("Can't save time for unidentitified user");
      return;
    }
    const data: TimeRecord = {
      timeOut: time,
      user: id,
    };

    try {
      await pb.collection("times").create(data);
      toaster.create({
        description: "Successfully added time to database",
        type: "success",
      });
      setTime(0);
    } catch (err) {
      toaster.create({
        description: `Failed to add time due to ${err}`,
        type: "error",
      });
    }
  }

  return (
    <div className="center-container">
      <Card.Root width="60vw">
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
          <Button>
            New <MdOutlineWatchLater />
          </Button>
          <Button
            colorPalette="gray"
            onClick={startAndStop}
            variant={"surface"}
          >
            {isRunning ? "Pause" : "Start"} <BsStopwatchFill />
          </Button>
          <Button colorPalette="gray" variant={"surface"} onClick={reset}>
            Reset
            <LuTimerReset />
          </Button>
          <Button onClick={save} disabled={!time}>
            Save <FaSave />
          </Button>
        </Card.Footer>
      </Card.Root>
      <Toaster />
    </div>
  );
}
