import { useSignupData } from "../hooks/useSignupData";
import { useAuth } from "../AuthContext";
// App.js가 내려주는 props
const Signup = () => {
  const { handleSignup } = useAuth();
  const [signupData, handleChange] = useSignupData({
    phone: "",
    name: "",
    email: "",
    nickname: "",
    password: "",
  });

  const inputStyle = "w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 placeholder-gray-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-500";
  const labelStyle = "text-gray-400 text-sm text-left"
  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-6 py-8">
      
      <h1 className="text-2xl font-bold text-pink-500">banapresso</h1>

      <h2 className="text-2xl font-bold text-black mt-4">어서오세요,</h2>
      <h2 className="text-2xl font-bold text-black">바나프레소입니다.</h2>

      <p className="text-gray-500 text-sm mt-2 text-center">바나프레소 서비스 이용을 위해 회원 정보를 입력해주세요</p>

      <div className="w-full relative max-w-md flex flex-col gap-3 mt-6">
        <label className={labelStyle} htmlFor="email">
          휴대폰번호를 입력해주세요
          <input type="text" name="phone" placeholder="010 - 0000 - 0000" value={signupData.phone} onChange={handleChange} className={`${inputStyle} text-center`} />
        </label>
        
        <label className={labelStyle} htmlFor="name">
          이름을 입력해주세요
          <input type="text" name="name" value={signupData.name} onChange={handleChange} className={inputStyle} />
        </label>
        
        <label className={labelStyle} htmlFor="email">
          이메일을 입력해주세요
          <input type="email" name="email" value={signupData.email} onChange={handleChange} className={inputStyle} />
        </label>
        
        <label className={labelStyle} htmlFor="nickname">
          주문에 사용될 닉네임을 입력해주세요
          <input type="text" name="nickname" placeholder="한글과 영어 소문자만 사용 가능하며 2~8자리 이내로 입력해주세요" value={signupData.nickname} onChange={handleChange} className={`${inputStyle} placeholder:text-[10px] text-center`} />
        </label>
       
        <label className={labelStyle} htmlFor="password">
          비밀번호를 입력해주세요
          <input type="password" name="password" placeholder="비밀번호는 8~20자이며 영어 대소문자, 숫자, 특수기호를 모두 사용해주세요" value={signupData.password} onChange={handleChange} className={`${inputStyle} placeholder:text-[10px]`} />
        </label>
      </div>

      <div className="fixed bottom-0 left-0 w-[393px] bg-pink-500 p-1 left-1/2 -translate-x-1/2 ">
        <button onClick={() => handleSignup("members", "POST", signupData)} className="w-full max-w-md h-14 text-white text-lg font-bold rounded-lg">
          다음
        </button>
      </div>
    </div>
  );
};

export default Signup;
