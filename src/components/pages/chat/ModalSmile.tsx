import Picker from "emoji-picker-react";
import React, { Dispatch } from "react";
import "../../../styles/chat/ModalSmile.scss";

interface ModalSmileProps {
  showSmile: boolean;
  setText: Dispatch<React.SetStateAction<string>>;
  text: string;
}

export const ModalSmile: React.FC<ModalSmileProps> = ({
  showSmile,
  setText,
  text,
}) => {
  const onEmojiClick = (event: any, emojiObject: any) => {
    setText(text + emojiObject.emoji);
  };
  return (
    <div className={`modal-smile-content ${showSmile ? "show" : ""}`}>
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
};
