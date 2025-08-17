'use client';

import { useState, useEffect } from 'react';

export default function EscrowTimer({ escrowReleaseTime, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!escrowReleaseTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const releaseTime = new Date(escrowReleaseTime).getTime();
      const difference = releaseTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        if (onTimeUp) onTimeUp();
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [escrowReleaseTime, onTimeUp]);

  if (!escrowReleaseTime) return null;

  if (isExpired) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Escrow Period Complete
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Funds have been released to the seller.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-yellow-800">
            Escrow Protection Active
          </h3>
          <p className="text-sm text-yellow-700 mt-1">
            Funds will be released to seller in:
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-800">
            {timeLeft ? (
              `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`
            ) : (
              '--:--:--'
            )}
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            Hours:Minutes:Seconds
          </p>
        </div>
      </div>
    </div>
  );
} 