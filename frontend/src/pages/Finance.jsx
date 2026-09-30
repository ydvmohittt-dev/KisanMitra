import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import { apiRequest } from "../services/api";
import StatusBox from "../components/StatusBox";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Finance = () => {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("All");
  const [status, setStatus] = useState("loading");

  const loadFinance = async () => {
    setStatus("loading");
    try {
      const response = await apiRequest("/finance");
      setData(response);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    loadFinance();
  }, []);

  if (status === "loading")
    return (
      <div className="container section">
        <StatusBox type="loading" title="Loading your finance records..." />
      </div>
    );
  if (status === "error")
    return (
      <div className="container section">
        <StatusBox
          type="error"
          title="Could not load finance records"
          message="Please try again."
        />
      </div>
    );

  const filteredEntries = data.entries.filter(
    (entry) => filter === "All" || entry.type === filter,
  );

  return (
    <div className="container section">
      <div className="page-heading-row">
        <div>
          <h2
            className="section-heading"
            style={{ textAlign: "left", marginBottom: 4 }}>
            Hisab-Kitab
          </h2>
          <p
            className="section-subheading"
            style={{ textAlign: "left", marginBottom: 0 }}>
            Keep track of money you need to receive and pay.
          </p>
        </div>
        <Link className="btn btn-primary" to="/finance/new">
          <FiPlus size={16} /> Add Entry
        </Link>
      </div>

      <div className="finance-summary grid grid-3">
        <div className="card finance-summary-card receivable">
          <div className="finance-icon">
            <FiArrowDownLeft size={21} />
          </div>
          <div>
            <span>Receivable</span>
            <strong>₹{data.summary.receivable.toLocaleString("en-IN")}</strong>
            <small>Money to receive</small>
          </div>
        </div>
        <div className="card finance-summary-card payable">
          <div className="finance-icon">
            <FiArrowUpRight size={21} />
          </div>
          <div>
            <span>Payable</span>
            <strong>₹{data.summary.payable.toLocaleString("en-IN")}</strong>
            <small>Money to pay</small>
          </div>
        </div>
        <div className="card finance-summary-card balance">
          <div className="finance-icon">
            <FiArrowRight size={21} />
          </div>
          <div>
            <span>Net Balance</span>
            <strong>₹{data.summary.netBalance.toLocaleString("en-IN")}</strong>
            <small>Receivable - Payable</small>
          </div>
        </div>
      </div>

      <div className="finance-section-header">
        <div>
          <h3>Recent Entries</h3>
          <p>Latest transactions added to your account.</p>
        </div>
        <Link to="/finance/new" className="text-link">
          Add new entry <FiArrowRight size={14} />
        </Link>
      </div>

      <div className="finance-tabs">
        {["All", "Receivable", "Payable"].map((item) => (
          <button
            key={item}
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>

      {filteredEntries.length === 0 ? (
        <StatusBox
          type="empty"
          title="No entries yet"
          message="Add your first receivable or payable entry."
          action={
            <Link className="btn btn-primary" to="/finance/new">
              Add Entry
            </Link>
          }
        />
      ) : (
        <div className="card finance-table-card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Remaining</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry._id}>
                    <td>
                      <strong>{entry.personName}</strong>
                    </td>
                    <td>
                      <span
                        className={`finance-type ${entry.type === "Receivable" ? "receive" : "pay"}`}>
                        {entry.type}
                      </span>
                    </td>
                    <td>₹{entry.amount.toLocaleString("en-IN")}</td>
                    <td>₹{entry.paidAmount.toLocaleString("en-IN")}</td>
                    <td>₹{entry.remainingAmount.toLocaleString("en-IN")}</td>
                    <td>{formatDate(entry.date)}</td>
                    <td>
                      <span
                        className={`badge ${entry.status === "Paid" ? "badge-green" : "badge-gray"}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        className="table-arrow"
                        to={`/finance/${entry._id}`}>
                        <FiArrowRight size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
