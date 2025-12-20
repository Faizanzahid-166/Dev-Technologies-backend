import React, { useEffect, useState } from 'react';

export default function DealsTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 23,
    seconds: 55,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        else if (days > 0) { days--; hours = 23; minutes = 59; seconds = 59; }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
      <TimeBox label="Days" value={timeLeft.days} />
      <TimeBox label="Hours" value={timeLeft.hours} />
      <TimeBox label="Minutes" value={timeLeft.minutes} />
      <TimeBox label="Seconds" value={timeLeft.seconds} />
    </div>
  );
}

function TimeBox({ label, value }) {
  return (
    <div className="text-center">
      <div className="bg-gray-200 px-3 py-1 rounded text-gray-900 font-bold">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs">{label}</div>
    </div>
  );
}
