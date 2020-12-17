import React, { useState, useEffect } from 'react';

import { TimeBox } from './styles';

const calculateTimeLeft = () => {
  var end = new Date();
  end.setHours(23,59,59,999);

  const difference = +end - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export default function ClockTime() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  const formatDate = `${timeLeft.hours.toString().padStart(2,'0')}:${timeLeft.minutes.toString().padStart(2,'0')}:${timeLeft.seconds.toString().padStart(2,'0')}`;

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  }, [timeLeft]);

  return (
    <TimeBox>
      {' '}
      { formatDate }
      {' '}
    </TimeBox>
  );
}
