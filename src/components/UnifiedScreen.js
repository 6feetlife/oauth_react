import { useSignupData } from "../hooks/useSignupData";
import { useAuth } from "../AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useLocation } from "react-router-dom";


const UnifiedScreen = () => {
  const { handleSignup } = useAuth();
  const [loginData, handleLoginChange] = useSignupData({
    username: "",
    password: "",
  });
  const [signupData, handleSignupChange] = useSignupData({
    name: "",
    nickname: "",
    email: "",
    region: "",
    birth: "",
    profile: "",
    notification: false,
  });
  const [questionData, handleQuestionChange] = useSignupData({
    title: "",
    content: "",
  });

  const [file, setFile] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const redirectUri = 'http://localhost:3000/';
  const clientId = '773818071350-h3rpem6pdgl9npaik5kecgt4svapqu77.apps.googleusercontent.com';
  console.log("✅ [DEBUG] Google Client ID:", clientId);
  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `response_type=code&` +
    `scope=email%20profile&` +
    `access_type=offline&` +
    `prompt=consent`;

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code) {
      console.log("🔐 Authorization Code:", code);
      // 백엔드로 code 전송
      axios.post("http://localhost:8080/api/auth/google/code", { code })
        .then(res => {
          console.log("✅ 백엔드 응답:", res.data);
        })
        .catch(err => {
          console.error("❌ 인증 실패:", err);
        });
    }
  }, [location]);

  const handleSignupAndNavigate = async () => {
    try {
      await handleSignup("members", "POST", signupData);

      // Google에 요청을 보내어 authorization code 받기
      window.location.href = googleAuthUrl;

      // authorization code를 백엔드로 전송
      // 예시: axios를 사용하여 POST 요청으로 전송
      // 실제로는 Google에서 받은 코드를 사용해야 합니다.
      // const authorizationCode = "받은 authorization code";
      // await axios.post("http://your-backend-url.com/api/auth/google", {
      //   authorizationCode: authorizationCode
      // });

    } catch (error) {
      console.error("회원가입 또는 Google 인증 실패:", error);
    }
  };

  const handleLoginAndNavigate = async () => {
    await handleSignup("oauth/login", "POST", loginData);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const requestData = { title: String(questionData.title), content: String(questionData.content) };
    const jsonBlob = new Blob([JSON.stringify(requestData)], { type: "application/json" });
    formData.append("data", jsonBlob);
    if (file) {
      formData.append("image", file);
    }

    try {
      const response = await handleSignup("questions", "POST", formData);
      console.log("질문 등록 성공:", response.data);
      alert("질문이 성공적으로 등록되었습니다!");
      handleQuestionChange({ target: { name: "title", value: "" } });
      handleQuestionChange({ target: { name: "content", value: "" } });
      setFile(null);
    } catch (error) {
      console.error("질문 등록 실패:", error);
      alert("질문 등록에 실패했습니다.");
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      console.log("Google Credential:", token); // 추가 디버깅 로그

      const res = await axios.post("http://localhost:8080/api/auth/google", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: () => true // 모든 응답 상태 수용
      });

      if (res.status === 200) {
        setIsLoggedIn(true);
        setUserData(res.data); // 서버에서 받은 사용자 데이터 저장
        console.log("✅ 로그인 성공:", res.data);
      } else if (res.status === 404) {
        console.log("🔁 회원 정보 없음 → '/'로 리다이렉트");
        console.log("받은 정보:", res.data); // { email, name }
        // window.location.href = "/"; // 리다이렉트 대신 상태 업데이트
      } else {
        console.log("❌ 로그인 실패 또는 예상치 못한 상태 코드:", res.status);
      }
    } catch (error) {
      console.error("Google login 예외 발생:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = googleAuthUrl;
  };

  const inputStyle = "w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 placeholder-gray-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-500";
  const labelStyle = "text-gray-400 text-sm text-left";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-8">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Welcome to the Platform</h1>
      <p className="text-gray-500 mb-6">Join the community today!</p>

      <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Login</h2>
          <form className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Username</span>
              <input type="text" name="username" value={loginData.username} onChange={handleLoginChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Password</span>
              <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <button type="button" onClick={handleLoginAndNavigate} className="w-full h-12 bg-blue-500 text-white font-bold rounded-lg">Login</button>
            {isLoggedIn ? (
              <div>Welcome, {userData?.name}!</div>
            ) : (
              <div className="w-full flex justify-center">
                <button type="button" onClick={handleGoogleLogin} className="w-full h-12 bg-blue-500 text-white font-bold rounded-lg">Login with Google</button>
              </div>
            )}
            <button type="button" onClick={() => handleSignup("auth/logout", "POST")} className="w-full h-12 bg-red-500 text-white font-bold rounded-lg">Logout</button>
          </form>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Sign Up</h2>
          <form className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Name</span>
              <input type="text" name="name" value={signupData.name} onChange={handleSignupChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Nickname</span>
              <input type="text" name="nickname" value={signupData.nickname} onChange={handleSignupChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Email</span>
              <input type="email" name="email" value={signupData.email} onChange={handleSignupChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Region</span>
              <input type="text" name="region" value={signupData.region} onChange={handleSignupChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Birth</span>
              <input type="text" name="birth" value={signupData.birth} onChange={handleSignupChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Profile</span>
              <input type="text" name="profile" value={signupData.profile} onChange={handleSignupChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Notification</span>
              <input type="checkbox" name="notification" checked={signupData.notification} onChange={(e) => handleSignupChange({ target: { name: "notification", value: e.target.checked } })} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <button type="button" onClick={handleSignupAndNavigate} className="w-full h-12 bg-green-500 text-white font-bold rounded-lg">Sign Up</button>
          </form>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Question Registration</h2>
          <form onSubmit={handleQuestionSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Title</span>
              <input type="text" name="title" value={questionData.title} onChange={handleQuestionChange} required className="p-2 border border-gray-300 rounded-md" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Content</span>
              <textarea name="content" value={questionData.content} onChange={handleQuestionChange} required className="p-2 border border-gray-300 rounded-md h-32" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Attach File</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <button type="submit" className="w-full h-12 bg-purple-500 text-white font-bold rounded-lg">Submit Question</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnifiedScreen;