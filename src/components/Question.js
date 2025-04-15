import { useSignupData } from "../hooks/useSignupData";
import { useAuth } from "../AuthContext";
const Question = () => {
  // useAuth를 사용하여 handleSignup 가져오기
  const { handleSignup } = useAuth();
  const [ signupData, handleChange ] = useSignupData({
    title: "",
    content:"",
  });
    return (
      <div>
        <h2>질문 등록</h2>
        <input type="text" name="title" placeholder="제목" value={signupData.title} onChange={handleChange} />
        <input type="text" name="content" placeholder="내용" value={signupData.content} onChange={handleChange} />
        <button type="button" onClick={() => handleSignup("questions", "POST", signupData)}>등록</button>
      </div>
    );
  };
  
  export default Question;