import {Component} from "react";
import {Each} from "helper/Each";

interface TabComponentProps {
    tab: object,
    children: any
}

export default class TabComponent extends Component<TabComponentProps, {activeTab:any}> {
    constructor(props:any) {
        super(props);
        this.state = {
            activeTab : 0
        }
    }
    ChooseTab = (tab:any) => {
        this.setState({activeTab: tab})
    }
    render() {
        return (
            <>
                <div className={'w-full flex justify-center border-b'}>
                    <Each of={this.props.tab} render={(item: any, index: any) =>
                        <>
                            <button onClick={() => {this.ChooseTab(index)}} className={'bg-transparent border-b-4 font-medium pt-2 px-2 rounded-none p-0 m-0 transition-all text-sm ' + (index === this.state.activeTab ? 'dark:border-white border-blue-900' : 'dark:border-gray-700 border-white' )}>{item}</button>
                        </>
                    }>
                    </Each>
                </div>
                <div className={'h-full'}>
                    {this.props.children[this.state.activeTab]}
                </div>
            </>
        );
    }
}