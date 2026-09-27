import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus, FiPhone, FiMapPin, FiDollarSign } from "react-icons/fi";
import { apiRequest } from "../services/api";
import StatusBox from "../components/StatusBox";
import Modal from "../components/Modal";

const workTypes = [
  "Harvesting",
  "Ploughing",
  "Irrigation",
  "Sowing",
  "Spraying",
  "Farm Labour",
];

const Labour = () => {
  const [labours, setLabours] = useState([]);
  const [status, setStatus] = useState("loading");
  const [scope, setScope] = useState("village");
  const [currentUser, setCurrentUser] = useState(null);

  const [search, setSearch] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [detailsLabour, setDetailsLabour] = useState(null);
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

  const loadLabours = (currentScope) => {
    setStatus("loading");
    apiRequest(`/labours?scope=${currentScope}`)
      .then((data) => {
        setLabours(data.labours);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    loadLabours(scope);
  }, [scope]);

  const filteredLabours = labours.filter((l) => {
    const term = search.toLowerCase();
    const matchesSearch =
      l.name.toLowerCase().includes(term) ||
      l.village.toLowerCase().includes(term);
    const matchesWorkType = !workTypeFilter || l.workType === workTypeFilter;
    return matchesSearch && matchesWorkType;
  });

  const onAddLabour = async (data) => {
    setFormError("");
    try {
      await apiRequest("/labours", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          age: Number(data.age),
          experience: Number(data.experience),
          expectedSalary: Number(data.expectedSalary),
        }),
      });
      reset();
      setAddOpen(false);
      loadLabours(scope);
    } catch (error) {
      setFormError(error.message || "Failed to add your profile.");
    }
  };

  const removeLabour = async (id) => {
    if (!window.confirm("Are you sure you want to remove your profile?"))
      return;
    try {
      await apiRequest(`/labours/${id}`, { method: "DELETE" });
      loadLabours(scope);
    } catch {
      alert("Unable to remove profile.");
    }
  };

  return (
    <div className="container section">
      <h2 className="section-heading" style={{ textAlign: "left" }}>
        Hire Labour
      </h2>
      <p className="section-subheading" style={{ textAlign: "left" }}>
        Find skilled and reliable labour near you.
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
          placeholder="Search by name or village"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={workTypeFilter}
          onChange={(e) => setWorkTypeFilter(e.target.value)}>
          <option value="">All Work Types</option>
          {workTypes.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <FiPlus size={16} /> Add Yourself
        </button>
      </div>

      {status === "loading" && (
        <StatusBox type="loading" title="Loading labour..." />
      )}
      {status === "error" && (
        <StatusBox
          type="error"
          title="Could not load labour"
          message="Please try again in a moment."
        />
      )}

      {status === "ready" && filteredLabours.length === 0 && (
        <StatusBox
          type="empty"
          title="No labour available"
          message="Be the first person to add your labour profile here."
          action={
            <button
              className="btn btn-primary"
              onClick={() => setAddOpen(true)}>
              + Add Yourself
            </button>
          }
        />
      )}

      {status === "ready" && filteredLabours.length > 0 && (
        <div className="grid grid-3">
          {filteredLabours.map((l) => {
            const isMine = currentUser && l.ownerId === currentUser._id;
            return (
              <div className="card listing-card" key={l._id}>
                <div className="listing-top">
                  <h3 className="listing-name">{l.name}</h3>
                  {isMine ? (
                    <span className="badge badge-you">You</span>
                  ) : (
                    <span
                      className={`badge ${l.availability === "Available" ? "badge-green" : "badge-gray"}`}>
                      {l.availability}
                    </span>
                  )}
                </div>
                <p className="listing-meta">
                  <FiMapPin size={14} /> {l.village}, {l.city}
                </p>
                <div className="listing-stats">
                  <div>
                    <strong>{l.workType}</strong>Work Type
                  </div>
                  <div>
                    <strong>{l.experience} yrs</strong>Experience
                  </div>
                  <div>
                    <strong>₹{l.expectedSalary}/day</strong>Expected Salary
                  </div>
                  <div>
                    <strong>{l.age}</strong>Age
                  </div>
                </div>
                <div className="listing-actions">
                  {isMine ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => removeLabour(l._id)}>
                      Remove
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline"
                      onClick={() => setDetailsLabour(l)}>
                      View Details
                    </button>
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
        title="Add Yourself"
        subtitle="Enter your labour details">
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleSubmit(onAddLabour)}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Enter your name"
              />
              {errors.name && (
                <span className="field-error">{errors.name.message}</span>
              )}
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                min="18"
                {...register("age", { required: "Age is required" })}
                placeholder="Age"
              />
              {errors.age && (
                <span className="field-error">{errors.age.message}</span>
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

          <div className="form-row">
            <div className="form-group">
              <label>Work Type</label>
              <select {...register("workType", { required: true })}>
                <option value="">Select work</option>
                {workTypes.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Experience (Years)</label>
              <input
                type="number"
                min="0"
                {...register("experience", {
                  required: "Experience is required",
                })}
                placeholder="Years"
              />
              {errors.experience && (
                <span className="field-error">{errors.experience.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expected Salary / Day</label>
              <input
                type="number"
                {...register("expectedSalary", {
                  required: "Salary is required",
                })}
                placeholder="₹ per day"
              />
              {errors.expectedSalary && (
                <span className="field-error">
                  {errors.expectedSalary.message}
                </span>
              )}
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
          </div>

          <div className="form-group">
            <label>Availability</label>
            <select {...register("availability")}>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
            </select>
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
              Add Profile
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(detailsLabour)}
        onClose={() => setDetailsLabour(null)}
        title={detailsLabour?.name}
        subtitle={
          detailsLabour
            ? `From: ${detailsLabour.village}, ${detailsLabour.city}`
            : ""
        }>
        {detailsLabour && (
          <div>
            <div className="detail-item">
              <span>Age</span>
              <strong>{detailsLabour.age} Years</strong>
            </div>
            <div className="detail-item">
              <span>Work Type</span>
              <strong>{detailsLabour.workType}</strong>
            </div>
            <div className="detail-item">
              <span>Experience</span>
              <strong>{detailsLabour.experience} Years</strong>
            </div>
            <div className="detail-item">
              <span>Expected Salary</span>
              <strong>
                <FiDollarSign size={13} style={{ verticalAlign: "-2px" }} />
                {detailsLabour.expectedSalary}/day
              </strong>
            </div>
            <div className="detail-item">
              <span>Availability</span>
              <strong>{detailsLabour.availability}</strong>
            </div>
            <div className="detail-item">
              <span>Contact</span>
              <strong>
                <FiPhone size={13} style={{ verticalAlign: "-2px" }} />{" "}
                {detailsLabour.phone}
              </strong>
            </div>
            <div className="detail-item">
              <span>Description</span>
              <strong>{detailsLabour.description || "No description"}</strong>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Labour;
