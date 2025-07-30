import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppointmentsPage from "@/components/pages/AppointmentsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface">
        <Routes>
          <Route path="/" element={<AppointmentsPage />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;