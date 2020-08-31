import React from 'react';
import { Button } from 'react-bootstrap';
import { HiOutlineRefresh } from 'react-icons/hi';
import './LoaderButton.css';

const LoaderButton = ({
  isLoading,
  className = '',
  disabled = false,
  ...props
}) => (
  <Button
    className={`LoaderButton ${className}`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <HiOutlineRefresh className="spinning" />}
    {props.children}
  </Button>
);

export default LoaderButton;
