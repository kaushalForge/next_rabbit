import React from "react";
import {
  HiArrowPathRoundedSquare,
  HiOutlineCreditCard,
  HiShoppingBag,
} from "react-icons/hi2";

const features = [
  {
    icon: HiShoppingBag,
    title: "Free International Shipping",
    desc: "On all orders over Rs.999",
    badge: "Free",
  },
  {
    icon: HiArrowPathRoundedSquare,
    title: "45 Days Return",
    desc: "No questions asked money back guarantee",
    badge: "Easy",
  },
  {
    icon: HiOutlineCreditCard,
    title: "Secure Checkout",
    desc: "100% encrypted & secure payment process",
    badge: "Safe",
  },
];

const Programs = () => {
  return (
    <section className="py-14 px-4 md:px-8 bg-white">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map(({ icon: Icon, title, desc, badge }) => (
          <div
            key={title}
            className="group relative flex items-start gap-5 p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-teal-900/80 hover:border-gray-900 transition-all duration-200 ease-in"
          >
            {/* Icon */}
            <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-white group-hover:bg-white/10 border border-gray-200 group-hover:border-white/10 transition-all duration-300 shadow-sm">
              <Icon className="text-xl text-gray-800 group-hover:text-white transition-colors duration-300" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="cursor-pointer text-sm font-bold text-gray-900 group-hover:text-white transition-colors duration-300 leading-snug">
                  {title}
                </h4>
                <span className="cursor-pointer shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 group-hover:bg-white/10 group-hover:text-white/50 transition-all duration-300">
                  {badge}
                </span>
              </div>
              <p className="cursor-pointer text-xs text-gray-500 group-hover:text-white/40 transition-colors duration-300 leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Programs;
