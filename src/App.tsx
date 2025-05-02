import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Forgotpassword from "./pages/Forgotpassword";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Homepage from "./pages/Homepage";
import ProtectedRoute from "./components/ProtectedRoute";
import SalesDashboard from "../Admin/src/pages/Admindashboard"
import EditUser from "../Admin/src/pages/EditUser";
import DeleteUser from "../Admin/src/pages/DeleteUser";
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
          <Route path="/admin" element={<SalesDashboard/>} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/delete-user/:id" element={<DeleteUser />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </>
};

export default App;
