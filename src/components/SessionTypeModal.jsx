import "./sessionmodal.css";

export default function SessionTypeModal({ child, onSelect, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{child.name}</h3>
        <p>Alege tipul sesiunii:</p>

        <button onClick={() => onSelect("normal")}>
          Sesiune normală
        </button>

        <button onClick={() => onSelect("double")}>
          2 sesiuni (100 lei, max 3h)
        </button>

        <button onClick={onClose}>
          Anulează
        </button>
      </div>
    </div>
  );
}
