import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SSDC EEE HITAM | Hyderabad Institute of Technology and Management" },
      {
        name: "description",
        content:
          "Skill & Self Development Cell (SSDC) — Department of Electrical and Electronics Engineering, Hyderabad Institute of Technology and Management (HITAM).",
      },
      { name: "author", content: "SSDC EEE HITAM" },
      { property: "og:title", content: "SSDC EEE HITAM | Hyderabad Institute of Technology and Management" },
      {
        property: "og:description",
        content:
          "Skill & Self Development Cell (SSDC) — Department of EEE, HITAM. Workshops, projects, research and student events.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "SSDC EEE HITAM | Hyderabad Institute of Technology and Management" },
      {
        name: "twitter:description",
        content:
          "Skill & Self Development Cell (SSDC) — Department of EEE, HITAM.",
      },
      { name: "apple-mobile-web-app-title", content: "SSDC EEE HITAM" },
      { name: "application-name", content: "SSDC EEE HITAM" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "64x64", href: "/favicon.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
