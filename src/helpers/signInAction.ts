import { UserCredential } from "firebase/auth";
import { child, get, ref, set } from "firebase/database";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { database, db } from "../firebase/config";
import { ConversationDB, User } from "../redux/types";
import { loadChatsData } from "./loadChats";
import { loadMembersData } from "./loadMembers";

export const signInAction = async (res: UserCredential) => {
  const userData: User = {
    id: "",
    firstname: "",
    email: "",
    createdAt: "",
    imageUrl: "",
    chats: Array<ConversationDB>(),
  };
  let chatIds: Array<string> = [];

  const q = query(collection(db, "/users"), where("uid", "==", res.user.uid));
  const docs = await getDocs(q);
  if (docs.docs.length === 0) {
    await addDoc(collection(db, "/users"), {
      uid: res.user.uid,
      firstname: res.user.displayName,
      authProvider: "google",
      email: res.user.email,
      imageUrl: res.user.photoURL,
      createdAt: serverTimestamp(),
    });

    const newChatRef = ref(database, `users/${res.user.uid}`);
    set(newChatRef, {
      chats: Array<string>(),
    });
  } else {
    await get(child(ref(database), `users/${res.user.uid}`)).then(
      (snapshot) => {
        if (snapshot.exists()) chatIds = snapshot.val().chatIds;
      }
    );
    docs.docs.forEach((doc) => {
      userData.id = doc.data().uid;
      userData.firstname = doc.data().firstname;
      userData.email = doc.data().email;
      userData.imageUrl = doc.data().imageUrl;
      userData.createdAt = doc.data().createdAt;
    });
  }
  if (chatIds) {
    userData.chats = await loadChatsData(chatIds);
    await Promise.all(
      userData.chats.map(async (chat) => {
        const members = await loadMembersData(chat.members as string[]);
        chat.members = members;
      })
    );
  }

  return userData;
};
