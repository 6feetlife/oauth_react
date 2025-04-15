import { useState } from "react";
import { useAuth } from "./AuthContext";

const QuestionForm = () => {
  const { api } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);  // ✅ 파일 상태 추가

  // 🔹 파일 선택 시 상태 업데이트
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);  // 첫 번째 파일 선택
  };

  // 🔹 질문 제출
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // ✅ FormData 객체 생성
    const formData = new FormData();
    const requestData = { title: String(title), content: String(content) }; 
    const jsonBlob = new Blob([JSON.stringify(requestData)], { type: "application/json" });
    formData.append("data", jsonBlob);
    // formData.append("title", title);
    // formData.append("content", content);
    if (file) {
      
      formData.append("image", file);  // ✅ 파일 추가
    }

    try {
      const response = await api.post("questions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // ✅ 파일 업로드를 위한 헤더 설정
        },
      });

      console.log("질문 등록 성공:", response.data);
      alert("질문이 성공적으로 등록되었습니다!");

      // 폼 초기화
      setTitle("");
      setContent("");
      setFile(null);
    } catch (error) {
      console.error("질문 등록 실패:", error);
      alert("질문 등록에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
            <h2>질문 작성</h2>
        </div>
      <label>
        제목:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>

      <label>
        내용:
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
      </label>

      <label>
        이미지 첨부:
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      <button type="submit">질문 등록</button>
    </form>
  );
};

export default QuestionForm;


