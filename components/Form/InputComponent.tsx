import { ChangeEvent, Component } from 'react';

interface InputComponentProps {
  label?: string;
  type?: string;
  placeholder?: string;
  error?: any;
  register?: any;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default class InputComponent extends Component<InputComponentProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: null
    };
  }

  render() {
    return (
      <>
        <div className={'flex w-full flex-col'}>
          <label className={'text-sm'}>{this.props.label}</label>
          <div>
            <input
              type={this.props.type}
              {...this.props.register}
              placeholder={this.props.placeholder}
              value={this.props.value}
              className={`border rounded-lg p-3 text-black text-sm ${this.props.type !== 'checkbox' && 'w-full'} ${this.props.error ? 'border-red-600' : 'border-gray-200'}`}
            />
          </div>
          <p className={'text-red-500 text-xs'}>{this.props.error}</p>
        </div>
      </>
    );
  }
}
