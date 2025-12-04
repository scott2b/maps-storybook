import React, { type ReactNode } from 'react';
import type { CardProps } from '@design/ui-core';
import { colors } from '@design/ui-core';
import './Card.css';

export interface ReactCardProps extends CardProps {
  children?: ReactNode;
  onClick?: () => void;
}

export function Card({
  title,
  description,
  variant = 'default',
  clickable = false,
  children,
  onClick,
}: ReactCardProps) {
  const classes = ['card', `variant-${variant}`, clickable ? 'clickable' : '']
    .filter(Boolean)
    .join(' ');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={classes}
      role={clickable ? 'button' : 'article'}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={
        {
          '--surface-color': colors.surface,
          '--text-color': colors.text,
        } as React.CSSProperties
      }
    >
      {title && <h3 className="card-title">{title}</h3>}
      {description && <p className="card-description">{description}</p>}
      {children}
    </div>
  );
}
