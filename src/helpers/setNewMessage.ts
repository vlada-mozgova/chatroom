import { ref, set } from "firebase/database";
import { database } from "../firebase/config";
import { Conversation, File, Message } from "../redux/types";
import { loadMembersIds } from "./loadMembers";

export const setNewMessage = (message: Message | File, chat: Conversation) => {
  let messages = chat.messages;
  if (!messages) messages = [];

  const members = loadMembersIds(chat.members);
  messages = [...messages, message];

  set(ref(database, `conversation/${chat.id}`), {
    ...chat,
    members,
    messages,
  });
};
