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

export function logout() {
  return fetch("http://localhost:3000/logout", {
    method: "POST",
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

export function getUser() {
  return fetch("http://localhost:3000/user", {
    credentials: "include",
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

export function createChat(formData: any) {
  return fetch("http://localhost:3000/chats", {
    method: "POST",
    body: formData,
    credentials: "include",
    mode: "cors",
  });
}

export function getChats(page: number) {
  return fetch(`http://localhost:3000/chats?page=${page}`, {
    mode: "cors",
    credentials: "include",
  });
}

export function getChatName(chatId: string) {
  return fetch(`http://localhost:3000/chats/${chatId}/name`, {
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

export function sendFeedback(data: { type: "positive" | "negative", comments: string, category: string, messageId: string }) {
  return fetch("http://localhost:3000/feedback/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
    mode: "cors",
  });
}

export function getFeedbackList(page: number = 1, limit: number = 10) {
  return fetch(`http://localhost:3000/feedback/?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  });
}