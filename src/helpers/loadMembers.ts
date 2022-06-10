import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { User } from "../redux/types";

export const loadMembersIds = (members: Array<User>) => {
  const membersIds: Array<string> = [];
  members.forEach((user: User) => {
    membersIds.push(user.id);
  });
  return membersIds;
};

export const loadMembersData = async (membersIds: Array<string>) => {
  const members: Array<User> = [];
  await Promise.all(
    membersIds.map(async (user) => {
      const q = query(collection(db, "/users"), where("uid", "==", user));
      const docs = await getDocs(q);
      docs.docs.forEach((doc) => {
        const user: User = {
          id: doc.data().uid,
          firstname: doc.data().firstname,
          email: doc.data().email,
          imageUrl: doc.data().imageUrl,
          createdAt: doc.data().createdAt,
          chats: [],
        };
        members.push(user);
      });
    })
  );
  return members;
};
