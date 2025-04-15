// Removed navigate logic
// onClick={() => navigate("/Signup")}
// onClick={() => navigate("/login")}
// const navigate = useNavigate();

const HomePage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-start pt-20">
      <img src="/images/banapresso_logo.png" alt="Logo" />
      <div className="mt-0 flex flex-col space-y-4">
        <button 
          className="px-6 py-3 bg-pink-400 text-white rounded-lg shadow-md hover:bg-pink-500">
          회원가입
        </button>
        <button
          className="px-6 py-3 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500">
          로그인
        </button>
      </div>
    </div>
  );
};

export default HomePage;