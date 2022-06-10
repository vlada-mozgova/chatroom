import React from "react";
import { User } from "../../redux/types";

interface CheckboxProps {
  user: User;
  selectUser: (user: User) => void;
  status: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  user,
  status,
  selectUser,
}) => {
  const onChange = () => {
    selectUser(user);
  };
  return (
    <div onClick={onChange} className="checkbox-user">
      <input type="checkbox" checked={status} onChange={onChange} />
      <span className="geekmark">
        <img src={user.imageUrl} alt="" className="checkbox-image" />
      </span>
      <label className="checkbox-user-name">{user.firstname}</label>
    </div>
  );
};
