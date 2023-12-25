import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  timeInterval: number;
  onTimeout?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  timeInterval,
  onTimeout,
}) => {
  const [seconds, setSeconds] = useState(timeInterval);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let intervalId: number;

    if (isActive) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            clearInterval(intervalId);
            setIsActive(false);

            // Call the onTimeout callback if provided
            if (onTimeout) {
              onTimeout();
            }
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive, onTimeout]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;

    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
    return formattedTime;
  };

  return (
    <div>
      <div>Time Remaining: {formatTime(seconds)}</div>
    </div>
  );
};

export default CountdownTimer;
