export const metadata = {
  title: "FAQs",
  description:
    "Answers to the most common questions about Rabbit — orders, shipping, returns, and more.",
};

const categories = [
  {
    category: "Orders",
    icon: "📦",
    faqs: [
      {
        q: "How do I place an order?",
        a: "Browse our collection, select your size and colour, and click 'Add to Cart'. When you're ready, proceed to checkout and complete your payment. You'll receive an order confirmation email immediately.",
      },
      {
        q: "Can I modify or cancel my order?",
        a: "Orders can be modified or cancelled within 12 hours of placement. After this window, the order moves to fulfilment and changes cannot be guaranteed. Please contact us as soon as possible.",
      },
      {
        q: "How do I know my order was placed successfully?",
        a: "You will receive an email confirmation at the address provided during checkout. If you do not see it within 10 minutes, please check your spam folder or contact us.",
      },
    ],
  },
  {
    category: "Shipping",
    icon: "🚚",
    faqs: [
      {
        q: "How long does delivery take?",
        a: "Kathmandu Valley: 1–2 business days. Major cities across Nepal: 2–4 business days. Remote areas: 4–7 business days. International: 7–14 business days.",
      },
      {
        q: "Is shipping free?",
        a: "Yes — we offer free shipping on all orders over Rs.999 within Nepal. Orders below Rs.999 incur a flat shipping fee calculated at checkout.",
      },
      {
        q: "Can I track my delivery?",
        a: "Absolutely. Once your order is dispatched, you'll receive a tracking number via email. Use it on our courier partner's website to monitor your delivery in real time.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    icon: "↩",
    faqs: [
      {
        q: "What is your return policy?",
        a: "We offer a 45-day no-questions-asked return policy. Items must be returned unworn, unwashed, and with all original tags intact. See our full Refund Policy for details.",
      },
      {
        q: "How long does a refund take?",
        a: "Once we receive and inspect the returned item (2–3 business days), approved refunds are processed to your original payment method within 5–7 business days.",
      },
      {
        q: "What if I received a defective item?",
        a: "We're sorry to hear that. Contact us within 72 hours of delivery with your order number and photos of the defect. We'll arrange a free return and send a replacement or issue a full refund.",
      },
    ],
  },
  {
    category: "Products & Sizing",
    icon: "👔",
    faqs: [
      {
        q: "How do I find the right size?",
        a: "Each product page includes a detailed size guide with measurements in centimetres. When between sizes, we generally recommend sizing up for a more comfortable fit.",
      },
      {
        q: "Are the colours accurate to what I'll receive?",
        a: "We make every effort to photograph our products accurately. However, screen calibration can affect colour perception. If you have concerns about a specific product, contact us before purchasing.",
      },
      {
        q: "How do I care for my Rabbit garments?",
        a: "Care instructions are printed on the label of each garment. As a general rule, we recommend cold machine wash, gentle cycle, and air drying to maintain quality and longevity.",
      },
    ],
  },
  {
    category: "Payments",
    icon: "💳",
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "We accept major credit and debit cards, as well as popular digital wallets. All payment methods available are displayed at checkout.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All transactions are processed through encrypted, PCI-compliant payment gateways. We do not store your full card details on our servers.",
      },
      {
        q: "Why was my payment declined?",
        a: "Payment declines can occur due to insufficient funds, incorrect details, or bank restrictions on online transactions. Please verify your details or contact your bank. You may also try an alternative payment method.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <main className="bg-[#fafaf8] text-[#1a1a1a] font-sans">
      {/* Hero */}
      <section className="bg-[#1a1a1a] text-white py-24">
        <div className="container mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
            Help Centre
          </p>
          <h1 className="text-4xl md:text-5xl font-light leading-tight">
            Frequently Asked <br />
            <em className="italic">Questions</em>
          </h1>
          <p className="text-white/60 mt-5 max-w-xl">
            Can&apos;t find what you&apos;re looking for? Our support team is available
            Monday to Saturday, 9AM – 6PM.
          </p>
        </div>
      </section>

      {/* Category Tabs + Content */}
      <section className="container mx-auto px-6 py-20">
        {/* Quick Nav */}
        <div className="flex flex-wrap gap-3 mb-16">
          {categories.map((cat) => (
            <a
              key={cat.category}
              href={`#${cat.category.toLowerCase().replace(/ & /g, "-")}`}
              className="flex items-center gap-2 border border-[#e8e4df] bg-white px-4 py-2 text-sm text-[#555] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-200"
            >
              <span>{cat.icon}</span>
              {cat.category}
            </a>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-16">
          {categories.map((cat) => (
            <div
              key={cat.category}
              id={cat.category.toLowerCase().replace(/ & /g, "-")}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl">{cat.icon}</span>
                <h2 className="text-2xl font-light">{cat.category}</h2>
              </div>
              <div className="space-y-4">
                {cat.faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="group bg-white border border-[#e8e4df] open:border-[#1a1a1a] transition-colors duration-200"
                  >
                    <summary className="flex items-center justify-between px-7 py-5 cursor-pointer list-none">
                      <span className="font-medium text-[15px] pr-4">
                        {faq.q}
                      </span>
                      <span className="shrink-0 w-5 h-5 border border-[#e8e4df] flex items-center justify-center text-xs group-open:bg-[#1a1a1a] group-open:text-white group-open:border-[#1a1a1a] transition-all duration-200">
                        +
                      </span>
                    </summary>
                    <div className="px-7 pb-6 text-sm text-[#555] leading-relaxed border-t border-[#e8e4df] pt-5">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-20 bg-[#1a1a1a] text-white p-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-4 font-medium">
            Still need help?
          </p>
          <h2 className="text-2xl font-light mb-4">We&apos;re here for you.</h2>
          <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
            Our support team is ready to assist with any question not covered
            above. Reach out and we&apos;ll get back to you within 24 hours.
          </p>
          <a
            href="/contact"
            className="inline-block border border-white/30 px-10 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-[#1a1a1a] transition-all duration-300"
          >
            Contact Support
          </a>
        </div>
      </section>
    </main>
  );
}
