import React from "react";
import { User } from "../../../redux/types";
import "../../../styles/chat/SideBar.scss";

interface ChatMemberProps {
  user: User;
  selectUser: (user: User) => void;
}

export const ChatMember: React.FC<ChatMemberProps> = ({ user, selectUser }) => {
  return (
    <div className="sidebar-user" onClick={() => selectUser(user)}>
      <img src={user.imageUrl} className="sidebar-image" alt="" />
      <p className="user-name">{user.firstname}</p>
    </div>
  );
};
