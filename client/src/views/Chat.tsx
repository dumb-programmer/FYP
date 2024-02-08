import { useParams } from "react-router-dom";

export default function Chat() {
    const { chatId } = useParams();
    
    return <div>
        <h2>{chatId}</h2>
        <div className="prompt-form-container">
            <form>
                <input className="input" type="text" placeholder="prompt..." />
                <button>Send</button>
            </form>
        </div>
    </div>;
}