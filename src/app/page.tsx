"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          customSlug: slug || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setResult(data.shortUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 border">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          🔗 Simple URL Shortener
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Original URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Original URL
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Custom Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Slug (optional)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-short-link"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-500 text-center font-medium">{error}</p>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 text-center">
            <p className="text-gray-700 font-medium mb-2">Your short link:</p>
            <a
              href={result}
              target="_blank"
              className="text-blue-600 font-semibold hover:underline break-all"
            >
              {result}
            </a>
            <p className="text-gray-500 text-sm mt-2">
              Clicks will be tracked automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
