import { FiLoader, FiAlertTriangle, FiInbox } from "react-icons/fi";

const StatusBox = ({ type = "loading", title, message, action }) => {
  if (type === "loading") {
    return (
      <div className="status-box">
        <div className="status-icon"><FiLoader size={34} className="spin" /></div>
        <h3>{title || "Loading..."}</h3>
        {message && <p>{message}</p>}
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="status-box error">
        <div className="status-icon"><FiAlertTriangle size={34} /></div>
        <h3>{title || "Something went wrong"}</h3>
        {message && <p>{message}</p>}
        {action}
      </div>
    );
  }

  return (
    <div className="status-box">
      <div className="status-icon"><FiInbox size={34} /></div>
      <h3>{title || "Nothing here yet"}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
};

export default StatusBox;
