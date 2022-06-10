import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { child, get, ref } from "firebase/database";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, database, db } from "../../firebase/config";
import { loadChatsData } from "../../helpers/loadChats";
import { CheckUser, User } from "../types";

const initialState: Array<CheckUser> = [];

export const getUsers = createAsyncThunk<Array<CheckUser>>(
  "users/getUsers",
  async () => {
    let usersdata: Array<CheckUser> = [];
    const q = query(
      collection(db, "/users"),
      where("uid", "!=", auth.currentUser?.uid)
    );

    const docs = await getDocs(q);

    await Promise.all(
      docs.docs.map(async (doc) => {
        let chatIds: Array<string> = [];

        await get(child(ref(database), `users/${doc.data().uid}`)).then(
          (snapshot) => {
            if (snapshot.exists()) chatIds = snapshot.val().chatIds;
          }
        );
        const data: User = {
          id: doc.data().uid,
          firstname: doc.data().firstname,
          email: doc.data().email,
          imageUrl: doc.data().imageUrl,
          createdAt: doc.data().createdAt,
          chats: [],
        };
        if (chatIds) data.chats = await loadChatsData(chatIds);
        usersdata.push({ user: data, status: false });
      })
    );

    return usersdata;
  }
);

export const setUsers = createAsyncThunk<Array<CheckUser>, Array<CheckUser>>(
  "users/setUsers",
  async (usersList) => {
    return usersList;
  }
);
export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getUsers.fulfilled,
      (state: Array<CheckUser>, { payload }) => {
        return payload;
      }
    );
    builder.addCase(
      setUsers.fulfilled,
      (state: Array<CheckUser>, { payload }) => {
        return payload;
      }
    );
  },
});

export default usersSlice.reducer;
