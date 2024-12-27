import React, {Component} from "react";

interface CardComponentProps {
    title?: string,
    children?: any
}

export default class CardComponent extends Component<CardComponentProps> {
    render() {
        return (
            <div className={"shadow-md bg-white dark:bg-gray-500 border rounded-lg overflow-hidden"}>
                {this.props.title && (<div className="flex justify-end p-2 px-4 border-b-2">
                    <div className="w-full m-auto">{this.props.title}</div>
                </div>)}
                {this.props.children}
            </div>
        )
    }
}