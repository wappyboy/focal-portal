import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "submissions"));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubmissions(data);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">All Submissions</h2>
      {submissions.map((entry, i) => (
        <div key={i} className="bg-white p-4 mb-4 shadow rounded">
          <p><strong>Name:</strong> {entry.name}</p>
          <p><strong>Region:</strong> {entry.region}</p>
          <p><strong>Date:</strong> {entry.submittedAt?.toDate().toLocaleString()}</p>
          <div className="mt-2">
            <p className="font-semibold">Agro Studies Files:</p>
            <ul className="list-disc ml-6">
              {entry.agroFiles.map((url, idx) => (
                <li key={idx}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View File {idx + 1}</a></li>
              ))}
            </ul>
          </div>
          <div className="mt-2">
            <p className="font-semibold">TESDA Files:</p>
            <ul className="list-disc ml-6">
              {entry.tesdaFiles.map((url, idx) => (
                <li key={idx}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View File {idx + 1}</a></li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
