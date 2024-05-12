import Message from "./Message";

export default function MessageList({ messages }) {
    return messages?.map(message => <Message key={message._id} message={message} />)
}