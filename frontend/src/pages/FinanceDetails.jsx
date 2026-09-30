import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiFileText,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { apiRequest } from "../services/api";
import StatusBox from "../components/StatusBox";
import Modal from "../components/Modal";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const FinanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [status, setStatus] = useState("loading");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { date: new Date().toISOString().split("T")[0] },
  });

  const loadEntry = async () => {
    try {
      const data = await apiRequest(`/finance/${id}`);
      setEntry(data);
      setStatus("ready");
    } catch (requestError) {
      setError(requestError.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadEntry();
  }, [id]);

  const addPayment = async (data) => {
    setError("");
    try {
      await apiRequest(`/finance/${id}/payments`, {
        method: "POST",
        body: JSON.stringify({ ...data, amount: Number(data.amount) }),
      });
      reset({ date: new Date().toISOString().split("T")[0] });
      setPaymentOpen(false);
      loadEntry();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const deleteEntry = async () => {
    if (!window.confirm("Delete this finance entry?")) return;
    try {
      await apiRequest(`/finance/${id}`, { method: "DELETE" });
      navigate("/finance");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (status === "loading")
    return (
      <div className="container section">
        <StatusBox type="loading" title="Loading entry..." />
      </div>
    );
  if (status === "error")
    return (
      <div className="container section">
        <StatusBox type="error" title="Could not load entry" message={error} />
      </div>
    );

  return (
    <div className="container section">
      <Link to="/finance" className="back-link">
        <FiArrowLeft size={16} /> Hisab-Kitab
      </Link>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card finance-detail-card">
        <div className="finance-person-header">
          <div className="person-avatar">
            <FiUser size={22} />
          </div>
          <div>
            <h2>{entry.personName}</h2>
            <p>{entry.mobile}</p>
          </div>
          <span
            className={`badge ${entry.type === "Receivable" ? "badge-green" : "badge-gray"}`}>
            {entry.type}
          </span>
        </div>

        <div className="finance-amount-grid">
          <div>
            <span>Total Amount</span>
            <strong>₹{entry.amount.toLocaleString("en-IN")}</strong>
          </div>
          <div>
            <span>Paid</span>
            <strong>₹{entry.paidAmount.toLocaleString("en-IN")}</strong>
          </div>
          <div>
            <span>Remaining</span>
            <strong>₹{entry.remainingAmount.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div className="finance-info-grid">
          <div>
            <FiCalendar />
            <span>
              Date<strong>{formatDate(entry.date)}</strong>
            </span>
          </div>
          <div>
            <FiCalendar />
            <span>
              Due Date<strong>{formatDate(entry.dueDate)}</strong>
            </span>
          </div>
          <div>
            <FiFileText />
            <span>
              Description
              <strong>{entry.description || "No description"}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="finance-section-header">
        <div>
          <h3>Payment History</h3>
          <p>Payments recorded against this entry.</p>
        </div>
        {entry.remainingAmount > 0 && (
          <button
            className="btn btn-primary"
            onClick={() => setPaymentOpen(true)}>
            <FiPlus size={16} /> Mark Payment
          </button>
        )}
      </div>

      <div className="card finance-table-card">
        {entry.payments.length === 0 ? (
          <p style={{ color: "var(--muted)", margin: 0 }}>
            No payments recorded yet.
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {entry.payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{formatDate(payment.date)}</td>
                    <td>₹{payment.amount.toLocaleString("en-IN")}</td>
                    <td>{payment.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn btn-danger" onClick={deleteEntry}>
          <FiTrash2 size={15} /> Delete Entry
        </button>
      </div>

      <Modal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        title="Mark Payment"
        subtitle={`Remaining: ₹${entry.remainingAmount.toLocaleString("en-IN")}`}>
        <form onSubmit={handleSubmit(addPayment)}>
          <div className="form-group">
            <label>Payment Amount *</label>
            <input
              type="number"
              min="1"
              max={entry.remainingAmount}
              placeholder="Enter amount"
              {...register("amount", {
                required: "Payment amount is required",
                max: {
                  value: entry.remainingAmount,
                  message: "Payment cannot exceed remaining amount",
                },
              })}
            />
            {errors.amount && (
              <span className="field-error">{errors.amount.message}</span>
            )}
          </div>
          <div className="form-group">
            <label>Date *</label>
            <input type="date" {...register("date", { required: true })} />
          </div>
          <div className="form-group">
            <label>Note</label>
            <textarea
              rows={3}
              placeholder="e.g. Cash received, UPI, etc."
              {...register("note")}
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setPaymentOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FinanceDetails;
