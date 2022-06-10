import React, { Dispatch } from "react";
import defaultPic from "../../../images/defaultPic.png";
import "../../../styles/chat/ModalTitle.scss";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";

interface ModalTitleProps {
  showTitle: boolean;
  setShowTitle: Dispatch<React.SetStateAction<boolean>>;
  onClickNext: () => void;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

export const ModalTitle: React.FC<ModalTitleProps> = ({
  showTitle,
  setShowTitle,
  onClickNext,
  title,
  setTitle,
}) => {
  const onClickReset = () => {
    setShowTitle(false);
  };
  const onChange = (e: any) => {
    setTitle(e.currentTarget.value);
  };
  return (
    <div
      className={`modal-title ${showTitle ? "show" : ""}`}
      onClick={onClickReset}
    >
      <div onClick={(e) => e.stopPropagation()} className="modal-title-content">
        <div className="modal-title-body">
          <img src={defaultPic} alt="" className="title-photo" />
          <Input
            name="title"
            onChange={onChange}
            type="text"
            value={title}
            className="title-name"
            placeholder="Group name"
          />
        </div>
        <div className="modal-title-footer">
          <Button
            text="Cancel"
            type="reset"
            onClick={onClickReset}
            className="button-modal"
          />
          <Button
            text="Next"
            type="submit"
            onClick={onClickNext}
            className="button-modal"
          />
        </div>
      </div>
    </div>
  );
};
