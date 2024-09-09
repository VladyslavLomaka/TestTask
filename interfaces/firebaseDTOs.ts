interface User {
  uid: string;
  email: string;
  nickname: string;
  chatIds: number[];
}

interface Message {
  chatId: string;
  fromUserId: string;
  content: string;
  createdAt: string;
}

interface Chat {
  uid: string;
  users: Record<string, string>;
  messages: Message[];
  name: string;
}
