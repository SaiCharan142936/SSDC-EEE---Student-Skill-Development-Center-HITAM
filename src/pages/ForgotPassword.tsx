import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Enter your email");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success("Reset link sent — check your inbox");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm bg-background border rounded-md p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="h-4 w-4 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Forgot Password</h1>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {sent ? (
          <div className="text-sm text-foreground space-y-3">
            <p>
              If an account exists for <span className="font-mono">{email}</span>, a
              password reset link has been sent.
            </p>
            <p className="text-xs text-muted-foreground">
              Check your inbox (and spam folder). The link expires in 1 hour.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className="w-full border rounded-sm bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : "Send reset link"}
            </button>
          </form>
        )}

        <Link
          to="/login"
          className="mt-5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
