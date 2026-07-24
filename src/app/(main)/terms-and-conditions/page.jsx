export const metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions governing the use of Rabbit's website and services.",
};

const sections = [
  {
    title: "Acceptance of Terms",
    content: `By accessing or using the Rabbit website (next-rabbit.vercel.app), you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, you must discontinue use of the website immediately. We reserve the right to modify these terms at any time, and your continued use of the site constitutes acceptance of any changes.`,
  },
  {
    title: "Use of the Website",
    content: `You agree to use this website solely for lawful purposes. You must not misuse the site by introducing viruses, attempting unauthorised access, or engaging in any conduct that could harm Rabbit or its users. We reserve the right to restrict or terminate access to any user who violates these conditions.`,
  },
  {
    title: "Product Information & Pricing",
    content: `We make every effort to display product descriptions, colours, and pricing as accurately as possible. However, we do not warrant that product descriptions are entirely accurate or error-free. Prices are listed in Nepali Rupees (NPR) and are subject to change without notice. In the event of a pricing error, we reserve the right to cancel any affected orders.`,
  },
  {
    title: "Orders & Payment",
    content: `Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order at our discretion. Full payment is required at the time of checkout. We accept major payment methods as listed on the checkout page. All transactions are secured and encrypted.`,
  },
  {
    title: "Shipping & Delivery",
    content: `We aim to dispatch all orders within 1–3 business days. Delivery timelines vary by location and are estimated, not guaranteed. Rabbit is not responsible for delays caused by courier services, customs, or circumstances beyond our control. Please refer to our Shipping Policy for full details.`,
  },
  {
    title: "Returns & Refunds",
    content: `We offer a 45-day return policy on eligible items. Products must be returned in original, unworn condition with all tags intact. We do not accept returns on final sale or custom items. Please refer to our Refund Policy for full details on how to initiate a return.`,
  },
  {
    title: "Intellectual Property",
    content: `All content on this website — including but not limited to text, imagery, logos, and design — is the exclusive property of Rabbit and is protected under applicable intellectual property laws. Reproduction, distribution, or use of any content without prior written consent is strictly prohibited.`,
  },
  {
    title: "Limitation of Liability",
    content: `To the fullest extent permitted by law, Rabbit shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability in any matter shall not exceed the amount you paid for the order in question.`,
  },
  {
    title: "Governing Law",
    content: `These Terms and Conditions are governed by and construed in accordance with the laws of Nepal. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Kathmandu, Nepal.`,
  },
];

export default function TermsAndConditions() {
  return (
    <main className="bg-[#fafaf8] text-[#1a1a1a] font-sans">
      {/* Hero */}
      <section className="bg-[#1a1a1a] text-white py-24">
        <div className="container mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-light">
            Terms & Conditions
          </h1>
          <p className="text-white/50 mt-4 text-sm">
            Last updated: March 10, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Sticky Nav */}
          <aside className="hidden md:block">
            <div className="sticky top-8 space-y-2">
              <p className="text-xs tracking-widest uppercase text-[#888] mb-4 font-medium">
                Contents
              </p>
              {sections.map((s, i) => (
                <a
                  key={s.title}
                  href={`#tc-${i}`}
                  className="block text-sm text-[#555] hover:text-[#1a1a1a] py-1 border-l-2 border-transparent hover:border-[#d4a76a] pl-3 transition-all duration-200"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Body */}
          <div className="md:col-span-3 space-y-12">
            <div className="bg-white border border-[#e8e4df] p-6 text-sm text-[#555] leading-relaxed">
              Please read these terms carefully before using Rabbit&apos;s website or
              making a purchase. By using our services, you agree to these terms
              in full.
            </div>

            {sections.map((section, i) => (
              <div key={section.title} id={`tc-${i}`}>
                <h2 className="text-xl font-medium mb-4 flex items-start gap-3">
                  <span className="text-[#d4a76a] text-sm mt-1 font-normal">
                    0{i + 1}
                  </span>
                  {section.title}
                </h2>
                <p className="text-[#555] leading-relaxed text-[15px]">
                  {section.content}
                </p>
                {i < sections.length - 1 && (
                  <div className="border-b border-[#e8e4df] mt-12" />
                )}
              </div>
            ))}

            <div className="bg-[#1a1a1a] text-white p-8 mt-8">
              <h3 className="font-medium mb-3">
                Have a question about our terms?
              </h3>
              <p className="text-white/60 text-sm mb-5">
                Our team is happy to clarify any aspect of these terms before
                you make a purchase.
              </p>
              <a
                href="/contact"
                className="inline-block border border-white/30 px-6 py-2 text-sm tracking-widest uppercase hover:bg-white hover:text-[#1a1a1a] transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
