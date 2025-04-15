import { useSignupData } from "../hooks/useSignupData";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const AccessMemberPage = () => {
  const { handleSignup } = useAuth();
  
  return (
    <div>
      <img src="../images/banapresso_logo.png" alt="로고 이미지" />
      <button onClick={handleSignup("auth/logout")}></button>
    </div>
  );
};

export default AccessMemberPage;
