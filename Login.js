import { useSignupData } from "../hooks/useSignupData";
import { useAuth } from "../AuthContext";
// import { useNavigate } from "react-router-dom";
const Login = () => {
  // const navigate = useNavigate();
  // const { handleSignup }
  // useAuth를 사용하여 handleSignup 가져오기
  const { handleSignup } = useAuth();
  const [ signupData, handleChange ] = useSignupData({
    username: "",
    password:"",
  });
  const handleLoginAndNavigate = async () => {
    await handleSignup("auth/login", "POST", signupData);
    // navigate("/AccessMemberPage");
  }
  const inputStyle = "w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 placeholder-gray-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-500";
    return (
      <div className="min-h-screen flex flex-col items-center justify-start pt-20 bg-white px-6 py-8">


        <div className="w-full relative max-w-md flex flex-col gap-3 mt-6">
          <input type="text" name="username" placeholder="email" value={signupData.email} onChange={handleChange} className={inputStyle}/>
          <input type="password" name="password" placeholder="password" value={signupData.password} onChange={handleChange} className={inputStyle}/>
        <div className="fixed bottom-0 left-0 w-[393px] bg-pink-500 p-1 left-1/2 -translate-x-1/2 ">
          <button type="button" onClick={handleLoginAndNavigate}className="w-full max-w-md h-14 text-white text-lg font-bold rounded-lg">
            로그인
          </button>
        </div>
          {/* <button type="button" onClick={() => handleSignup("auth/logout", "POST")}>로그아웃</button> */}
        </div>
      </div>
    );
  };
  
  export default Login;