import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About",
  description:
    "Learn about Rabbit — a premium Nepali clothing brand crafted for those who believe style is a statement.",
};

const values = [
  {
    title: "Intentional Design",
    description:
      "Every stitch, every cut, every colour is chosen with purpose. We don't follow trends — we craft pieces that outlast them.",
    icon: "✦",
  },
  {
    title: "Made in Nepal",
    description:
      "Proudly rooted in Nepal, our garments are produced locally — supporting artisans, reducing our footprint, and keeping quality close.",
    icon: "◈",
  },
  {
    title: "Worn Daily",
    description:
      "We build for real life — commutes, gatherings, lazy Sundays. Clothes that move with you without compromising how you look.",
    icon: "◉",
  },
  {
    title: "Transparent Pricing",
    description:
      "No inflated markups, no mystery fees. You pay for quality fabric and honest craftsmanship — nothing more.",
    icon: "◇",
  },
];

const stats = [
  { value: "500+", label: "Styles Available" },
  { value: "4.9★", label: "Average Rating" },
  { value: "2K+", label: "Happy Customers" },
  { value: "45", label: "Day Return Policy" },
];

export default function AboutPage() {
  return (
    <main className="bg-[#fafaf8] text-[#1a1a1a] font-sans">
      {/* Hero */}
      <section className="relative bg-[#1a1a1a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,#d4a76a,transparent_60%)]" />
        <div className="container mx-auto px-6 py-28 md:py-36 relative z-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
            Our Story
          </p>
          <h1 className="text-4xl md:text-6xl font-light leading-tight tracking-tight mb-8">
            Clothing is a <br />
            <em className="italic font-normal">silent language.</em>
          </h1>
          <p className="text-white/60 text-lg max-w-xl leading-relaxed">
            Rabbit was born from a simple belief — that what you wear carries
            meaning. We craft garments that speak before you do, designed for
            those who choose with intention.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#e8e4df]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e8e4df]">
            {stats.map((stat) => (
              <div key={stat.label} className="py-10 px-6 text-center">
                <p className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-2">
                  {stat.value}
                </p>
                <p className="text-xs tracking-widest uppercase text-[#888] font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
              Who We Are
            </p>
            <h2 className="text-3xl md:text-4xl font-light leading-snug mb-6">
              A Nepali brand built on quality, not compromise.
            </h2>
            <p className="text-[#555] leading-relaxed mb-5">
              Rabbit was founded in Kathmandu with one goal: to give the modern
              Nepali wardrobe the quality it deserves. We were tired of choosing
              between affordable and well-made. So we built something that
              refuses to compromise on either.
            </p>
            <p className="text-[#555] leading-relaxed mb-8">
              Our collections are designed in-house, produced locally, and
              priced with honesty. From everyday essentials to statement pieces,
              every item earns its place in your wardrobe.
            </p>
            <Link
              href="/"
              className="inline-block border border-[#1a1a1a] text-[#1a1a1a] px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#1a1a1a] hover:text-white transition-all duration-300"
            >
              Shop Collection
            </Link>
          </div>
          <div className="bg-[#f0ede8] aspect-square flex items-center justify-center">
            <div className="text-center p-12">
              <p className="text-7xl font-light text-[#1a1a1a]/10 leading-none mb-4">
                "
              </p>
              <p className="text-xl font-light text-[#1a1a1a] leading-relaxed italic">
                Dress well, live better. Not a slogan — a standard we hold
                ourselves to with every piece we make.
              </p>
              <p className="text-xs tracking-widest uppercase text-[#888] mt-6">
                — Rabbit, Founded in Kathmandu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#1a1a1a] text-white py-24">
        <div className="container mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
            What We Stand For
          </p>
          <h2 className="text-3xl md:text-4xl font-light mb-16">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {values.map((v) => (
              <div
                key={v.title}
                className="border border-white/10 p-8 hover:border-[#d4a76a]/50 transition-colors duration-300"
              >
                <span className="text-[#d4a76a] text-2xl block mb-5">
                  {v.icon}
                </span>
                <h3 className="text-lg font-medium mb-3">{v.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-24 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4a76a] mb-5 font-medium">
          Ready to Explore?
        </p>
        <h2 className="text-3xl md:text-4xl font-light mb-6">
          Wear it with intention.
        </h2>
        <p className="text-[#555] mb-10 max-w-md mx-auto">
          Browse our latest collection — thoughtfully designed, locally made,
          and built to last.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#1a1a1a] text-white px-10 py-4 text-sm tracking-widest uppercase hover:bg-[#d4a76a] transition-all duration-300"
        >
          Shop Now
        </Link>
      </section>
    </main>
  );
}
