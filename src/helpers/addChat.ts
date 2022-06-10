import { push, ref, set } from "firebase/database";
import { database } from "../firebase/config";
import defaultPic from "../images/defaultPic.png";
import { File, Message } from "../redux/types";

export const addChat = (members: Array<string>, title?: string) => {
  let chatName: string = "";
  const countOfMembers: number = members.length;
  members.map((member, index) => {
    if (index !== countOfMembers - 1) return (chatName += `${member}, `);
    else return (chatName += member);
  });

  const newChatRef = push(ref(database, "conversation/"));
  set(newChatRef, {
    id: newChatRef.key,
    title: `${title ? title : chatName}`,
    imageUrl: defaultPic,
    createdAt: `${new Date().toDateString()} ${new Date().toTimeString()}`,
    members: members as Array<string>,
    messages: [] as Array<Message | File>,
  });

  return newChatRef.key;
};
