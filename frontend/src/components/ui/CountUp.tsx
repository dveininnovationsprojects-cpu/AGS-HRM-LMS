import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function CountUp({ target, duration = 1200, prefix = '', suffix = '', decimals = 0 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;
    if (target === 0) { setCount(0); return; }

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(eased * target);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  const formattedCount = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.round(count).toLocaleString();

  return <span>{prefix}{formattedCount}{suffix}</span>;
}
