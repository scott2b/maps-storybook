import React from 'react';
import { colors } from '@design/ui-core';
import './Button.css';

export interface ButtonProps {
  label?: string;
  primary?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export function Button({
  label = 'Button',
  primary = false,
  size = 'medium',
  onClick,
}: ButtonProps) {
  const classes = ['btn', primary ? 'btn-primary' : 'btn-secondary', `btn-${size}`].join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      style={
        {
          '--primary-color': colors.primary,
          '--text-color': colors.text,
        } as React.CSSProperties
      }
    >
      {label}
    </button>
  );
}
