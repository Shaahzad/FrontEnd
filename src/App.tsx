import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Forgotpassword from "./pages/Forgotpassword";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Homepage from "./pages/Homepage";
import ProtectedRoute from "./components/ProtectedRoute";
const App = () => {
  return <>
  <BrowserRouter>
    <Routes>
    <Route path="/" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/forgotPassword" element={<Forgotpassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Homepage />} />
      </Route>
    </Routes>
  </BrowserRouter>
  </>
};

export default App;
