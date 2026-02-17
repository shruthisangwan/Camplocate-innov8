import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";

/* ================= MAIN APP ================= */
function App() {
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const theme = dark
    ? {
        bg: "#0F172A",
        card: "rgba(30,41,59,0.75)",
        text: "#F1F5F9",
        sub: "#94A3B8",
        primary: "#3B82F6",
        accent: "#10B981"
      }
    : {
        bg: "#F1F5F9",
        card: "rgba(255,255,255,0.85)",
        text: "#0F172A",
        sub: "#475569",
        primary: "#1E40AF",
        accent: "#10B981"
      };

  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: theme.bg, transition: "0.4s" }}>
        <Navbar dark={dark} setDark={setDark} theme={theme} user={user} />

        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/browse" element={<Browse theme={theme} />} />
          <Route path="/upload" element={<Upload theme={theme} user={user} />} />
          <Route path="/login" element={<Login theme={theme} />} />
          <Route path="/register" element={<Register theme={theme} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

/* ================= NAVBAR ================= */
function Navbar({ dark, setDark, theme, user }) {
  return (
    <nav
      style={{
        background: theme.primary,
        padding: "20px 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#fff"
      }}
    >
      <h2 style={{ margin: 0 }}>Camplocate</h2>

      <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
        <NavItem to="/">Home</NavItem>
        <NavItem to="/browse">Browse</NavItem>
        {user && <NavItem to="/upload">Upload</NavItem>}
        {!user && <NavItem to="/login">Login</NavItem>}
        {!user && <NavItem to="/register">Register</NavItem>}
        {user && (
          <button onClick={() => signOut(auth)} style={dangerBtn}>
            Logout
          </button>
        )}

        <button
          onClick={() => setDark(!dark)}
          style={{
            background: theme.accent,
            border: "none",
            padding: "8px 14px",
            borderRadius: "20px",
            cursor: "pointer",
            color: "#fff"
          }}
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}

function NavItem({ to, children }) {
  return (
    <Link to={to} style={{ color: "#fff", textDecoration: "none" }}>
      {children}
    </Link>
  );
}

/* ================= HOME ================= */
function Home({ theme }) {
  return (
    <div style={centerStyle}>
      <div
        style={{
          backdropFilter: "blur(15px)",
          background: theme.card,
          padding: "70px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
        }}
      >
        <h1 style={{ color: theme.text, fontSize: "42px" }}>
          Campus Academic Resource Sharing
        </h1>

        <p style={{ color: theme.sub, margin: "20px 0" }}>
          Share Notes • PYQs • Assignments • Projects
        </p>

        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <Link to="/register">
            <button style={primaryBtn(theme)}>Get Started</button>
          </Link>
          <Link to="/browse">
            <button style={accentBtn(theme)}>Explore</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ================= REGISTER ================= */
function Register({ theme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration Successful");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={formStyle(theme)}>
      <h2>Create Account</h2>
      <input style={inputStyle} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input style={inputStyle} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button style={primaryBtn(theme)} onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}

/* ================= LOGIN ================= */
function Login({ theme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={formStyle(theme)}>
      <h2>Login</h2>
      <input style={inputStyle} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input style={inputStyle} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button style={primaryBtn(theme)} onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

/* ================= UPLOAD ================= */
function Upload({ theme, user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleUpload = async () => {
    if (!user) {
      alert("Login first!");
      return;
    }

    await addDoc(collection(db, "resources"), {
      title,
      description,
      userEmail: user.email,
      createdAt: new Date()
    });

    alert("Uploaded!");
    setTitle("");
    setDescription("");
  };

  return (
    <div style={formStyle(theme)}>
      <h2>Upload Resource</h2>
      <input style={inputStyle} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea
        style={{ ...inputStyle, height: "100px" }}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button style={primaryBtn(theme)} onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}

/* ================= BROWSE ================= */
function Browse({ theme }) {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "resources"));
      setResources(snapshot.docs.map((doc) => doc.data()));
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "80px", color: theme.text }}>
      <h2>Resources</h2>

      {resources.map((res, index) => (
        <div key={index} style={{ ...cardStyle, background: theme.card }}>
          <h3>{res.title}</h3>
          <p>{res.description}</p>
          <small>By: {res.userEmail}</small>
        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */
const centerStyle = {
  minHeight: "90vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "15px",
  padding: "12px"
};

const formStyle = (theme) => ({
  padding: "100px 80px",
  maxWidth: "400px",
  color: theme.text
});

const primaryBtn = (theme) => ({
  background: theme.primary,
  color: "#fff",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  cursor: "pointer"
});

const accentBtn = (theme) => ({
  background: theme.accent,
  color: "#fff",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  cursor: "pointer"
});

const dangerBtn = {
  background: "#EF4444",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer"
};

const cardStyle = {
  padding: "20px",
  marginBottom: "20px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
};

export default App;