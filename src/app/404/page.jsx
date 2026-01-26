"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-lg w-full text-center">
        {/* Big 404 */}
        <h1 className="text-[120px] sm:text-[160px] font-extrabold text-gray-200 leading-none">
          404
        </h1>

        {/* Message */}
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800">
          Page not found
        </h2>

        <p className="mt-3 text-gray-600 text-sm sm:text-base">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Go Back
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition"
          >
            Go Home
          </Link>
        </div>

        {/* Footer hint */}
        <p className="mt-10 text-xs text-gray-400">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
