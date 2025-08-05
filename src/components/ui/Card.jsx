import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'default',
  shadow = 'default',
  hover = false,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200';
  
  const paddingClasses = {
    none: '',
    small: 'p-3',
    default: 'p-4',
    large: 'p-6'
  };
  
  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    default: 'shadow',
    large: 'shadow-lg'
  };
  
  const hoverClasses = hover ? 'transition-shadow duration-200 hover:shadow-lg' : '';
  
  const classes = `${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Subcomponentes para melhor organização
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`border-b border-gray-200 pb-3 mb-3 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`border-t border-gray-200 pt-3 mt-3 ${className}`} {...props}>
    {children}
  </div>
);

export default Card; 