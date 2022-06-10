import React from "react";
import { getListOfActiveUsers } from "../../../helpers/getListOfActiveUsers";
import { useAppDispatch } from "../../../redux/hooks";
import { createChat } from "../../../redux/slices/chatSlices";
import { Conversation, User } from "../../../redux/types";
import "../../../styles/chat/SideBar.scss";
import { ChatMember } from "./ChatMember";

interface SideBarProps {
  user: User;
  chat: Conversation;
}

export const SideBar: React.FC<SideBarProps> = ({ user, chat }) => {
  const dispatch = useAppDispatch();
  const members = getListOfActiveUsers(chat.members);

  const selectUser = (newuser: User) => {
    const chats = user.chats as Array<Conversation>;
    const members: Array<User> = [user, newuser];
    if (newuser.id !== user.id) {

      dispatch(createChat({ members, chats }));
    }
  };

  let countOfMembers = members.length;

  return (
    <div className="sidebar">
      <div className="sidebar-members">
        {countOfMembers} chat member{countOfMembers === 1 ? null : "s"}
      </div>
      <div className="sidebar-list">
        {members
          ? members.map((user: User) => (
              <ChatMember key={user.id} user={user} selectUser={selectUser} />
            ))
          : null}
      </div>
    </div>
  );
};
