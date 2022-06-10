import { auth } from "../firebase/config";
import { User } from "../redux/types";

export const getListOfActiveUsers = (members: Array<User>) => {
  let activeUsers: Array<User> = [];
  members.forEach((user) => {
    if (user.id === auth.currentUser?.uid) activeUsers.unshift(user);
    else activeUsers.push(user);
  });
  return activeUsers;
};
