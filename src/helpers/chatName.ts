import { User } from "../redux/types";

interface ChatName {
  imageUrl: string;
  title: string;
}

export const chatName = (
  imageUrl: string,
  title: string,
  members: Array<User>,
  userId: string
) => {
  const chatname: ChatName = {
    imageUrl: imageUrl,
    title: title,
  };

  if (members.length === 2) {
    members.forEach((user) => {
      if (user.id !== userId) {
        chatname.imageUrl = user.imageUrl;
        chatname.title = user.firstname;
      }
    });
  }
  return chatname;
};
