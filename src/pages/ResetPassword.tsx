import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts a recovery session in the URL hash and auto-signs the user in
    // briefly so updateUser() works. We just listen for that event.
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setReady(true);
      }
    });

    // Fallback — if user already has a session from the recovery link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated. Please sign in.");
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm bg-background border rounded-md p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <KeyRound className="h-4 w-4 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Set New Password</h1>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          {ready
            ? "Choose a new password for your account."
            : "Validating reset link..."}
        </p>

        {ready ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              autoComplete="new-password"
              className="w-full border rounded-sm bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              autoComplete="new-password"
              className="w-full border rounded-sm bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</> : "Update password"}
            </button>
          </form>
        ) : (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
