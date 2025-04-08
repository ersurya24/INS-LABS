import React from "react";

const CRMLogo = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex items-center text-black px-4 py-3">
        <div className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div className="font-bold tracking-wider text-lg">
          <span>CRM</span>
          <span className="font-light ml-1">SYSTEM</span>
        </div>
      </div>
    </div>
  );
};

export default CRMLogo;
