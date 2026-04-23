import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

// Render the legacy React-Router app on a single splat route.
// All actual routing is handled by react-router-dom inside <App />.
const App = lazy(() => import("../App"));

export const Route = createFileRoute("/$")({
  component: SplatRoute,
});

function SplatRoute() {
  // SSR safety: react-router-dom's BrowserRouter needs window.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}
