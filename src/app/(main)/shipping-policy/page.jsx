export const metadata = {
  title: "Shipping Policy",
  description:
    "Everything you need to know about NepStyle's shipping process, delivery timelines, and free shipping offer.",
};

const zones = [
  {
    zone: "Kathmandu Valley",
    time: "1–2 Business Days",
    cost: "Free on orders over Rs.999",
  },
  {
    zone: "Major Cities (Nepal)",
    time: "2–4 Business Days",
    cost: "Free on orders over Rs.999",
  },
  {
    zone: "Remote Areas (Nepal)",
    time: "4–7 Business Days",
    cost: "Calculated at checkout",
  },
  {
    zone: "International",
    time: "7–14 Business Days",
    cost: "Calculated at checkout",
  },
];

const faqs = [
  {
    q: "When will my order be dispatched?",
    a: "Orders are processed and dispatched within 1–3 business days of payment confirmation. You will receive a dispatch confirmation email with tracking details.",
  },
  {
    q: "Can I track my order?",
    a: "Yes. Once your order is dispatched, you will receive a tracking number via email. You can use this to monitor your delivery in real time.",
  },
  {
    q: "What if I am not home during delivery?",
    a: "Our courier partners will attempt delivery up to two times. If unsuccessful, the parcel will be held at a nearby facility for collection. You'll be notified via SMS or call.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship worldwide. International shipping fees and timelines are calculated at checkout based on your location.",
  },
  {
    q: "My order arrived damaged — what do I do?",
    a: "Please contact us within 72 hours of delivery with photographs of the damaged item and packaging. We will resolve the issue promptly at no cost to you.",
  },
];

export default function ShippingPolicy() {
  return (
    <main className="bg-[#fafaf8] text-[#1a1a1a] font-sans">
      {/* Hero */}
      <section className="bg-[#1a1a1a] text-white py-24">
        <div className="container mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
            Shipping
          </p>
          <h1 className="text-4xl md:text-5xl font-light">Shipping Policy</h1>
          <p className="text-white/60 mt-5 max-w-xl leading-relaxed">
            Fast, reliable delivery across Nepal and internationally. Free
            shipping on all orders over Rs.999.
          </p>
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className="bg-[#d4a76a] py-5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[#1a1a1a] font-medium text-sm tracking-wide">
            🚚 Free shipping on all orders over <strong>Rs.999</strong> —
            nationwide
          </p>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="container mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
          Delivery Zones
        </p>
        <h2 className="text-3xl font-light mb-12">Estimated delivery times</h2>
        <div className="border border-[#e8e4df] overflow-hidden">
          <div className="grid grid-cols-3 bg-[#1a1a1a] text-white text-xs tracking-widest uppercase px-6 py-4">
            <span>Destination</span>
            <span>Estimated Time</span>
            <span>Shipping Cost</span>
          </div>
          {zones.map((z, i) => (
            <div
              key={z.zone}
              className={`grid grid-cols-3 px-6 py-5 text-sm border-t border-[#e8e4df] ${
                i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"
              }`}
            >
              <span className="font-medium text-[#1a1a1a]">{z.zone}</span>
              <span className="text-[#555]">{z.time}</span>
              <span className="text-[#555]">{z.cost}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#aaa] mt-4">
          * Delivery times are estimates and may vary during peak seasons or
          public holidays.
        </p>
      </section>

      {/* Process */}
      <section className="bg-[#1a1a1a] text-white py-20">
        <div className="container mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
            Our Process
          </p>
          <h2 className="text-3xl font-light mb-12">From order to doorstep</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Order Confirmed",
                desc: "You receive an email confirmation immediately after checkout.",
              },
              {
                step: "02",
                title: "Order Processed",
                desc: "Our team picks and packs your order within 1–3 business days.",
              },
              {
                step: "03",
                title: "Dispatched",
                desc: "Your parcel is handed to our courier. Tracking details sent to you.",
              },
              {
                step: "04",
                title: "Delivered",
                desc: "Your order arrives at your doorstep within the estimated window.",
              },
            ].map((s) => (
              <div key={s.step} className="border border-white/10 p-6">
                <p className="text-4xl font-light text-white/10 mb-4">
                  {s.step}
                </p>
                <h3 className="font-medium mb-2">{s.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
          FAQs
        </p>
        <h2 className="text-3xl font-light mb-12">Common shipping questions</h2>
        <div className="space-y-5">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white border border-[#e8e4df] p-7">
              <h3 className="font-medium mb-3">{faq.q}</h3>
              <p className="text-sm text-[#555] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#1a1a1a] text-white p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="font-medium mb-1">Still have questions?</h3>
            <p className="text-white/60 text-sm">
              Our support team is available Mon–Sat, 9AM to 6PM.
            </p>
          </div>
          <a
            href="/contact"
            className="shrink-0 border border-white/30 px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-[#1a1a1a] transition-all duration-300 text-center"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}
