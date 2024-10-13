import PropTypes from "prop-types";

const Modal = ({ title, message, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
