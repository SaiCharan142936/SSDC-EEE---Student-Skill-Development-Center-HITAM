import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);
  const { session, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (session && user) {
      navigate("/admin", { replace: true });
    }
  }, [authLoading, session, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Account created. You can now sign in.");
        setMode("signin");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        toast.error(error.message || "Login failed");
        return;
      }
      toast.success("Welcome back");
      navigate("/admin", { replace: true });
    } catch (err: any) {
      toast.error(err?.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm bg-background border rounded-md p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="h-4 w-4 text-primary" />
          <h1 className="text-lg font-bold text-foreground">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          Sign in to manage events.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="w-full border rounded-sm bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full border rounded-sm bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </button>

          <div className="flex items-center justify-between text-xs">
          </div>
        </form>

        <p className="text-[10px] text-muted-foreground mt-5 leading-relaxed">
          Contact Admin for account creation OR Password reset.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
