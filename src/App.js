import { AuthProvider } from "./AuthContext";  // ✅ AuthProvider 추가
import { GoogleOAuthProvider } from "@react-oauth/google";
import Signup from "./components/Signup";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AccessMemberPage from "./pages/AccessMemberPage";
import UnifiedScreen from "./components/UnifiedScreen";


function App() {
  return (
    <GoogleOAuthProvider clientId="773818071350-h3rpem6pdgl9npaik5kecgt4svapqu77.apps.googleusercontent.com">
      <AuthProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<UnifiedScreen />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/AccessMemberPage" element={<AccessMemberPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;