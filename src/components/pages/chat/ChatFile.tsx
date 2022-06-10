import React from "react";
import { timeHandler } from "../../../helpers/timeHandler";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import "../../../styles/chat/ChatMessage.scss";

interface ChatFileProps {
  name: string;
  file: string;
  time: string;
  date: string;
  image: string;
}

export const ChatFile: React.FC<ChatFileProps> = ({
  name,
  file,
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
        <div className={`chat-message file ${user ? "user" : "friend"}`}>
          {!user ? <div className="message-name file">{name}</div> : null}
          <div className="message-data file">
            <img
              src={file}
              className={`send-file ${user ? "user" : "friend"}`}
              alt=""
            />
            <div className="message-time file">{timeHandler(time)}</div>
          </div>
        </div>
      </div>
    </>
  );
};
