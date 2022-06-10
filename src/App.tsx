import React, { useMemo } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ChatPage } from "./components/pages/chat/ChatPage";
import { ForgotPasswordPage } from "./components/pages/ForgotPasswordPage";
import { LoginPage } from "./components/pages/LoginPage";
import { RegisterPage } from "./components/pages/RegisterPage";
import { useAppSelector } from "./redux/hooks";
import { RootState } from "./redux/store";

const App: React.FC = () => {
  const { authenticated } = useAppSelector((state: RootState) => state.auth);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Private */}
          <Route
            path="/chat"
            element={authenticated ? <ChatPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

export const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};
