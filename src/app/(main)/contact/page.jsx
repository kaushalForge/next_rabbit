export const metadata = {
  title: "Contact",
  description:
    "Reach out to the Rabbit team. We're here to help with orders, returns, and anything else you need.",
};

const contactDetails = [
  {
    icon: "📍",
    label: "Our Location",
    value: "Kathmandu, Nepal",
    sub: "Visit us in the heart of the city",
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+977 970-4063469",
    sub: "Mon – Sat, 9AM – 6PM",
  },
  {
    icon: "✉️",
    label: "Email",
    value: "inbox.rabbit@gmail.com",
    sub: "We reply within 24 hours",
  },
];

export default function Contact() {
  return (
    <main className="bg-[#fafaf8] text-[#1a1a1a] font-sans">
      {/* Hero */}
      <section className="bg-[#1a1a1a] text-white py-24">
        <div className="container mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-light leading-tight">
            We'd love to <br />
            <em className="italic">hear from you.</em>
          </h1>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {contactDetails.map((c) => (
            <div
              key={c.label}
              className="border border-[#e8e4df] p-8 hover:border-[#1a1a1a] transition-colors duration-300 bg-white"
            >
              <span className="text-2xl block mb-5">{c.icon}</span>
              <p className="text-xs tracking-widest uppercase text-[#888] mb-2 font-medium">
                {c.label}
              </p>
              <p className="text-[#1a1a1a] font-medium mb-1">{c.value}</p>
              <p className="text-sm text-[#888]">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Form + Map */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-light mb-8">Send us a message</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-[#888] block mb-2 font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full border border-[#e8e4df] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-[#888] block mb-2 font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full border border-[#e8e4df] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-[#888] block mb-2 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full border border-[#e8e4df] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-[#888] block mb-2 font-medium">
                  Subject
                </label>
                <select className="w-full border border-[#e8e4df] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors text-[#555]">
                  <option value="">Select a topic</option>
                  <option>Order Inquiry</option>
                  <option>Return / Exchange</option>
                  <option>Product Question</option>
                  <option>Shipping Issue</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-[#888] block mb-2 font-medium">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full border border-[#e8e4df] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none"
                />
              </div>
              <button className="w-full bg-[#1a1a1a] text-white py-4 text-sm tracking-widest uppercase hover:bg-[#d4a76a] transition-all duration-300">
                Send Message
              </button>
              <p className="text-xs text-[#aaa] text-center">
                We typically respond within 24 business hours.
              </p>
            </div>
          </div>

          {/* Map */}
          <div>
            <h2 className="text-2xl font-light mb-8">Find us in Kathmandu</h2>
            <div className="border border-[#e8e4df] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.31625946579!2d85.29111548906251!3d27.70904714261293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb978469b6e28717e!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
                width="100%"
                height="380"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Rabbit Store Location — Kathmandu, Nepal"
              />
            </div>
            <div className="mt-5 p-5 bg-white border border-[#e8e4df]">
              <p className="text-xs tracking-widest uppercase text-[#888] mb-2 font-medium">
                Business Hours
              </p>
              <div className="space-y-1 text-sm text-[#555]">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span className="font-medium text-[#1a1a1a]">
                    9:00 AM – 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-[#1a1a1a]">
                    10:00 AM – 4:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-[#aaa]">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
