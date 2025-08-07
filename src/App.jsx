import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import UploadForm from "./components/UploadForm";
import Login from "./components/Auth";
import AdminDashboard from "./components/AdminDasboard";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  if (!user) return <Login onLogin={() => window.location.reload()} />;

  return (
    <Router>
      <div className="p-4 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Link to="/" className="font-bold text-xl">Portal</Link>
            <Link to="/admin" className="ml-6 text-blue-600 underline">Admin</Link>
          </div>
          <button onClick={() => signOut(auth)} className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
        </div>
        <Routes>
          <Route path="/" element={<UploadForm user={user} />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
