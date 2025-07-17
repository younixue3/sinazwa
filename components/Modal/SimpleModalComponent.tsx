import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import ButtonComponent from 'components/Button/ButtonComponent';

interface SimpleModalComponentProps {
  text?: string;
  color?: string;
  children?: React.ReactNode;
  title?: string;
  opened: boolean;
  onClose: () => void;
  removeButton?: boolean;
  onClick?: () => void;
}

export default function SimpleModalComponent({
  text,
  color,
  children,
  title,
  opened,
  onClose,
  removeButton = false,
  onClick
}: SimpleModalComponentProps) {
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
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="hidden md:block bg-white dark:bg-gray-500 p-6 rounded-xl w-2/3 max-w-4xl max-h-[90vh]">
            <div className="flex justify-between w-full items-center mb-4">
              <h2 className="text-xl w-full font-semibold">{title}</h2>
              <button
                className="bg-gray-100 hover:bg-gray-200 text-black h-10 w-10 rounded-full flex items-center justify-center transition-colors ml-4"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div>{children}</div>
          </div>
          <div className="block md:hidden bg-white dark:bg-gray-500 p-6 rounded-xl w-2/3 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between w-full items-center mb-4">
              <h2 className="text-xl w-full font-semibold">{title}</h2>
              <button
                className="bg-gray-100 hover:bg-gray-200 text-black h-10 w-10 rounded-full flex items-center justify-center transition-colors ml-4"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div>{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
