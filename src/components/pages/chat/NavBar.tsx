import React, { Dispatch } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks";
import { userSignOut } from "../../../redux/slices/authSlices";
import "../../../styles/chat/NavBar.scss";
import { AddChat } from "../../svg/AddChat";

interface NavBarProps {
  setShowTitle: Dispatch<React.SetStateAction<boolean>>;
}

export const NavBar: React.FC<NavBarProps> = ({ setShowTitle }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logoutHandler = () => {
    dispatch(userSignOut());
    navigate("/");
  };

  const addChathandler = () => {
    setShowTitle(true);
  };
  return (
    <nav className="nav-panel">
      <div className="nav-text logo">Messenger</div>
      <div className="nav-points">
        <div className="nav-text div">
          <div onClick={addChathandler} className="nav-text">
            <AddChat />
          </div>
        </div>
        <div className="nav-text div">
          <p onClick={logoutHandler} className="nav-text">
            Sign out
          </p>
        </div>
      </div>
    </nav>
  );
};
