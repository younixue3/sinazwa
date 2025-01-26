import { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const AccordionComponent = ({ title, children, className }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-lg mb-2 ${className || ''}`}>
      <button
        className="w-full p-4 text-left font-medium flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`px-4 pb-4 ${
          isOpen ? 'block' : 'hidden'
        } transition-all duration-200`}
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionComponent;
