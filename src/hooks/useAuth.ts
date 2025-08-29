import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { UserProfile } from "./useUsers";
import { toast } from "sonner";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função otimizada para buscar o perfil
  const fetchUserProfileAndSetState = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        return null;
      }

      return data as UserProfile | null;
    } catch (error) {
      console.error("Erro inesperado ao buscar perfil:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        const currentAuthUser = session?.user ?? null;
        setAuthUser(currentAuthUser);
        
        if (currentAuthUser?.email) {
          const profile = await fetchUserProfileAndSetState(currentAuthUser.email);
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Falha ao inicializar a autenticação:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        try {
          setSession(newSession);
          const currentAuthUser = newSession?.user ?? null;
          setAuthUser(currentAuthUser);
          
          if (currentAuthUser?.email) {
            const profile = await fetchUserProfileAndSetState(currentAuthUser.email);
            setUser(profile);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Falha na mudança de estado de autenticação:", error);
        } finally {
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Iniciando login para:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      console.log("Resposta do login:", { data, error });
      
      if (error) {
        console.error("Erro no login:", error);
        throw error;
      }
      
      console.log("Login realizado com sucesso");
      // A tela de carregamento será desativada pelo onAuthStateChange listener
    } catch (error) {
      setIsLoading(false);
      console.error("Erro inesperado no login:", error);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return { session, authUser, user, isLoading, login, logout, signup };
}