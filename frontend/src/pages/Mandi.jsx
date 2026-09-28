import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiCalendar, FiSearch } from "react-icons/fi";
import { apiRequest } from "../services/api";
import StatusBox from "../components/StatusBox";

const Mandi = () => {
  const { register, handleSubmit } = useForm();
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadPrices = async (filters = {}) => {
    setStatus("loading");
    setErrorMessage("");

    const qs = new URLSearchParams();

if (filters.state) qs.set("state", filters.state);
if (filters.district) qs.set("district", filters.district);
if (filters.commodity) qs.set("commodity", filters.commodity);
if (filters.market) qs.set("market", filters.market);

    try {
     const data = await apiRequest(`/mandi?${qs}`);
      setRecords(data.records);
      setStatus(data.records.length ? "ready" : "empty");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  return (
    <div className="container section">
      <h2 className="section-heading" style={{ textAlign: "left" }}>Live Mandi Prices</h2>
      <p className="section-subheading" style={{ textAlign: "left" }}>
        Filter market prices by state, district, commodity and market.
      </p>

      <form onSubmit={handleSubmit(loadPrices)} className="filter-bar">
        <input placeholder="State" {...register("state")} />
        <input placeholder="District" {...register("district")} />
        <input placeholder="Commodity" {...register("commodity")} />
        <input placeholder="Market name" {...register("market")} />
        <button className="btn btn-primary" type="submit"><FiSearch size={15} /> Search</button>
      </form>

      {status === "loading" && <StatusBox type="loading" title="Fetching live mandi prices..." />}
      {status === "error" && <StatusBox type="error" title="Could not load mandi prices" message={errorMessage} />}
      {status === "empty" && <StatusBox type="empty" title="No records found" message="Try changing one or more filters." />}

      {status === "ready" && (
        <div className="card">
          <p className="listing-meta"><FiCalendar size={15} /> Latest records are shown first · {records.length} records</p>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Commodity</th>
                  <th>Market</th>
                  <th>District</th>
                  <th>State</th>
                  <th>Min Price</th>
                  <th>Max Price</th>
                  <th>Modal Price</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={`${record.market}-${record.commodity}-${record.arrivalDate}-${index}`}>
                    <td>{record.commodity}</td>
                    <td>{record.market}</td>
                    <td>{record.district}</td>
                    <td>{record.state}</td>
                    <td>₹{record.minPrice}</td>
                    <td>₹{record.maxPrice}</td>
                    <td>₹{record.modalPrice}</td>
                    <td>{record.arrivalDate}</td>
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

export default Mandi;
