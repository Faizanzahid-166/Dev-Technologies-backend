// src/pages/ComingSoon.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router";
export default function ComingSoon() {
  const targetDate = new Date("2025-09-01T00:00:00"); // set your launch date
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate));

  function getTimeRemaining(endTime) {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { total, days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-900 to-purple-800 min-h-screen flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-5xl font-bold mb-4">🚀 Coming Soon!</h1>
      <p className="mb-8 text-lg text-center max-w-lg">
        We’re working hard to launch something amazing. Stay tuned and be the first to know when we go live.
      </p>

      {/* Countdown Timer */}
      <div className="flex gap-6 text-center mb-8">
        <div>
          <span className="text-4xl font-bold">{timeLeft.days}</span>
          <p className="text-sm">Days</p>
        </div>
        <div>
          <span className="text-4xl font-bold">{timeLeft.hours}</span>
          <p className="text-sm">Hours</p>
        </div>
        <div>
          <span className="text-4xl font-bold">{timeLeft.minutes}</span>
          <p className="text-sm">Minutes</p>
        </div>
        <div>
          <span className="text-4xl font-bold">{timeLeft.seconds}</span>
          <p className="text-sm">Seconds</p>
        </div>
      </div>

      {/* Notify Me Button */}
      <Link to="/" className="bg-white text-purple-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300">
        Notify Me
      </Link>
    </div>
  );
}
