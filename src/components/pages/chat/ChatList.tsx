import React from "react";
import { chatName } from "../../../helpers/chatName";
import { Conversation } from "../../../redux/types";
import "../../../styles/chat/ChatBar.scss";

interface ChatListProps {
  chat: Conversation;
  selectChat: (chat: Conversation) => void;
  userId: string;
  chatId: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  userId,
  chatId,
  chat,
  selectChat,
}) => {
  const chatname = chatName(chat.imageUrl, chat.title, chat.members, userId);
  const checked = chat.id === chatId;

  return (
    <div
      className={`chatbar-chat ${checked ? "checked" : ""}`}
      onClick={() => selectChat(chat)}
    >
      <img src={chatname.imageUrl} className="chatbar-image" alt="" />
      <p className="chat-name">{chatname.title}</p>
    </div>
  );
};
