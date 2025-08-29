import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Auth() {
  const { session, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // A navegação só acontece quando não está mais carregando e a sessão e o usuário estão presentes
    if (!isLoading && session && user) {
      toast.success("Login bem-sucedido!");
      navigate("/");
    }
  }, [session, isLoading, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}