/* eslint-disable react-hooks/exhaustive-deps */
import { off, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "../../../App";
import { database } from "../../../firebase/config";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { updateUser } from "../../../redux/slices/authSlices";
import { initialNewChat, loadChat } from "../../../redux/slices/chatSlices";
import { getUsers } from "../../../redux/slices/usersSlices";
import { Conversation, Message, User } from "../../../redux/types";
import "../../../styles/chat/ChatPage.scss";
import { ChatBar } from "./ChatBar";
import { FrontBar } from "./FrontBar";
import { ModalMembers } from "./ModalMembers";
import { ModalTitle } from "./ModalTitle";
import { NavBar } from "./NavBar";
import { SideBar } from "./SideBar";

export const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const stateAuth = useAppSelector((state) => state.auth);
  const stateChat = useAppSelector((state) => state.chat);
  const usersList = useAppSelector((state) => state.usersList);

  const navigate = useNavigate();

  const query = useQuery();
  const currentChatID = query.get("id");

  const [chat, setChat] = useState({
    id: "",
    title: "",
    imageUrl: "",
    createdAt: "",
    members: Array<string>(),
    messages: Array<Message>(),
  });

  useEffect(() => {
    if (currentChatID) {
      const dbRef = ref(database, `conversation/${currentChatID}`);

      onValue(dbRef, (snapshot) => {
        setChat(snapshot.val());
        navigate(`/chat?id=${snapshot.val().id}`);
      });
      return () => off(dbRef);
    }
  }, [dispatch, currentChatID]);

  useEffect(() => {
    dispatch(loadChat(chat));
  }, [dispatch, chat]);

  useEffect(() => {
    if (stateChat.isNewChatInitiated) {
      onValue(ref(database, `users/${stateAuth.user.id}`), (snapshot) => {
        if (snapshot.exists()) dispatch(updateUser(snapshot.val().chatIds));
      });

      dispatch(initialNewChat());
      return () => off(ref(database, `users/`));
    }
  }, [dispatch, stateChat.isNewChatInitiated, stateChat.chat]);

  useEffect(() => {
    if (!stateChat.chat.id) navigate(`/chat?id=${currentChatID}`);
    else navigate(`/chat?id=${stateChat.chat.id}`);
  }, [navigate, stateChat.chat.id]);

  const [showTitle, setShowTitle] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState(Array<User>());

  const onClickNext = () => {
    if (title) {
      setShowTitle(false);
      setShowMembers(true);
      dispatch(getUsers());
    }
  };
  const onClickBefore = () => {
    setShowMembers(false);
    setShowTitle(true);
  };

  return (
    <div className="chat-page">
      <NavBar setShowTitle={setShowTitle} />
      <ChatBar
        chats={stateAuth.user.chats as Array<Conversation>}
        userId={stateAuth.user.id}
        chatId={stateChat.chat.id}
      />
      <FrontBar
        full={!currentChatID}
        userId={stateAuth.user.id}
        chat={stateChat.chat}
      />
      {!currentChatID ? null : (
        <SideBar user={stateAuth.user} chat={stateChat.chat} />
      )}
      <ModalTitle
        showTitle={showTitle}
        setShowTitle={setShowTitle}
        onClickNext={onClickNext}
        title={title}
        setTitle={setTitle}
      />
      <ModalMembers
        user={stateAuth.user}
        chatId={stateChat.chat.id}
        usersList={usersList}
        showMembers={showMembers}
        setShowMembers={setShowMembers}
        onClickBefore={onClickBefore}
        title={title}
        setTitle={setTitle}
        members={members}
        setMembers={setMembers}
      />
    </div>
  );
};
