import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = ["PATIENT", "DOCTOR", "RECEPTIONIST"];

export default function Signup() {
  const [role, setRole] = useState("PATIENT");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register({ fullName, email, password, role });
      if (user.role === "PATIENT") navigate("/patient");
      else if (user.role === "DOCTOR") navigate("/doctor");
      else navigate("/receptionist");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="hidden md:flex flex-col justify-between bg-ink text-paper p-11">
        <div>
          <div className="flex items-center gap-2 mb-9">
            <div className="w-2 h-2 rounded-full bg-clay" />
            <span className="text-sm tracking-wider uppercase font-medium">Smart Clinic</span>
          </div>
          <h1 className="font-display text-3xl leading-tight max-w-sm">
            Set up your account in under a minute.
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          {["Tell us your role", "Verify your email", "Start booking or managing visits"].map((t, i) => (
            <div key={i} className="flex items-center gap-3 border border-dashed border-[#445048] rounded-md px-3 py-2 text-xs text-[#C9D0C6]">
              <span className="font-mono text-clay">{i + 1}</span> {t}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center px-8 md:px-16 py-12 bg-paper overflow-y-auto">
        <h1 className="text-2xl font-medium mb-1">Create your account</h1>
        <p className="text-sm text-muted mb-6">Choose the role that matches what you'll be doing here.</p>
        <p className="text-sm text-muted mb-6">
          Already have an account?{" "}
          <Link to="/login" className="text-moss font-medium">Sign in</Link>
        </p>

        {error && <div className="bg-danger-light text-danger text-sm rounded-md px-4 py-3 mb-4">{error}</div>}

        <div className="flex gap-2 mb-6">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`px-3.5 py-1.5 rounded-full text-xs border ${
                role === r ? "bg-moss border-moss text-white" : "bg-white border-line text-muted"
              }`}
            >
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs text-muted mb-1.5">Full name</label>
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2.5 border border-line rounded-md bg-white text-sm focus:outline-none focus:border-moss" />
          </div>
          <div className="mb-4">
            <label className="block text-xs text-muted mb-1.5">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-line rounded-md bg-white text-sm focus:outline-none focus:border-moss" />
          </div>
          <div className="mb-4">
            <label className="block text-xs text-muted mb-1.5">Password</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-line rounded-md bg-white text-sm focus:outline-none focus:border-moss" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-moss text-white py-3 rounded-md text-sm font-medium mt-1.5 disabled:opacity-60">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}