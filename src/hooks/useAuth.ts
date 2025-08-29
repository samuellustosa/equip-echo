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

  // Função interna para buscar o perfil e lidar com a condição de corrida
  const fetchUserProfileAndSetState = async (email: string) => {
    const maxRetries = 5;
    const retryDelay = 500; // 500ms
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email);

        if (error) {
          console.error("Erro ao buscar perfil do usuário:", error);
          if (i < maxRetries - 1) {
            console.log(`Tentando novamente em ${retryDelay}ms...`);
            await new Promise(res => setTimeout(res, retryDelay));
            continue;
          }
          return null;
        }

        if (data && data.length > 0) {
          return data[0] as UserProfile;
        }

        if (i < maxRetries - 1) {
          console.log(`Perfil não encontrado, tentando novamente em ${retryDelay}ms...`);
          await new Promise(res => setTimeout(res, retryDelay));
        }
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
        return null;
      }
    }
    console.error("Falha ao buscar perfil do usuário após várias tentativas.");
    return null;
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
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setIsLoading(false);
      throw error;
    }
    // A tela de carregamento será desativada pelo onAuthStateChange listener
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