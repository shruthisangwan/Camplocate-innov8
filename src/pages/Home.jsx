import christLogo from "./christ-logo.png";

function Home({ theme }) {
  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* WATERMARK */}
      <img
        src={christLogo}
        alt="Christ University Logo"
        style={{
          position: "absolute",
          width: "450px",
          opacity: 0.06,
          pointerEvents: "none",
          animation: "float 6s ease-in-out infinite",
        }}
      />

      {/* MAIN CARD */}
      <div
        style={{
          background: theme.card,
          padding: "60px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          zIndex: 1,
        }}
      >
        <h1 style={{ color: theme.text, fontSize: "42px" }}>
          Campus Academic Resource Sharing
        </h1>

        <p style={{ color: theme.subtext, marginTop: "20px" }}>
          Share Notes • PYQs • Assignments • Projects
        </p>
      </div>
    </div>
  );
}