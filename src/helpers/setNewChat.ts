import { ref, set } from "firebase/database";
import { database } from "../firebase/config";
import { Conversation, User } from "../redux/types";
import { loadChatsIds } from "./loadChats";

export const setNewChat = (members: User[], chatId: string) => {
  members.forEach((user) => {
    let chatIds: string[] = [];

    if (user.chats) chatIds = loadChatsIds(user.chats as Conversation[]);
    if (!chatIds.includes(chatId)) chatIds.push(chatId);

    set(ref(database, `users/${user.id}`), {
      chatIds,
    });
  });
};
