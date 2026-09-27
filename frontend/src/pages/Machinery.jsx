import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus, FiPhone, FiMapPin } from "react-icons/fi";
import { apiRequest } from "../services/api";
import StatusBox from "../components/StatusBox";
import Modal from "../components/Modal";

const machineTypes = [
  "Tractor",
  "Thresher",
  "Harvester",
  "Rotavator",
  "Sprayer",
  "Seed Drill",
  "Cultivator",
  "Other",
];

const Machinery = () => {
  const [machines, setMachines] = useState([]);
  const [status, setStatus] = useState("loading");
  const [scope, setScope] = useState("village");
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    apiRequest("/auth/me")
      .then((data) => setCurrentUser(data))
      .catch(() => {});
  }, []);

  const loadMachinery = (currentScope) => {
    setStatus("loading");
    apiRequest(`/machinery?scope=${currentScope}`)
      .then((data) => {
        setMachines(data.machines);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    loadMachinery(scope);
  }, [scope]);

  const filteredMachines = machines.filter((m) => {
    const term = search.toLowerCase();
    const matchesSearch =
      m.machineName.toLowerCase().includes(term) ||
      m.village.toLowerCase().includes(term);
    const matchesType = !typeFilter || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const onAddMachine = async (data) => {
    setFormError("");
    try {
      await apiRequest("/machinery", {
        method: "POST",
        body: JSON.stringify({ ...data, rentPerDay: Number(data.rentPerDay) }),
      });
      reset();
      setAddOpen(false);
      loadMachinery(scope);
    } catch (error) {
      setFormError(error.message || "Failed to list your machine.");
    }
  };

  const removeMachine = async (id) => {
    if (!window.confirm("Remove this machine listing?")) return;
    try {
      await apiRequest(`/machinery/${id}`, { method: "DELETE" });
      loadMachinery(scope);
    } catch {
      alert("Unable to remove listing.");
    }
  };

  return (
    <div className="container section">
      <h2 className="section-heading" style={{ textAlign: "left" }}>
        Rent Machinery
      </h2>
      <p className="section-subheading" style={{ textAlign: "left" }}>
        Book tractors and other machines available near you.
      </p>

      <div className="scope-tabs">
        <button
          className={`scope-tab ${scope === "village" ? "active" : ""}`}
          onClick={() => setScope("village")}>
          My Village
        </button>
        <button
          className={`scope-tab ${scope === "city" ? "active" : ""}`}
          onClick={() => setScope("city")}>
          My City
        </button>
        <button
          className={`scope-tab ${scope === "all" ? "active" : ""}`}
          onClick={() => setScope("all")}>
          All
        </button>
      </div>

      <div className="filter-bar">
        <input
          placeholder="Search by machine or village"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          {machineTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <FiPlus size={16} /> List a Machine
        </button>
      </div>

      {status === "loading" && (
        <StatusBox type="loading" title="Loading machinery..." />
      )}
      {status === "error" && (
        <StatusBox
          type="error"
          title="Could not load machinery"
          message="Please try again in a moment."
        />
      )}

      {status === "ready" && filteredMachines.length === 0 && (
        <StatusBox
          type="empty"
          title="No machinery listed yet"
          message="Be the first to list a machine for rent here."
          action={
            <button
              className="btn btn-primary"
              onClick={() => setAddOpen(true)}>
              + List a Machine
            </button>
          }
        />
      )}

      {status === "ready" && filteredMachines.length > 0 && (
        <div className="grid grid-3">
          {filteredMachines.map((m) => {
            const isMine = currentUser && m.ownerId === currentUser._id;
            return (
              <div className="card listing-card" key={m._id}>
                <div className="listing-top">
                  <h3 className="listing-name">{m.machineName}</h3>
                  {isMine ? (
                    <span className="badge badge-you">You</span>
                  ) : (
                    <span
                      className={`badge ${m.availability === "Available" ? "badge-green" : "badge-gray"}`}>
                      {m.availability}
                    </span>
                  )}
                </div>
                <p className="listing-meta">
                  <FiMapPin size={14} /> {m.village}, {m.city}
                </p>
                <div className="listing-stats">
                  <div>
                    <strong>{m.type}</strong>Type
                  </div>
                  <div>
                    <strong>₹{m.rentPerDay}/day</strong>Rent
                  </div>
                  <div>
                    <strong>{m.ownerName}</strong>Owner
                  </div>
                </div>
                <div className="listing-actions">
                  {isMine ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => removeMachine(m._id)}>
                      Remove
                    </button>
                  ) : (
                    <a className="btn btn-outline" href={`tel:${m.phone}`}>
                      <FiPhone size={14} /> Contact Owner
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="List a Machine"
        subtitle="Enter your machine details">
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleSubmit(onAddMachine)}>
          <div className="form-row">
            <div className="form-group">
              <label>Machine Name</label>
              <input
                {...register("machineName", {
                  required: "Machine name is required",
                })}
                placeholder="e.g. Mahindra 575 Tractor"
              />
              {errors.machineName && (
                <span className="field-error">
                  {errors.machineName.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label>Type</label>
              <select {...register("type", { required: true })}>
                {machineTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Owner Name</label>
              <input
                {...register("ownerName", {
                  required: "Owner name is required",
                })}
                placeholder="Your name"
              />
              {errors.ownerName && (
                <span className="field-error">{errors.ownerName.message}</span>
              )}
            </div>
            <div className="form-group">
              <label>Rent / Day</label>
              <input
                type="number"
                {...register("rentPerDay", { required: "Rent is required" })}
                placeholder="₹ per day"
              />
              {errors.rentPerDay && (
                <span className="field-error">{errors.rentPerDay.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Village</label>
              <input
                {...register("village", { required: "Village is required" })}
                placeholder="Village"
              />
              {errors.village && (
                <span className="field-error">{errors.village.message}</span>
              )}
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                {...register("city", { required: "City is required" })}
                placeholder="City"
              />
              {errors.city && (
                <span className="field-error">{errors.city.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              maxLength={10}
              {...register("phone", { required: "Phone is required" })}
              placeholder="10 digit number"
            />
            {errors.phone && (
              <span className="field-error">{errors.phone.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <textarea rows={3} {...register("description")} />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setAddOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              List Machine
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Machinery;
