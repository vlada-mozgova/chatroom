import { child, get, ref } from "firebase/database";
import { database } from "../firebase/config";
import { Conversation, ConversationDB } from "../redux/types";

export const loadChatsIds = (chats: Array<Conversation>) => {
  const chatIds: Array<string> = [];
  chats.map((chat) => chatIds.push(chat.id));
  return chatIds;
};

export const loadChatsData = async (chatIds: Array<string>) => {
  const chats: Array<ConversationDB> = [];
  await Promise.all(
    chatIds.map(async (chatID) => {
      await get(child(ref(database), "conversation/" + chatID)).then(
        async (snapshot) => {
          if (snapshot.exists()) {
            const chat: ConversationDB = snapshot.val();
            chats.push(chat);
          }
        }
      );
    })
  );
  return chats;
};
