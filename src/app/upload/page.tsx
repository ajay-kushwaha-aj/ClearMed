"use client";

import { useState } from "react";

export default function UploadBill() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // POST to our OCR extraction endpoint
      const res = await fetch("http://localhost:5000/api/v1/bills", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Error processing bill. Check if backend is running.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 w-full">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900">Upload Hospital Bill</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Help the community by securely uploading your anonymized medical bills. Our AI strictly extracts only the total cost and treatment name, deliberately ignoring all personal identifiable information.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center">
        <div className="w-full border-2 border-dashed border-blue-200 rounded-xl p-12 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors">
          <input 
            type="file" 
            accept="image/*,.pdf" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 cursor-pointer mx-auto"
          />
          {file && <p className="mt-4 text-sm font-medium text-slate-700">Selected: {file.name}</p>}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all w-full max-w-xs"
        >
          {loading ? "Processing via AI..." : "Extract Data"}
        </button>
      </div>

      {result && (
        <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-emerald-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 p-2 rounded-full">
              <span className="text-xl">✅</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-900">Extraction Complete</h2>
              <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">{result.message}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400 mb-1">Hospital Name</p>
              <p className="font-semibold text-slate-800 text-lg">{result.extractedData?.hospitalName}</p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-400 mb-1">Treatment</p>
              <p className="font-semibold text-slate-800 text-lg">{result.extractedData?.treatmentName}</p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-400 mb-1">Total Cost</p>
              <p className="font-black text-emerald-600 text-2xl">₹{result.extractedData?.totalCost?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-400 mb-1">Date</p>
              <p className="font-semibold text-slate-800 text-lg">{result.extractedData?.date}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
              Confirm & Submit to Database
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
