import { Text } from '@/components/atoms/text';
import React, { useEffect } from 'react';

type CountdownTimerProps = {
  time: number
  setTime: (payload: (prevTime: number) => number) => void
}

const CountdownTimer = ({ time, setTime }: CountdownTimerProps) => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime: number) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [setTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Text variant='ps' color='text-deep-gray-100'>
      Code expires in: &nbsp;
      <b className='text-blue-tone-200 font-medium text-xs'>
        {formatTime(time)}
      </b>
    </Text>
  );
};

export default CountdownTimer;
