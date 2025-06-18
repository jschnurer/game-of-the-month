import React from "react";
import ReactDOM from "react-dom";
import { portalRoot } from "~/main";

interface IPortalProps {
  children: React.ReactNode,
}

export default class Portal extends React.Component<IPortalProps> {
  element: HTMLDivElement;

  constructor(props: any) {
    super(props);
    this.element = document.createElement("div");
  }

  componentDidMount = () => {
    portalRoot.appendChild(this.element);
  };

  componentWillUnmount = () => {
    portalRoot.removeChild(this.element);
  };

  render() {
    const { children } = this.props;
    return ReactDOM.createPortal(children, this.element);
  }
}