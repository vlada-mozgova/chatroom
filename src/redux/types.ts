export interface User {
  id: string;
  firstname: string;
  email: string;
  createdAt: any;
  imageUrl: string;
  chats: Array<Conversation | ConversationDB>;
}
export interface AuthState {
  user: User;
  authenticated: boolean;
  loading: boolean;
  error: string;
  needVerification: boolean;
  success: string;
}

export interface CheckUser {
  user: User;
  status: boolean;
}

export interface UserChats {
  userId: string;
  chatIds: Array<string>;
}

export interface SignUpData {
  firstname: string;
  email: string;
  password: string;
  imageUrl: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface Message {
  exportedAt: any;
  text: string;
  userId: string;
}

export interface File {
  exportedAt: any;
  file: string;
  userId: string;
}

export interface Conversation {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: any;
  members: Array<User>;
  messages: Array<Message | File>;
}
export interface ConversationDB {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: any;
  members: Array<string>;
  messages: Array<Message | File>;
}

export interface ChatState {
  chat: Conversation;
  isNewChatInitiated: boolean;
}
