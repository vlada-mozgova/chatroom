import React from "react";
import { useNavigate } from "react-router";
import { Conversation } from "../../../redux/types";
import "../../../styles/chat/ChatBar.scss";
import { ChatList } from "./ChatList";

interface ChatBarProps {
  chats: Array<Conversation>;
  userId: string;
  chatId: string;
}

export const ChatBar: React.FC<ChatBarProps> = ({ chats, userId, chatId }) => {
  const navigate = useNavigate();
  const selectChat = (chat: Conversation) => {
    navigate(`/chat?id=${chat.id}`);
  };

  return (
    <div className="chatbar">
      {chats
        ? chats.map((item) => {
            return (
              <ChatList
                key={item.id}
                userId={userId}
                chat={item}
                chatId={chatId}
                selectChat={selectChat}
              />
            );
          })
        : null}
    </div>
  );
};
