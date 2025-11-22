"use client";

import { useState } from "react";

export default function AddStudentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const upload = async () => {
    if (!file) return alert("Please upload a JSON file");
    setLoading(true);
    setLogs([]);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/bulk-create-users", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLogs(data.logs || []);
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Bulk Add Students (Supabase Auth + Profiles)
      </h1>

      <input
        type="file"
        accept="application/json"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={upload}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#333",
          color: "white",
          borderRadius: "6px",
        }}
      >
        {loading ? "Uploading..." : "Upload & Create Users"}
      </button>

      <div style={{ marginTop: "30px" }}>
        <h3>Logs:</h3>
        <pre
          style={{
            background: "#111",
            color: "#0f0",
            padding: "20px",
            borderRadius: "10px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {logs.join("\n")}
        </pre>
      </div>
    </div>
  );
}
