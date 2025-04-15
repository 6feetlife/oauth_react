// React의 `useState` 훅을 가져옴 (컴포넌트 내부에서 상태를 관리하기 위해 필요)
import { useState } from "react";

// `useSignupData`라는 커스텀 훅을 정의하고, 초기 상태(initialState)를 매개변수로 받음
export function useSignupData(initialState) {
  // `useState`를 사용하여 `signupData` 상태를 생성하고, 초기값을 `initialState`로 설정
  // `signupData`: 현재 입력 필드의 값들을 저장하는 상태 변수
  // `setSignupData`: `signupData`를 업데이트하는 함수
  const [signupData, setSignupData] = useState(initialState);

  // 입력 필드의 값이 변경될 때 실행되는 함수
  const handleChange = (e) => {
    // `setSignupData`를 호출하여 상태를 업데이트
    setSignupData((prevData) => ({
      ...prevData, // 기존 `signupData` 데이터를 유지
      [e.target.name]: e.target.value // 현재 변경된 `input`의 `name`을 키로, 입력된 `value`를 저장
    }));
  };

  // `signupData`(입력 값들을 저장하는 상태)와 `handleChange`(입력 변경 핸들러)를 배열로 반환
  return [signupData, handleChange];
}