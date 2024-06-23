import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "@/views/Login"
import Signup from "@/views/Signup"
import NotFound from "@/views/NotFound"
import "@/styles/App.css"
import AuthContextProvider from "./components/AuthContextProvider"
import Home from "./views/Home"
import { QueryClientProvider, QueryClient } from "react-query"
import Chat from "./views/Chat"
import WelcomeScreen from "./views/WelcomeScreen"
import SocketContextProvider from "./components/SocketContextProvider"

const client = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={client}>
      <AuthContextProvider>
        <SocketContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} >
                <Route index element={<WelcomeScreen />} />
                <Route path="/:chatId" element={<Chat />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SocketContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App
