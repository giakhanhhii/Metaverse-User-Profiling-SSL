// Server-side redirect handled by FastAPI.
// This page is a fallback in case the static build is served differently.
export default function Home() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/upload/" />
      </head>
      <body style={{ margin: 0, background: "#f9fafb" }}>
        <p style={{ textAlign: "center", marginTop: "20vh", color: "#6b7280", fontFamily: "sans-serif" }}>
          Đang chuyển hướng…
        </p>
      </body>
    </html>
  );
}
