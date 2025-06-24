import React from 'react';

interface ButtonComponentProps {
  form?: string;
  text?: string;
  color: string;
  dropdown?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  form,
  text,
  color,
  dropdown = false,
  children,
  onClick,
  type = 'submit',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const themeButton = `rounded-md py-1.5 m-auto px-2 transition ease-in-out ${color}`;

  const handleDropdownToggle = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="flex m-auto relative w-full">
      <button
        form={form}
        type={type}
        className={themeButton}
        onClick={dropdown ? handleDropdownToggle : onClick}
        disabled={disabled}
      >
        {text}
      </button>

      {dropdown && (
        <div id="dropdown">
          <div
            className={`flex flex-col gap-1 text-sm absolute overflow-hidden bg-white right-0 shadow-md rounded-lg transition-all ease-in-out duration-400 z-50 ${
              isOpen
                ? 'top-0 border max-h-[40rem] p-1'
                : 'top-3 max-w-0 max-h-0'
            }`}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonComponent;
