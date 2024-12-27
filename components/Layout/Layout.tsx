import { Component } from 'react';
import MenuBarComponent from 'components/Layout/MenuBarComponent';
import Cookies from 'js-cookie';

interface LayoutProps {
  children?: any;
  router: any;
}

export class Layout extends Component<LayoutProps> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    if (!Cookies.get('auth_token')) {
      this.props.router.push('/login');
    }
  }

  render() {
    return (
      <div className={'background h-screen overflow-hidden text-black'}>
        {this.props.router.pathname == '/home' && <MenuBarComponent />}

        <div>{this.props.children}</div>
      </div>
    );
  }
}
