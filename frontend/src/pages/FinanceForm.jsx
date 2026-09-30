import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { apiRequest } from "../services/api";

const today = new Date().toISOString().split("T")[0];

const FinanceForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { type: "Receivable", date: today, dueDate: today } });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      await apiRequest("/finance", { method: "POST", body: JSON.stringify({ ...data, amount: Number(data.amount) }) });
      navigate("/finance");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section">
      <Link to="/finance" className="back-link"><FiArrowLeft size={16} /> Finance</Link>
      <div className="finance-form-header">
        <h2 className="section-heading" style={{ textAlign: "left", marginBottom: 4 }}>Add Hisab-Kitab Entry</h2>
        <p className="section-subheading" style={{ textAlign: "left" }}>Add money that you need to receive or pay.</p>
      </div>

      <div className="card finance-form-card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group"><label>Person Name *</label><input placeholder="Enter name" {...register("personName", { required: "Person name is required" })} />{errors.personName && <span className="field-error">{errors.personName.message}</span>}</div>
            <div className="form-group"><label>Mobile Number *</label><input maxLength={10} placeholder="Enter mobile number" {...register("mobile", { required: "Mobile number is required", pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10 digit number" } })} />{errors.mobile && <span className="field-error">{errors.mobile.message}</span>}</div>
          </div>

          <div className="form-group">
            <label>Type *</label>
            <div className="finance-type-options">
              <label className="finance-type-option receive"><input type="radio" value="Receivable" {...register("type")} /> Receivable</label>
              <label className="finance-type-option pay"><input type="radio" value="Payable" {...register("type")} /> Payable</label>
            </div>
          </div>

          <div className="form-group"><label>Amount *</label><input type="number" min="1" placeholder="Enter amount" {...register("amount", { required: "Amount is required", min: { value: 1, message: "Amount must be greater than 0" } })} />{errors.amount && <span className="field-error">{errors.amount.message}</span>}</div>

          <div className="form-row">
            <div className="form-group"><label>Date *</label><input type="date" {...register("date", { required: true })} /></div>
            <div className="form-group"><label>Due Date *</label><input type="date" {...register("dueDate", { required: true })} /></div>
          </div>

          <div className="form-group"><label>Description</label><textarea rows={4} placeholder="e.g. Wheat sale, loan, tractor rent" {...register("description")} /></div>

          <div className="form-actions">
            <Link to="/finance" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Entry"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinanceForm;
