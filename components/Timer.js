import { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Button } from "grommet";
import { Play, Pause, Refresh } from "grommet-icons";

const Timer = ({ sec, handleComplete, hideController }) => {
  const [isPlaying, setisPlaying] = useState(false);
  const [reset, setReset] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        margin: "30px 0",
      }}
    >
      <CountdownCircleTimer
        isPlaying={hideController ? true : isPlaying}
        key={reset}
        duration={sec}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[7, 5, 2, 0]}
        onComplete={handleComplete}
      >
        {({ remainingTime }) =>
          `${Math.floor(remainingTime / 60)}: ${remainingTime % 60}`
        }
      </CountdownCircleTimer>
      {!hideController && (
        <div style={{ margin: "20px 0px" }}>
          <Button
            icon={<Play />}
            onClick={() => setisPlaying(true)}
            label="Play"
            margin="0px 10px"
          />
          <Button
            icon={<Pause />}
            onClick={() => setisPlaying(false)}
            label="Pause"
            margin="0px 10px"
          />
          <Button
            icon={<Refresh />}
            onClick={() => setReset(!reset)}
            label="Reset"
            margin="0px 10px"
          />
        </div>
      )}
    </div>
  );
};

export default Timer;
