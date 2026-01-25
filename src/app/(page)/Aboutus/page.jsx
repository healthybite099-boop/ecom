import React from 'react'
import Image from 'next/image';
export default function AboutUsPage() {
  const brandCream = '#f7f3e8';
  const brandBrown = '#653825';

  return (
    <div style={{ backgroundColor: brandCream, color: brandBrown }} className="min-h-screen font-sans selection:bg-stone-300 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        {/* Background Decorative Elements - Hidden on small mobile to avoid layout shifts */}
        <div className="hidden sm:block absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 rounded-full opacity-10 -mr-10 -mt-10" style={{ border: `2px solid ${brandBrown}` }}></div>
        <div className="hidden sm:block absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-5 -ml-20 -mb-20" style={{ backgroundColor: brandBrown }}></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="uppercase tracking-[0.2em] text-xs md:text-sm font-bold opacity-70 mb-4 block">Established with Integrity</span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tighter italic">
            WOWNUTT
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed opacity-90 px-4">
            Bridging the gap between <strong>Scientific Purity</strong> and <strong>Nature's Finest Harvest</strong>.
          </p>
        </div>
      </section>

      {/* --- STATS / TRUST BAR --- */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 md:-mt-10 mb-16 md:mb-24 relative z-20">
        <div style={{ backgroundColor: brandBrown, color: brandCream }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 p-6 md:p-10 rounded-2xl shadow-2xl">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1">100%</div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-70 font-semibold">Lab Verified</div>
          </div>
          <div className="text-center border-l border-white/20">
            <div className="text-2xl md:text-3xl font-bold mb-1">FSSAI</div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-70 font-semibold">Certified Safety</div>
          </div>
          <div className="text-center border-l border-white/20 sm:border-l-0 lg:border-l">
            <div className="text-2xl md:text-3xl font-bold mb-1">Premium</div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-70 font-semibold">Grade A++</div>
          </div>
          <div className="text-center border-l border-white/20">
            <div className="text-2xl md:text-3xl font-bold mb-1">GST</div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-70 font-semibold">Fully Verified</div>
          </div>
        </div>
      </div>

      {/* --- THE FOUNDER STORY --- */}
      <section className="max-w-6xl mx-auto px-6 mb-20 md:mb-32">
        <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
             <div className="relative">
                <div className="absolute -top-3 -left-3 w-full h-full border-2 rounded-2xl" style={{ borderColor: brandBrown }}></div>
                <div className="relative bg-stone-200 aspect-square md:h-[500px] rounded-2xl overflow-hidden flex items-center justify-center border border-stone-300 shadow-inner">
                  <Image
                  className=' object-cover'
                  fill
                  src="/img/onwer.png"
                  />
                </div>
             </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-4 md:space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Driven by Ethics, <br className="hidden md:block"/>Led by <span className="italic underline decoration-stone-400">Ankit Sharma</span>
            </h2>
            <p className="text-base md:text-lg opacity-90 leading-relaxed">
              Wownutt isn't just a business; it’s a personal mission. Our founder, <strong>Ankit Sharma</strong>, built this brand on the principle that transparency should be the first ingredient in every pack. 
            </p>
            <p className="text-base md:text-lg opacity-90 leading-relaxed font-medium">
              Known for his unwavering integrity, Ankit has personally overseen the acquisition of all government verifications—FSSAI, GST, and Lab Certification—to ensure Wownutt is a name you can trust in your home.
            </p>
          </div>
        </div>
      </section>

      {/* --- QUALITY CARDS --- */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'rgba(101, 56, 37, 0.04)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Wownutt Exists</h2>
            <div className="w-16 h-1 mx-auto" style={{ backgroundColor: brandBrown }}></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "Lab-Tested Purity", desc: "Every batch is verified in professional labs to ensure zero chemicals and maximum nutrition for your family." },
              { title: "Govt Documents", desc: "Total transparency with FSSAI, GST, and legal verifications. We take our documentation seriously." },
              { title: "Handpicked Quality", desc: "No bulk-buy shortcuts. Every almond and walnut is inspected for size, crunch, and authentic taste." }
            ].map((item, idx) => (
              <div key={idx} className="p-8 md:p-10 rounded-3xl bg-white shadow-sm border border-stone-200 hover:shadow-xl transition-all duration-300 group">
                <div style={{ backgroundColor: brandBrown }} className="w-10 h-10 rounded-full mb-6 flex items-center justify-center text-white font-bold group-hover:rotate-[360deg] transition-transform duration-500">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm md:text-base opacity-80 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DETAILED CONTENT --- */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-32 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 italic leading-snug">Snacking Reinvented for the <br className="md:hidden"/> Modern Family</h2>
        <div className="space-y-6 md:space-y-8 text-lg md:text-xl font-light leading-relaxed">
          <p>
            In today's market, finding genuine quality is a challenge. That’s why Wownutt takes the extra step. We are a **Government Verified** entity that puts health above profits. Our commitment to GST and FSSAI compliance isn't just about paperwork—it's about holding ourselves to a standard that ensures you get exactly what you pay for.
          </p>
          <p>
            Under the ethical vision of **Ankit Sharma**, we promise that every cashew, almond, and walnut is as pure as nature intended, verified by modern science, and delivered with the heart of a person who cares.
          </p>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <footer className="pb-16 md:pb-24 px-4 sm:px-6">
        <div style={{ backgroundColor: brandBrown, color: brandCream }} className="max-w-6xl mx-auto rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Experience the <br className="sm:hidden"/> Wownutt Standard</h2>
          <p className="text-sm md:text-lg opacity-80 mb-8 max-w-xl mx-auto uppercase tracking-[0.15em] font-semibold relative z-10">
            Lab Tested • Govt Verified • Founder Led
          </p>
          <button style={{ backgroundColor: brandCream, color: brandBrown }} className="w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 rounded-full font-black text-base md:text-lg hover:scale-105 transition-transform shadow-lg relative z-10">
            SHOP THE COLLECTION
          </button>
        </div>
      </footer>
    </div>
  )
}