"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/pastes", {
      method: "POST",
      body: JSON.stringify({ 
        content, 
        ttl_seconds: ttl ? parseInt(ttl) : undefined,
        max_views: views ? parseInt(views) : undefined 
      }),
    });
    const data = await res.json();
    if (data.url) setUrl(data.url);
  };

  return (
    <main className="p-10 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Pastebin Lite</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea 
          className="w-full h-40 p-3 border rounded text-black bg-white" 
          placeholder="Paste content here..." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div className="flex gap-4">
          <input type="number" placeholder="TTL (seconds)" className="border p-2 rounded w-full text-black" value={ttl} onChange={(e) => setTtl(e.target.value)} />
          <input type="number" placeholder="Max Views" className="border p-2 rounded w-full text-black" value={views} onChange={(e) => setViews(e.target.value)} />
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded font-bold">Create Paste</button>
      </form>
      {url && (
        <div className="p-4 bg-gray-100 rounded border flex flex-col gap-2">
          <p className="font-bold">Shareable Link:</p>
          <a href={url} className="text-blue-600 underline break-all">{url}</a>
        </div>
      )}
    </main>
  );
}