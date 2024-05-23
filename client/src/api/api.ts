export function login(data: { email: string; password: string }) {
  return fetch("http://localhost:3000/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    credentials: "include",
  });
}

export function signup(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  return fetch("http://localhost:3000/signup", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
}

export function getMessages(chatId: string, page: number) {
  return fetch(`http://localhost:3000/chats/${chatId}/messages?page=${page}`, {
    mode: "cors",
    credentials: "include",
  });
}

export function searchMessages(chatId: string, query: string, page: number) {
  return fetch(
    `http://localhost:3000/chats/${chatId}/messages?query=${query}&page=${page}`,
    {
      mode: "cors",
      credentials: "include",
    }
  );
}

export function deleteMessage(chatId: string, messageId: string) {
  return fetch(`http://localhost:3000/chats/${chatId}/messages/${messageId}`, {
    method: "DELETE",
    mode: "cors",
    credentials: "include",
  });
}

export function sendPrompt(data: { prompt: string }, chatId?: string) {
  return fetch(`http://localhost:3000/chats/${chatId}`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getChats(page: number) {
  return fetch(`http://localhost:3000/chats?page=${page}`, {
    mode: "cors",
    credentials: "include",
  });
}

export function updateChat(chatId: string, name: string) {
  return fetch(`http://localhost:3000/chats/${chatId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  });
}

export function deleteChat(chatId: string) {
  return fetch(`http://localhost:3000/chats/${chatId}`, {
    method: "DELETE",
    credentials: "include",
    mode: "cors",
  });
}
