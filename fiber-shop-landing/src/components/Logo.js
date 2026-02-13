import React from 'react';

export default function Logo({ size = 40 }) {
  return (
    <img
      src="/logo.png"
      alt="FiberAgent"
      width={size}
      height={size}
      style={{
        display: 'inline-block',
        objectFit: 'contain'
      }}
    />
  );
}
