import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "@/views/Login"
import Signup from "@/views/Signup"
import NotFound from "@/views/NotFound"
import "@/styles/App.css"
import AuthContextProvider from "./components/AuthContextProvider"
import Chat from "./views/Chat"

function App() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App
