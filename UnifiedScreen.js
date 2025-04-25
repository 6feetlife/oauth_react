import { useSignupData } from "../hooks/useSignupData";
import { useAuth } from "../AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useLocation } from "react-router-dom";
import SpeechComponent from './SpeechComponent';


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

  const [scheduleData, setScheduleData] = useState({
    title: "",
    startDateTime: "",
    endDateTime: ""
  });

  const [scheduleQuery, setScheduleQuery] = useState({
    year: "",
    month: ""
  });

  const [scheduleId, setScheduleId] = useState("");

  const [updateTitle, setUpdateTitle] = useState("");

  const [audioFile, setAudioFile] = useState(null);

  const redirectUri = 'http://localhost:3000/';
  const clientId = '773818071350-h3rpem6pdgl9npaik5kecgt4svapqu77.apps.googleusercontent.com';
  console.log("✅ [DEBUG] Google Client ID:", clientId);
  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `response_type=code&` +
    `scope=email%20profile%20https://www.googleapis.com/auth/calendar&` +
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
    await handleSignup("auth/login", "POST", loginData);
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

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData((prevData) => ({ ...prevData, [name]: value }));
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toISOString();
  };

  const handleScheduleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const formattedData = {
        ...scheduleData,
        startDateTime: formatDateTime(scheduleData.startDateTime),
        endDateTime: formatDateTime(scheduleData.endDateTime),
      };
      await axios.post("http://localhost:8080/text-schedules", formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Schedule submitted successfully!");
    } catch (error) {
      console.error("Failed to submit schedule:", error);
      alert("Failed to submit schedule.");
    }
  };

  const handleScheduleQueryChange = (e) => {
    const { name, value } = e.target;
    if (name === "year") {
      const year = value.split("-")[0]; // Extract year from date string
      setScheduleQuery((prevData) => ({ ...prevData, year }));
    } else if (name === "month") {
      const month = new Date(value).getMonth() + 1; // getMonth() is zero-based
      setScheduleQuery((prevData) => ({ ...prevData, month }));
    }
  };

  const handleScheduleQuerySubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:8080/schedules", {
        params: scheduleQuery,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Schedules:", response.data);
      alert("Schedules retrieved successfully!");
    } catch (error) {
      console.error("Failed to retrieve schedules:", error);
      alert("Failed to retrieve schedules.");
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(`http://localhost:8080/schedules/${scheduleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Schedule deleted successfully:", response.data);
      alert("Schedule deleted successfully!");
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      alert("Failed to delete schedule.");
    }
  };

  const handleUpdateSchedule = async (scheduleId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(`http://localhost:8080/schedules/${scheduleId}`, {
        title: updateTitle,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Schedule updated successfully:", response.data);
      alert("Schedule updated successfully!");
    } catch (error) {
      console.error("Failed to update schedule:", error);
      alert("Failed to update schedule.");
    }
  };

  const handleGetTodaySchedule = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get('http://localhost:8080/main', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Today\'s Schedule:', response.data);
      alert('Today\'s schedule retrieved successfully!');
    } catch (error) {
      console.error('Failed to retrieve today\'s schedule:', error);
      alert('Failed to retrieve today\'s schedule.');
    }
  };

  const handleUploadAudio = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await axios.post('http://localhost:8080/audio-records', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Audio upload response:', response.data);
      alert('Audio uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload audio:', error);
      alert('Failed to upload audio.');
    }
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

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Schedule Submission</h2>
          <form className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Title</span>
              <input type="text" name="title" value={scheduleData.title} onChange={handleScheduleChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Start DateTime</span>
              <input type="datetime-local" name="startDateTime" value={scheduleData.startDateTime} onChange={handleScheduleChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">End DateTime</span>
              <input type="datetime-local" name="endDateTime" value={scheduleData.endDateTime} onChange={handleScheduleChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <button type="button" onClick={handleScheduleSubmit} className="w-full h-12 bg-blue-500 text-white font-bold rounded-lg">Submit Schedule</button>
          </form>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Schedule Query</h2>
          <form className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Year</span>
              <input type="date" name="year" onChange={handleScheduleQueryChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Month</span>
              <input type="date" name="month" onChange={handleScheduleQueryChange} className="p-2 border border-gray-300 rounded-md" />
            </label>
            <button type="button" onClick={handleScheduleQuerySubmit} className="w-full h-12 bg-green-500 text-white font-bold rounded-lg">Query Schedules</button>
          </form>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Schedule ID</h2>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Schedule ID</span>
            <input type="text" value={scheduleId} onChange={(e) => setScheduleId(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
          </label>
          <button type="button" onClick={() => handleDeleteSchedule(scheduleId)} className="w-full h-12 bg-red-500 text-white font-bold rounded-lg">Delete Schedule</button>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Update Schedule</h2>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Schedule ID</span>
            <input type="text" value={scheduleId} onChange={(e) => setScheduleId(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">New Title</span>
            <input type="text" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
          </label>
          <button type="button" onClick={() => handleUpdateSchedule(scheduleId)} className="w-full h-12 bg-yellow-500 text-white font-bold rounded-lg">Update Schedule</button>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Today's Schedule</h2>
          <button type="button" onClick={handleGetTodaySchedule} className="w-full h-12 bg-blue-500 text-white font-bold rounded-lg">당일 일정 조회</button>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Upload Audio</h2>
          <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} className="p-2 border border-gray-300 rounded-md" />
          <button type="button" onClick={handleUploadAudio} className="w-full h-12 bg-purple-500 text-white font-bold rounded-lg">Upload Audio</button>
        </div>
      </div>
      <SpeechComponent />
    </div>
  );
};

export default UnifiedScreen;