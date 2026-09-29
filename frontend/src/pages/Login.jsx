import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { apiRequest } from "../services/api";
import { saveToken } from "../services/auth";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      saveToken(response.token);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card form-card">
        <div style={{ textAlign: "center", marginBottom: 10 }}><FaLeaf size={32} color="var(--green)" /></div>
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">Login to access your KisanMitra dashboard</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" {...register("email", { required: "Email is required" })} />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" {...register("password", { required: "Password is required" })} />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="form-footer-note">Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;
