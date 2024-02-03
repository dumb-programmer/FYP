import "@/App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "@/views/Login"
import Signup from "@/views/Signup"
import NotFound from "@/views/NotFound"

function App() {

  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
}

export default App
