import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && !isLoading) {
      navigate("/");
    }
  }, [session, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}