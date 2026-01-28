import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-50">
      <div className="relative h-full w-full">
        {/* Petal 1 */}
        <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-purple-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-petal1"></div>
        {/* Petal 2 */}
        <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-petal2"></div>
        {/* Petal 3 */}
        <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-petal3"></div>
      </div>

      <style jsx>{`
        @keyframes petal1 {
          0% {
            transform: translate(-50%, -50%) translateY(-40px) scale(0.5);
            opacity: 0;
          }
          25% {
            transform: translate(-50%, -50%) translateY(-20px) scale(0.7);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) translateY(0) scale(1);
            opacity: 1;
          }
          75% {
            transform: translate(-50%, -50%) translateY(20px) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateY(40px) scale(0);
            opacity: 0;
          }
        }

        @keyframes petal2 {
          0% {
            transform: translate(-50%, -50%) translate(-30px, -30px) scale(0.5);
            opacity: 0;
          }
          25% {
            transform: translate(-50%, -50%) translate(-15px, -15px) scale(0.7);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
            opacity: 1;
          }
          75% {
            transform: translate(-50%, -50%) translate(15px, 15px) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(30px, 30px) scale(0);
            opacity: 0;
          }
        }

        @keyframes petal3 {
          0% {
            transform: translate(-50%, -50%) translate(30px, -30px) scale(0.5);
            opacity: 0;
          }
          25% {
            transform: translate(-50%, -50%) translate(15px, -15px) scale(0.7);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
            opacity: 1;
          }
          75% {
            transform: translate(-50%, -50%) translate(-15px, 15px) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(-30px, 30px) scale(0);
            opacity: 0;
          }
        }

        .animate-petal1 {
          animation: petal1 1.2s linear infinite;
        }
        .animate-petal2 {
          animation: petal2 1.2s linear infinite;
          animation-delay: 0.3s;
        }
        .animate-petal3 {
          animation: petal3 1.2s linear infinite;
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
}
