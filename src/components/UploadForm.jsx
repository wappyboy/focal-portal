import React, { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default function UploadForm() {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [agroFiles, setAgroFiles] = useState([]);
  const [tesdaFiles, setTesdaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !region) return alert("Please fill out all fields.");
    setUploading(true);

    const uploadFiles = async (files, folder) => {
      const urls = [];
      for (const file of files) {
        const fileRef = ref(storage, `uploads/${region}/${name}/${folder}/${uuidv4()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        urls.push(url);
      }
      return urls;
    };

    const agroUrls = await uploadFiles(agroFiles, "agro");
    const tesdaUrls = await uploadFiles(tesdaFiles, "tesda");

    await addDoc(collection(db, "submissions"), {
      name,
      region,
      agroFiles: agroUrls,
      tesdaFiles: tesdaUrls,
      submittedAt: Timestamp.now()
    });

    alert("Upload successful!");
    setName("");
    setRegion("");
    setAgroFiles([]);
    setTesdaFiles([]);
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Upload Applicant Requirements</h2>
      <input
        type="text"
        placeholder="Applicant Name"
        className="w-full p-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select
        className="w-full p-2 border rounded"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        required
      >
        <option value="">Select Region</option>
        {Array.from({ length: 17 }, (_, i) => (
          <option key={i + 1} value={`Region ${i + 1}`}>Region {i + 1}</option>
        ))}
      </select>
      <div>
        <label className="font-medium">Agro Studies Requirements</label>
        <input type="file" multiple accept=".pdf,.png" onChange={(e) => setAgroFiles(e.target.files)} />
      </div>
      <div>
        <label className="font-medium">TESDA Requirements</label>
        <input type="file" multiple accept=".pdf,.png" onChange={(e) => setTesdaFiles(e.target.files)} />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Submit"}
      </button>
    </form>
  );
}
