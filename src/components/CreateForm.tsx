// // components/CreateForm.tsx
// "use client";
// import { useState } from "react";

// export default function CreateForm() {
//   const [url, setUrl] = useState("");
//   const [slug, setSlug] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch("/api/shorten", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Unknown error");
//       setSlug(data.slug);
//     } catch (err: any) {
//       setError(err.message || "Failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-3">
//       <input
//         value={url}
//         onChange={(e) => setUrl(e.target.value)}
//         placeholder="https://example.com/long/link"
//       />
//       <button disabled={loading} type="submit">
//         Create short link
//       </button>
//       {slug && (
//         <div>
//           Short link:{" "}
//           <a
//             href={`${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`}
//             target="_blank"
//             rel="noreferrer"
//           >
//             {process.env.NEXT_PUBLIC_BASE_URL}/{slug}
//           </a>
//         </div>
//       )}
//       {error && <div className="text-red-600">{error}</div>}
//     </form>
//   );
// }
