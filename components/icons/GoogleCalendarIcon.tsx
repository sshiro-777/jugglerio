import React from 'react';

const GoogleCalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={className}
  >
    <path fill="#34A853" d="M12 22h5V12l-5-5z"></path>
    <path fill="#4285F4" d="M12 22H7l5-5zM7 12l5 5V7z"></path>
    <path fill="#FBBC05" d="M12 7V2l-5 5z"></path>
    <path fill="#EA4335" d="M12 2l5 5h-5z"></path>
    <path fill="#1A73E8" d="M17 12v5h-5z"></path>
  </svg>
);

export default GoogleCalendarIcon;