import React from "react";
import { timeHandler } from "../../../helpers/timeHandler";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import "../../../styles/chat/ChatMessage.scss";

interface ChatMessageProps {
  name: string;
  text: string;
  time: string;
  date: string;
  image: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  name,
  text,
  time,
  date,
  image,
}) => {
  const state = useAppSelector((state: RootState) => state.auth);
  const user = name === state.user?.firstname;

  return (
    <>
      {date ? <div className="date-message">{date} </div> : null}
      <div className={`user-message ${user ? "user" : "friend"}`}>
        {!user ? <img src={image} className="message-image" alt="" /> : null}
        <div className={`chat-message ${user ? "user" : "friend"}`}>
          {!user ? <div className="message-name">{name}</div> : null}
          <div className="message-data">
            <div className="message-text">{text}</div>
            <div className="message-time">{timeHandler(time)}</div>
          </div>
        </div>
      </div>
    </>
  );
};
