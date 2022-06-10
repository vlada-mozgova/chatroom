import React, { Dispatch } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { createChat } from "../../../redux/slices/chatSlices";
import { setUsers } from "../../../redux/slices/usersSlices";
import { CheckUser, Conversation, User } from "../../../redux/types";
import "../../../styles/chat/ModalTitle.scss";
import { Button } from "../../shared/Button";
import { Checkbox } from "../../shared/CheckBox";

interface ModalMembersProps {
  user: User;
  chatId: string;
  onClickBefore: () => void;
  showMembers: boolean;
  setShowMembers: Dispatch<React.SetStateAction<boolean>>;
  usersList: CheckUser[];
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  members: Array<User>;
  setMembers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const ModalMembers: React.FC<ModalMembersProps> = ({
  user,
  chatId,
  onClickBefore,
  showMembers,
  setShowMembers,
  usersList,
  title,
  setTitle,
  members,
  setMembers,
}) => {
  const dispatch = useAppDispatch();

  const onClickReset = () => {
    setShowMembers(false);
  };

  const selectUser = (selectedUser: User) => {
    const temp = usersList.map((item) =>
      item.user.id === selectedUser.id
        ? { ...item, status: !item.status }
        : item
    );
    dispatch(setUsers(temp));
    const users: Array<User> = [user];
    temp.forEach((user) => {
      if (user.status) users.push(user.user);
    });

    setMembers(users);
  };
  const onClickCreate = () => {
    const chats = user.chats as Array<Conversation>;
    dispatch(createChat({ title, members, chats }));

    setTitle("");
    setMembers([]);
    onClickReset();
  };
  return (
    <div
      className={`modal-title ${showMembers ? "show" : ""}`}
      onClick={onClickReset}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-title-content members"
      >
        <div className="modal-title-header">Add members</div>
        <hr className="line-members" />
        <div className="modal-title-body members">
          {usersList
            ? usersList.map((user) => (
                <Checkbox
                  key={user.user.id}
                  user={user.user}
                  selectUser={selectUser}
                  status={user.status}
                />
              ))
            : null}
        </div>
        <hr className="line-members" />
        <div className="modal-title-footer members">
          <Button
            text="Cancel"
            type="reset"
            onClick={onClickBefore}
            className="button-modal"
          />
          <Button
            text="Create"
            type="submit"
            onClick={onClickCreate}
            className="button-modal"
          />
        </div>
      </div>
    </div>
  );
};
