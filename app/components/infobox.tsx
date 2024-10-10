import React from "react";

interface InfoboxProps {
  message: string;
  type: "error" | "info" | "success";
}

const Infobox = ({ message, type }: InfoboxProps) => {
  const typeColor = {
    error: "red",
    info: "slate",
    success: "teal",
  };

  return (
    <div
      className={`border-l-4 p-4 bg-${typeColor[type]}-50 border-${typeColor[type]}-400`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className={`h-5 w-5 text-${typeColor[type]}-400`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className={`text-sm text-${typeColor[type]}-700`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Infobox;
