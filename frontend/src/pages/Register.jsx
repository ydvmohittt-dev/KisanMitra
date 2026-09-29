import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { apiRequest } from "../services/api";
import { saveToken } from "../services/auth";

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await apiRequest("/auth/register", {
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
      <div className="card form-card" style={{ maxWidth: 560 }}>
        <div style={{ textAlign: "center", marginBottom: 10 }}><FaLeaf size={32} color="var(--green)" /></div>
        <h2 className="form-title">Create Your Account</h2>
        <p className="form-subtitle">Create your farmer profile to use KisanMitra services.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Full Name</label>
            <input placeholder="Enter your name" {...register("name", { required: "Name is required" })} />
            {errors.name && <span className="field-error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" {...register("email", { required: "Email is required" })} />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Village</label>
              <input placeholder="Village" {...register("village", { required: "Village is required" })} />
              {errors.village && <span className="field-error">{errors.village.message}</span>}
            </div>
            <div className="form-group">
              <label>City</label>
              <input placeholder="City" {...register("city", { required: "City is required" })} />
              {errors.city && <span className="field-error">{errors.city.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>State</label>
              <input placeholder="State" {...register("state", { required: "State is required" })} />
              {errors.state && <span className="field-error">{errors.state.message}</span>}
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input maxLength={10} placeholder="10 digit number" {...register("mobile", { required: "Mobile number is required", pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10 digit number" } })} />
              {errors.mobile && <span className="field-error">{errors.mobile.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Create a password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Re-enter your password" {...register("confirmPassword", { required: "Please confirm your password", validate: (value) => value === watch("password") || "Passwords do not match" })} />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="form-footer-note">Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;
