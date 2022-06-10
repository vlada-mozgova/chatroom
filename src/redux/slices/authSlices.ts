import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, database, db, googleProvider } from "../../firebase/config";
import { loadChatsData } from "../../helpers/loadChats";
import { loadMembersData } from "../../helpers/loadMembers";
import { signInAction } from "../../helpers/signInAction";
import defaultPic from "../../images/defaultPic.png";
import {
  AuthState,
  Conversation,
  SignInData,
  SignUpData,
  User,
} from "../types";

const user: User = {
  id: "",
  firstname: "",
  email: "",
  createdAt: "",
  imageUrl: "",
  chats: [],
};
const initialState: AuthState = {
  user,
  authenticated: false,
  loading: false,
  error: "",
  needVerification: false,
  success: "",
};

export const updateUser = createAsyncThunk<Array<Conversation>, Array<string>>(
  "auth/updateUser",
  async (chatIds) => {
    const chats = await loadChatsData(chatIds);
    const updatedChats = Array<Conversation>();
    await Promise.all(
      chats.map(async (chat) => {
        const members = await loadMembersData(chat.members as string[]);
        updatedChats.push({ ...chat, members: members });
      })
    );
    return updatedChats;
  }
);

export const userSignUp = createAsyncThunk<User, SignUpData>(
  "auth/signUp",
  async (data) => {
    const res = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    if (data.imageUrl === "") data.imageUrl = defaultPic;

    const userData: User = {
      id: res.user.uid,
      email: data.email,
      firstname: data.firstname,
      createdAt: new Date().toDateString(),
      imageUrl: data.imageUrl,
      chats: [],
    };

    await addDoc(collection(db, "/users"), {
      uid: userData.id,
      firstname: userData.firstname,
      authProvider: "local",
      email: userData.email,
      imageUrl: userData.imageUrl,
      createdAt: serverTimestamp(),
    });

    const newChatRef = ref(database, `users/${userData.id}`);
    set(newChatRef, {
      chatIds: Array<string>(),
    });

    await sendEmailVerification(res.user);
    return userData;
  }
);

export const userSignIn = createAsyncThunk<User, SignInData>(
  "auth/signIn",
  async (data) => {
    const rez = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    return await signInAction(rez);
  }
);

export const userSignInGoogle = createAsyncThunk<User>(
  "auth/signInGoogle",
  async () => {
    const res = await signInWithPopup(auth, googleProvider);

    return await signInAction(res);
  }
);

export const userSignOut = createAsyncThunk("auth/signOut", async () => {
  await signOut(auth);
});

export const sendPasswordReset = createAsyncThunk<
  string,
  { email: string; successMsg: string }
>("auth/sendPasswordReset", async ({ email, successMsg }) => {
  await sendPasswordResetEmail(auth, email);
  return successMsg;
});

const userRejected = (
  state: AuthState,
  { error }: { error: SerializedError }
) => {
  return { ...state, error: error.message || "", loading: false };
};
const userPending = (state: AuthState) => {
  return { ...state, loading: true };
};

const fetchUser = (state: AuthState, { payload }: { payload: User }) => {
  return {
    ...state,
    authenticated: true,
    user: payload,
  };
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setErrorSlice: (state, action) => {
      state.error = action.payload;
    },
    needVerificationSlice: (state, action) => {
      state.needVerification = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUser.fulfilled, (state: AuthState, { payload }) => {
      const user = { ...state.user, chats: payload };
      return { ...state, user: user };
    });
    builder.addCase(userSignOut.fulfilled, (state: AuthState) => {
      return initialState;
    });
    builder.addCase(userSignUp.rejected, userRejected);
    builder.addCase(userSignUp.pending, userPending);
    builder.addCase(userSignUp.fulfilled, (state: AuthState, { payload }) => {
      return {
        ...state,
        needVerification: true,
        authenticated: true,
        user: payload,
      };
    });

    builder.addCase(userSignIn.rejected, userRejected);
    builder.addCase(userSignIn.pending, userPending);
    builder.addCase(userSignIn.fulfilled, fetchUser);

    builder.addCase(sendPasswordReset.rejected, userRejected);
    builder.addCase(sendPasswordReset.pending, userPending);
    builder.addCase(
      sendPasswordReset.fulfilled,
      (state: AuthState, { payload }) => {
        return { ...state, success: payload };
      }
    );

    builder.addCase(userSignInGoogle.rejected, userRejected);
    builder.addCase(userSignInGoogle.pending, userPending);
    builder.addCase(userSignInGoogle.fulfilled, fetchUser);
  },
});

export const { setErrorSlice, needVerificationSlice } = authSlice.actions;

export default authSlice.reducer;
