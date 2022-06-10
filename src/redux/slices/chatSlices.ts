import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { child, get, ref } from "firebase/database";
import { database } from "../../firebase/config";
import { addChat } from "../../helpers/addChat";
import { compareArrays } from "../../helpers/compareArrays";
import { loadChatsData } from "../../helpers/loadChats";
import { loadMembersData, loadMembersIds } from "../../helpers/loadMembers";
import { setNewChat } from "../../helpers/setNewChat";
import { ChatState, Conversation, ConversationDB, User } from "../types";

const chat: Conversation = {
  id: "",
  title: "",
  imageUrl: "",
  createdAt: "",
  members: [],
  messages: [],
};

const initialState: ChatState = {
  chat,
  isNewChatInitiated: false,
};

export const initialNewChat = createAsyncThunk(
  "chat/initialNewChat",
  async () => {}
);

export const loadChat = createAsyncThunk<Conversation, ConversationDB>(
  "chat/loadChat",
  async (chatDb) => {
    const membersData = await loadMembersData(chatDb.members);
    const chat: Conversation = { ...chatDb, members: membersData };

    return chat;
  }
);

export const createChat = createAsyncThunk<
  Conversation,
  { title?: string; members: Array<User>; chats: Array<Conversation> }
>("chat/createChat", async ({ members, chats, title }) => {
  let chat: Conversation = {
    id: "",
    title: "",
    imageUrl: "",
    createdAt: "",
    members: [],
    messages: [],
  };
  const membersIds = loadMembersIds(members);

  const dbRef = ref(database);
  if (chats) {
    await Promise.all(
      chats.map(
        async (chatID) =>
          await get(child(dbRef, "conversation/" + chatID.id)).then(
            (snapshot) => {
              if (snapshot.exists()) {
                const equals = compareArrays(
                  snapshot.val().members,
                  membersIds
                );

                if (equals) {
                  chat = { ...snapshot.val(), members: members };
                }
              }
            }
          )
      )
    );
  }

  if (chat.id === "") {
    const newChatId = addChat(membersIds, title) as string;

    await get(child(dbRef, `conversation/${newChatId}`)).then((snapshot) => {
      chat = { ...snapshot.val(), members: members };
    });

    setNewChat(members, chat.id);
  }

  return chat;
});

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createChat.fulfilled, (state: ChatState, { payload }) => {
      return { chat: payload, isNewChatInitiated: true };
    });
    builder.addCase(createChat.rejected, (state: ChatState, { error }) => {
      console.log(error);
    });
    builder.addCase(loadChat.fulfilled, (state: ChatState, { payload }) => {
      return { ...state, chat: payload };
    });
    builder.addCase(loadChat.rejected, (state: ChatState, { error }) => {
      console.log(error);
    });
    builder.addCase(initialNewChat.fulfilled, (state: ChatState) => {
      return { ...state, isNewChatInitiated: false };
    });
  },
});
export default chatSlice.reducer;
