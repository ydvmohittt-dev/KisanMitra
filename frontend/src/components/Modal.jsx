import { FiX } from "react-icons/fi";

const Modal = ({ open, onClose, title, subtitle, children }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <FiX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
