import React from 'react';

const GoogleDriveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
  >
    <path d="M7.71,3.5,1.5,14,4.53,19.23,10.75,8.73Z" fill="#34A853" />
    <path d="M16.3,3.5,10.75,13,13.78,18.23,22.5,18.23Z" fill="#FFC107" />
    <path d="M16.28,3.5,22.5,14,19.47,19.23,13.78,19.23Z" fill="#EA4335" />
    <path d="M11.25,13.5,8.22,18.73h8.56L19.81,14Z" fill="#4285F4" />
  </svg>
);

export default GoogleDriveIcon;
