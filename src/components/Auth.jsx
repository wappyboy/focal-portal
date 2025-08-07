import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Registration successful. You are now logged in.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuth();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded space-y-4">
      <h2 className="text-xl font-bold">{isRegistering ? "Register Account" : "Login"}</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        {isRegistering ? "Register" : "Login"}
      </button>

      <p className="text-sm text-center mt-2">
        {isRegistering ? (
          <>
            Already have an account?{" "}
            <button type="button" onClick={() => setIsRegistering(false)} className="text-blue-600 underline">
              Login here
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button type="button" onClick={() => setIsRegistering(true)} className="text-blue-600 underline">
              Register here
            </button>
          </>
        )}
      </p>
    </form>
  );
}
