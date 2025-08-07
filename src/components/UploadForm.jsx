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

  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes

  const filterFiles = (files) => {
    return Array.from(files).filter((file) => file.size <= MAX_FILE_SIZE && file.type === "application/pdf");
  };

  const handleAgroChange = (e) => {
    const filtered = filterFiles(e.target.files);
    if (filtered.length !== e.target.files.length) {
      alert("Some Agro files were skipped. Only PDFs under 4MB are allowed.");
    }
    setAgroFiles(filtered);
  };

  const handleTesdaChange = (e) => {
    const filtered = filterFiles(e.target.files);
    if (filtered.length !== e.target.files.length) {
      alert("Some TESDA files were skipped. Only PDFs under 4MB are allowed.");
    }
    setTesdaFiles(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !region || agroFiles.length === 0 || tesdaFiles.length === 0) {
      alert("Please complete all fields and upload files.");
      return;
    }

    setUploading(true);

    try {
      const uploadFiles = async (files, folder) => {
        const urls = [];
        for (const file of files) {
          const fileRef = ref(storage, `uploads/${region}/${name}/${folder}/${uuidv4()}_${file.name}`);
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          urls.push({ name: file.name, url });
        }
        return urls;
      };

      const agroUrls = await uploadFiles(agroFiles, "AgroStudies");
      const tesdaUrls = await uploadFiles(tesdaFiles, "TESDA");

      await addDoc(collection(db, "submissions"), {
        name,
        region,
        agroFiles: agroUrls,
        tesdaFiles: tesdaUrls,
        submittedAt: Timestamp.now(),
      });

      alert("Upload successful!");
      setName("");
      setRegion("");
      setAgroFiles([]);
      setTesdaFiles([]);
      document.getElementById("agro-upload").value = "";
      document.getElementById("tesda-upload").value = "";
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-4">
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
          <option key={i + 1} value={`Region ${i + 1}`}>
            Region {i + 1}
          </option>
        ))}
      </select>

      <div>
        <label className="font-medium block mb-1">Agro Studies Requirements</label>
        <input
          id="agro-upload"
          type="file"
          multiple
          accept=".pdf"
          onChange={handleAgroChange}
          className="block w-full"
        />
        <p className="text-sm text-gray-500 mt-1">{agroFiles.length} valid PDF(s) selected</p>
      </div>

      <div>
        <label className="font-medium block mb-1">TESDA Requirements</label>
        <input
          id="tesda-upload"
          type="file"
          multiple
          accept=".pdf"
          onChange={handleTesdaChange}
          className="block w-full"
        />
        <p className="text-sm text-gray-500 mt-1">{tesdaFiles.length} valid PDF(s) selected</p>
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