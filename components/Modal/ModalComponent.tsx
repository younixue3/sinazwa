import React, { Component } from 'react';
import ButtonComponent from 'components/Button/ButtonComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface ModalComponentProps {
  text: any;
  color?: string;
  children?: any;
  title?: string;
  opened?: any;
  removeButton?: boolean;
  modalToggle?: any;
  ref?: any;
  onClick?: () => void;
}

interface ModalComponentState {
  openModal: boolean;
}

export class ModalComponent extends Component<
  ModalComponentProps,
  ModalComponentState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      openModal: false
    };
  }

  modalToggle = () => {
    this.setState({ openModal: !this.state.openModal });
  };

  componentDidUpdate(
    prevProps: Readonly<ModalComponentProps>,
    prevState: Readonly<ModalComponentState>,
    snapshot?: any
  ) {
    if (prevProps.opened !== this.props.opened) {
      this.setState({ openModal: true });
    }
  }

  render() {
    return (
      <>
        <div className={''}>
          {!this.props.removeButton && (
            <ButtonComponent
              text={this.props.text}
              color={this.props.color}
              onClick={() => {
                this.modalToggle();
                if (this.props['onClick']) {
                  this.props.onClick();
                }
              }}
            />
          )}
          {this.state.openModal && (
            <div
              className={
                'flex absolute left-0 top-0 bg-black h-screen w-screen z-50 bg-gray-800/20 backdrop-blur-sm'
              }
            >
              <div
                className={
                  'w-[90%] md:w-[50%] bg-white dark:bg-gray-500 p-3 rounded-xl m-auto'
                }
              >
                <div className={'flex justify-between'}>
                  <span className={'w-full'}>{this.props.title}</span>
                  <button
                    className={
                      'bg-white dark:bg-gray-400 hover:bg-gray-200 text-black h-10 w-10'
                    }
                    onClick={this.modalToggle}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
                <div className={'p-3'}>{this.props.children}</div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}
