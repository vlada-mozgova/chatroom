import React, { useState } from "react";
import { chatName } from "../../../helpers/chatName";
import { setNewMessage } from "../../../helpers/setNewMessage";
import { dateHandler } from "../../../helpers/timeHandler";
import attach from "../../../images/attach.png";
import happy from "../../../images/happy.png";
import sent from "../../../images/sent.png";
import { Conversation, File, Message, User } from "../../../redux/types";
import "../../../styles/chat/FrontBar.scss";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { ChatFile } from "./ChatFile";
import { ChatMessage } from "./ChatMessage";
import { ModalFile } from "./ModalFile";
import { ModalSmile } from "./ModalSmile";

interface FrontBarProps {
  full: boolean;
  userId: string;
  chat: Conversation;
}

export const FrontBar: React.FC<FrontBarProps> = ({ full, userId, chat }) => {
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageUrl, setImageAsUrl] = useState("");
  const [file, setFile] = useState("");
  const [text, setText] = useState("");

  const [showSmile, setShowSmile] = useState(false);

  if (file) {
    const message: File = {
      exportedAt: `${new Date().toDateString()} ${new Date().toTimeString()}`,
      file,
      userId,
    };
    setNewMessage(message, chat);
    setFile("");
  }
  const onChange = (e: any) => {
    setText(e.currentTarget.value);
  };

  const onChangeAttach = (e: any) => {
    setImageAsFile(e.currentTarget.files[0]);
    setImageAsUrl(URL.createObjectURL(e.currentTarget.files[0]));
  };

  const handleKeypress = (e: any) => {
    if (e.key === "Enter") {
      onClick();
    }
  };
  const onClick = () => {
    if (text) {
      const message: Message = {
        exportedAt: `${new Date().toDateString()} ${new Date().toTimeString()}`,
        text,
        userId,
      };
      setNewMessage(message, chat);
      setText("");
    }
  };
  const chatname = chatName(chat.imageUrl, chat.title, chat.members, userId);

  return (
    <div className={`frontbar ${full ? "full" : ""}`}>
      {imageAsFile ? (
        <ModalFile
          image={imageAsFile}
          setImageAsFile={setImageAsFile}
          chatId={chat.id}
          imageUrl={imageUrl}
          setFile={setFile}
        />
      ) : null}
      <div className={`frontbar-chat ${full ? "full" : ""}`}>
        <div className="frontbar-message">
          {full ? (
            <p className="frontbar-no-conv">
              Select of create a chat to start conversation
            </p>
          ) : (
            <>
              <div className="frontbar-chat-title">
                <img className="nav-image" src={chatname.imageUrl} alt="" />
                <div>{chatname.title}</div>
              </div>
              <hr className="title-line" />
              {chat.messages?.length
                ? chat.messages.map((message, index) => {
                    const exportedAt = message.exportedAt.toString();
                    let date = dateHandler(exportedAt);
                    if (index >= 1) {
                      if (
                        dateHandler(chat.messages[index - 1].exportedAt) ===
                        dateHandler(exportedAt)
                      ) {
                        date = "";
                      }
                    }
                    let userdata: User = {
                      id: "",
                      firstname: "",
                      email: "",
                      imageUrl: "",
                      createdAt: "",
                      chats: [],
                    };
                    chat.members.forEach((user) => {
                      if (user.id === message.userId) userdata = user;
                    });
                    if ("text" in message)
                      return (
                        <ChatMessage
                          key={exportedAt}
                          name={userdata.firstname}
                          text={message.text}
                          time={exportedAt}
                          date={date}
                          image={userdata.imageUrl}
                        />
                      );
                    else
                      return (
                        <ChatFile
                          key={exportedAt}
                          name={userdata.firstname}
                          file={message.file}
                          time={exportedAt}
                          date={date}
                          image={userdata.imageUrl}
                        />
                      );
                  })
                : null}
            </>
          )}
        </div>
      </div>
      <div className="frontbar-input-message">
        <div className="frontbar-input">
          <Input
            className="attach"
            type="file"
            name="photo"
            onChange={onChangeAttach}
            image={attach}
          />
          <Input
            placeholder="Write a message..."
            className="frontbar"
            name="text"
            value={text}
            onChange={onChange}
            onKeyDown={handleKeypress}
          />
          <div
            onMouseEnter={() => setShowSmile(true)}
            onMouseLeave={() => setShowSmile(false)}
          >
            <img src={happy} className="frontbar-image" alt="" />
            {showSmile ? (
              <ModalSmile showSmile={showSmile} setText={setText} text={text} />
            ) : null}
          </div>
        </div>
        <Button
          className="sent"
          image={sent}
          classNamePic="sent"
          onClick={onClick}
          type="submit"
        />
      </div>
    </div>
  );
};
