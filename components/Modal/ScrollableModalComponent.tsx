import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import ButtonComponent from 'components/Button/ButtonComponent';

interface ScrollableModalComponentProps {
  text?: string;
  color?: string;
  children?: React.ReactNode;
  title?: string;
  opened: boolean;
  onClose: () => void;
  removeButton?: boolean;
  onClick?: () => void;
  maxWidth?: string;
}

export default function ScrollableModalComponent({
  text,
  color,
  children,
  title,
  opened,
  onClose,
  removeButton = false,
  onClick,
  maxWidth = 'max-w-4xl'
}: ScrollableModalComponentProps) {
  return (
    <>
      {!removeButton && (
        <ButtonComponent
          text={text}
          color={color}
          onClick={() => {
            if (onClick) {
              onClick();
            }
          }}
        />
      )}
      
      {opened && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-gray-500 rounded-xl w-full ${maxWidth} max-h-[80vh] flex flex-col shadow-2xl`}>
            {/* Header dengan close button di kiri */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>

              <button
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 h-10 w-10 rounded-full flex items-center justify-center transition-colors mr-4"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            
            {/* Content area yang bisa di-scroll dengan max height */}
            <div className="overflow-y-auto flex-grow p-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}