import React, { useEffect } from "react";
import "./Modal.scss";
import Portal from "~/components/layout/portal/Portal";

export interface IModalProps {
  isOpen: boolean,
  showCloseButton?: boolean,
  header?: string | React.ReactNode,
  width?: number,
  controls?: React.ReactNode,
  theme?: ModalTheme,
  onCloseButtonClicked?(): void,
  children: React.ReactNode,
}

export enum ModalTheme {
  Normal = "modal",
  Error = "modal error",
}

const Modal: React.FC<IModalProps> = (props) => {
  useEffect(() => {
    let pageOffset = window.pageYOffset;

    if (props.isOpen) {
      document.body.style.top = `-${pageOffset}px`;
      document.body.classList.add('has-open-modal');
    }

    return () => {
      document.body.classList.remove('has-open-modal');
      document.body.style.removeProperty('top');
      window.scrollTo(0, pageOffset || 0);
    };
  }, [props.isOpen]);

  if (!props.isOpen) {
    return null;
  }

  return (
    <Portal>
      <div className="modal-fade"></div>
      <div className={props.theme || ModalTheme.Normal} style={{ width: props.width }}>
        {(!!props.header || !!props.onCloseButtonClicked) && (
          <div className="top">
            <span className="header">
              {props.header}
            </span>
            {props.showCloseButton &&
              <span className="close"
                onClick={props.onCloseButtonClicked}>x</span>
            }
          </div>
        )}
        <div className="middle">
          {props.children}
        </div>
        {props.controls &&
          <div className="bottom">
            {props.controls}
          </div>
        }
      </div>
    </Portal>
  );
}

export default Modal;