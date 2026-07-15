import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "PATIENT") navigate("/patient");
      else if (user.role === "DOCTOR") navigate("/doctor");
      else if (user.role === "RECEPTIONIST") navigate("/receptionist");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Left — brand panel, hidden on mobile like the mockup */}
      <div className="hidden md:flex flex-col justify-between bg-ink text-paper p-11">
        <div>
          <div className="flex items-center gap-2 mb-9">
            <div className="w-2 h-2 rounded-full bg-clay" />
            <span className="text-sm tracking-wider uppercase font-medium">Smart Clinic</span>
          </div>
          <h1 className="font-display text-3xl leading-tight max-w-sm">
            One queue. Three roles. Every visit tracked start to finish.
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          {["Appointment confirmed for 11:00 AM", "Prescription logged", "Invoice generated"].map((t, i) => (
            <div key={i} className="flex items-center gap-3 border border-dashed border-[#445048] rounded-md px-3 py-2 text-xs text-[#C9D0C6]">
              <span className="font-mono text-clay">#014</span> {t}
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col justify-center px-8 md:px-16 py-12 bg-paper">
        <h1 className="text-2xl font-medium mb-1">Sign in</h1>
        <p className="text-sm text-muted mb-6">Enter your credentials to continue.</p>
        <p className="text-sm text-muted mb-6">
          New here?{" "}
          <Link to="/signup" className="text-moss font-medium">
            Create an account
          </Link>
        </p>

        {error && (
          <div className="bg-danger-light text-danger text-sm rounded-md px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs text-muted mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-line rounded-md bg-white text-sm focus:outline-none focus:border-moss"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs text-muted mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-line rounded-md bg-white text-sm focus:outline-none focus:border-moss"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-moss text-white py-3 rounded-md text-sm font-medium mt-1.5 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
