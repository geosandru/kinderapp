import { createContext, useContext, useState } from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div style={{ ...toastStyle, ...(toast.type === "error" ? errorStyle : successStyle) }}>
          {toast.type === "error" ? <FaExclamationTriangle /> : <FaCheckCircle />}
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

/* STILURI INLINE – fără fișier extern */
const toastStyle = {
  position: "fixed",
  top: "20px",
  right: "20px",
  background: "#ffe066",
  border: "2px dashed #ffb703",
  borderRadius: "16px",
  padding: "10px 16px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  zIndex: 9999,
  animation: "toastIn 0.3s ease"
};

const successStyle = {
  color: "#2b8a3e"
};

const errorStyle = {
  color: "#c92a2a"
};
