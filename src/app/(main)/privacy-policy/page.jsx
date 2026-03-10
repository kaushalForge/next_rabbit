export const metadata = {
  title: "Privacy Policy — Rabbit",
  description:
    "How Rabbit collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "Information We Collect",
    content: `When you place an order or create an account with Rabbit, we collect personal information including your name, email address, phone number, shipping address, and payment details. We may also collect browsing data such as pages visited, time spent on the site, and device information to improve your experience.`,
  },
  {
    title: "How We Use Your Information",
    content: `Your information is used solely to process and fulfil your orders, communicate order updates, respond to customer service inquiries, and improve our services. We do not sell, trade, or rent your personal information to any third party for marketing purposes.`,
  },
  {
    title: "Payment Security",
    content: `All payment transactions on Rabbit are encrypted using industry-standard SSL (Secure Socket Layer) technology. We do not store your full credit or debit card details on our servers. Payments are processed through trusted and certified payment gateways.`,
  },
  {
    title: "Cookies & Tracking",
    content: `We use cookies to enhance your browsing experience, remember your preferences, and analyse site traffic. You may choose to disable cookies through your browser settings, though certain features of our website may not function as intended as a result.`,
  },
  {
    title: "Third-Party Services",
    content: `We may share limited information with trusted third-party services such as shipping providers and analytics platforms (e.g., Google Analytics) strictly to operate our business. These parties are contractually bound to keep your information confidential and may not use it for any other purpose.`,
  },
  {
    title: "Data Retention",
    content: `We retain your personal data only for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. You may request deletion of your account and associated data at any time by contacting our support team.`,
  },
  {
    title: "Your Rights",
    content: `You have the right to access, correct, or delete the personal information we hold about you. You may also opt out of marketing communications at any time by clicking the unsubscribe link in any email or by contacting us directly.`,
  },
  {
    title: "Changes to This Policy",
    content: `We reserve the right to update this Privacy Policy at any time. Any significant changes will be communicated via email or a prominent notice on our website. Continued use of our services after such changes constitutes your acceptance of the revised policy.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="bg-[#fafaf8] text-[#1a1a1a] font-sans">
      {/* Hero */}
      <section className="bg-[#1a1a1a] text-white py-24">
        <div className="container mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-light leading-tight">
            Privacy Policy
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
                  href={`#section-${i}`}
                  className="block text-sm text-[#555] hover:text-[#1a1a1a] py-1 border-l-2 border-transparent hover:border-[#d4a76a] pl-3 transition-all duration-200"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Policy Body */}
          <div className="md:col-span-3 space-y-12">
            <div className="bg-white border border-[#e8e4df] p-6 text-sm text-[#555] leading-relaxed">
              <strong className="text-[#1a1a1a]">
                Your privacy matters to us.
              </strong>{" "}
              This policy explains how Rabbit ("we", "our", "us") handles the
              personal information you provide when using our website and
              services. Please read it carefully.
            </div>

            {sections.map((section, i) => (
              <div key={section.title} id={`section-${i}`}>
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
              <h3 className="font-medium mb-3">Questions about your data?</h3>
              <p className="text-white/60 text-sm mb-5">
                If you have any concerns about how we handle your information,
                please do not hesitate to reach out.
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
