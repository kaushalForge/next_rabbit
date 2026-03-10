export const metadata = {
  title: "Refund Policy — Rabbit",
  description:
    "Rabbit's 45-day refund and return policy. Easy, no-questions-asked returns.",
};

const steps = [
  {
    step: "01",
    title: "Initiate Your Return",
    desc: "Contact our support team within 45 days of receiving your order via email or phone with your order number.",
  },
  {
    step: "02",
    title: "Ship the Item Back",
    desc: "Pack the item securely in its original packaging with all tags attached and ship it to our return address.",
  },
  {
    step: "03",
    title: "We Inspect & Confirm",
    desc: "Once we receive your return, our team inspects the item within 2–3 business days and confirms eligibility.",
  },
  {
    step: "04",
    title: "Refund Processed",
    desc: "Approved refunds are issued to your original payment method within 5–7 business days of confirmation.",
  },
];

const eligible = [
  "Items returned within 45 days of delivery",
  "Unworn, unwashed, and unaltered products",
  "Items with all original tags attached",
  "Products in their original packaging",
  "Defective or incorrect items received",
];

const notEligible = [
  "Items marked as Final Sale or Non-Returnable",
  "Products that have been worn, washed, or altered",
  "Items without original tags or packaging",
  "Returns initiated after 45 days of delivery",
  "Custom or personalised orders",
];

export default function RefundPolicy() {
  return (
    <main className="bg-[#fafaf8] text-[#1a1a1a] font-sans">
      {/* Hero */}
      <section className="bg-[#1a1a1a] text-white py-24">
        <div className="container mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
            Returns & Refunds
          </p>
          <h1 className="text-4xl md:text-5xl font-light leading-tight">
            45-Day Return Policy
          </h1>
          <p className="text-white/60 mt-5 max-w-xl leading-relaxed">
            Not completely satisfied? We make returns simple, fair, and
            hassle-free. No unnecessary questions asked.
          </p>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="border-b border-[#e8e4df] bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-[#e8e4df] text-center">
            {[
              { icon: "↩", title: "45-Day Returns", sub: "No questions asked" },
              { icon: "🔒", title: "Secure Process", sub: "Safe & encrypted" },
              { icon: "⚡", title: "Fast Refunds", sub: "5–7 business days" },
            ].map((item) => (
              <div key={item.title} className="py-8 px-6">
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-[#888] mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
          The Process
        </p>
        <h2 className="text-3xl font-light mb-14">How to return an item</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="relative">
              <p className="text-5xl font-light text-[#e8e4df] mb-4">
                {s.step}
              </p>
              <h3 className="font-medium mb-3">{s.title}</h3>
              <p className="text-sm text-[#555] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Eligible / Not Eligible */}
      <section className="bg-white border-y border-[#e8e4df] py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-medium mb-6 flex items-center gap-3">
                <span className="w-6 h-6 bg-[#1a1a1a] text-white text-xs flex items-center justify-center rounded-full">
                  ✓
                </span>
                Eligible for Return
              </h2>
              <ul className="space-y-3">
                {eligible.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-[#555]"
                  >
                    <span className="text-[#d4a76a] mt-0.5 shrink-0">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-medium mb-6 flex items-center gap-3">
                <span className="w-6 h-6 bg-[#e8e4df] text-[#1a1a1a] text-xs flex items-center justify-center rounded-full">
                  ✕
                </span>
                Not Eligible for Return
              </h2>
              <ul className="space-y-3">
                {notEligible.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-[#555]"
                  >
                    <span className="text-[#ccc] mt-0.5 shrink-0">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Notes */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white border border-[#e8e4df] p-8">
            <h3 className="font-medium mb-4">Exchanges</h3>
            <p className="text-sm text-[#555] leading-relaxed">
              We currently do not offer direct exchanges. If you would like a
              different size or colour, please return the original item for a
              refund and place a new order separately.
            </p>
          </div>
          <div className="bg-white border border-[#e8e4df] p-8">
            <h3 className="font-medium mb-4">Defective or Wrong Items</h3>
            <p className="text-sm text-[#555] leading-relaxed">
              If you received a defective or incorrect item, contact us within
              72 hours of delivery with photographic evidence. We will cover
              return shipping and process a full refund or replacement at no
              additional cost.
            </p>
          </div>
          <div className="bg-white border border-[#e8e4df] p-8">
            <h3 className="font-medium mb-4">Return Shipping Cost</h3>
            <p className="text-sm text-[#555] leading-relaxed">
              Return shipping is at the customer's expense unless the item is
              defective or an error was made on our part. We recommend using a
              trackable shipping service.
            </p>
          </div>
          <div className="bg-[#1a1a1a] text-white p-8">
            <h3 className="font-medium mb-4">Need to start a return?</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Contact our support team with your order number and we'll guide
              you through every step.
            </p>
            <a
              href="/contact"
              className="inline-block border border-white/30 px-6 py-2 text-sm tracking-widest uppercase hover:bg-white hover:text-[#1a1a1a] transition-all duration-300"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
