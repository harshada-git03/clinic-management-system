import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <div className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-line">
        <div className="max-w-[1180px] mx-auto flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-clay" />
            <span className="text-sm tracking-wider uppercase font-medium">Smart Clinic</span>
          </div>
          <div className="flex gap-2.5">
            <Link to="/login" className="text-moss text-sm font-medium px-4 py-2">Sign in</Link>
            <Link to="/signup" className="bg-moss text-white text-sm font-medium px-5 py-2.5 rounded-md">Get started</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1080px] mx-auto px-8 pt-16 md:pt-20 text-center">
        <div className="text-xs uppercase tracking-widest text-moss font-medium mb-5">Built for small clinic teams</div>
        <h1 className="font-display text-4xl md:text-6xl font-semibold leading-tight max-w-3xl mx-auto mb-5">
          The queue, the visit, and the bill — finally <span className="text-moss">one record</span>.
        </h1>
        <p className="text-lg text-muted max-w-xl mx-auto mb-8 leading-relaxed">
          Smart Clinic replaces the notebook at reception and the separate WhatsApp thread with doctors. One booking, tracked from token number to paid invoice.
        </p>
        <div className="flex gap-3 justify-center mb-16 flex-wrap">
          <Link to="/signup" className="bg-moss text-white px-6 py-3 rounded-md text-sm font-medium">Create free account</Link>
          <Link to="/login" className="border border-line px-6 py-3 rounded-md text-sm">Sign in</Link>
        </div>
      </div>

      <div className="max-w-[920px] mx-auto px-8 pb-24">
        <div className="border border-line rounded-xl shadow-2xl overflow-hidden bg-white">
          <div className="flex items-center gap-4 px-4 py-3 border-b border-line bg-sand">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D2CDBC]" />
              <span className="w-2 h-2 rounded-full bg-[#D2CDBC]" />
              <span className="w-2 h-2 rounded-full bg-[#D2CDBC]" />
            </div>
            <div className="flex-1 bg-white border border-line rounded text-xs text-muted font-mono px-3 py-1">
              smartclinic.app/front-desk
            </div>
          </div>
          <div className="p-6 text-left">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="font-display text-lg font-medium">Front desk</div>
                <div className="text-xs text-muted">12 Jul 2026 · all doctors</div>
              </div>
              <div className="bg-clay text-white text-xs px-3.5 py-2 rounded-md font-medium">+ New appointment</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-sand rounded-md px-3.5 py-3"><div className="text-[11px] text-muted mb-1">Today's tokens</div><div className="text-xl font-medium">16</div></div>
              <div className="bg-sand rounded-md px-3.5 py-3"><div className="text-[11px] text-muted mb-1">Awaiting confirmation</div><div className="text-xl font-medium">4</div></div>
              <div className="bg-sand rounded-md px-3.5 py-3"><div className="text-[11px] text-muted mb-1">Unpaid invoices</div><div className="text-xl font-medium">3</div></div>
            </div>
            {[
              ["014", "Ananya Deshmukh", "11:00 AM · Dr. Rohan Kulkarni", "Confirmed"],
              ["015", "Aarav Sharma", "11:30 AM · Dr. Rohan Kulkarni", "Pending"],
            ].map(([tok, name, meta, status]) => (
              <div key={tok} className="flex bg-paper border border-line rounded-md overflow-hidden mb-2">
                <div className="w-13 bg-moss-light flex items-center justify-center font-mono font-medium text-moss text-sm border-r border-dashed border-[#B9C4B6]">{tok}</div>
                <div className="flex-1 px-3.5 py-2.5">
                  <div className="text-[12.5px] font-medium">{name}</div>
                  <div className="text-[10.5px] text-muted">{meta}</div>
                </div>
                <span className={`self-center mr-3 text-[10px] px-2.5 py-1 rounded-full font-medium ${status === "Confirmed" ? "bg-moss-light text-moss" : "bg-clay-light text-clay"}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-sand py-20 px-8">
        <div className="max-w-[920px] mx-auto text-center mb-11">
          <div className="text-xs uppercase tracking-widest text-moss font-medium mb-3.5">The problem</div>
          <h2 className="font-display text-3xl font-semibold">Most clinics run three systems that don't talk to each other.</h2>
        </div>
        <div className="max-w-[920px] mx-auto grid grid-cols-1 md:grid-cols-2 border border-line rounded-xl overflow-hidden bg-line gap-px">
          <div className="bg-white p-7 opacity-75">
            <div className="text-[11px] uppercase tracking-wide text-muted font-medium mb-4">Without Smart Clinic</div>
            {["Appointments in a notebook", "Handwritten prescriptions, easy to lose", "Billing calculated by hand", "No link between visit and bill"].map((t) => (
              <div key={t} className="flex gap-2.5 text-sm text-muted line-through decoration-[#C7C2B0] py-2.5 border-b border-line last:border-0">
                <span>✕</span>{t}
              </div>
            ))}
          </div>
          <div className="bg-white p-7">
            <div className="text-[11px] uppercase tracking-wide text-moss font-medium mb-4">With Smart Clinic</div>
            {["Every booking gets a queue token", "Prescriptions tied to the visit", "Invoices calculated automatically", "One thread: booking → visit → bill"].map((t) => (
              <div key={t} className="flex gap-2.5 text-sm py-2.5 border-b border-line last:border-0">
                <span className="text-moss">✓</span>{t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-ink text-paper py-16 px-8">
        <div className="max-w-[920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-9 text-center">
          {[["4", "steps from booking to paid invoice"], ["3", "roles, each with their own view"], ["0", "spreadsheets left to maintain"]].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-5xl font-semibold mb-2">{n}</div>
              <div className="text-sm text-[#9DA89C]">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-24 px-8">
        <h2 className="font-display text-3xl font-semibold mb-3.5">Set up your clinic's queue today.</h2>
        <p className="text-muted mb-7">No spreadsheets. No double entry. One record per visit.</p>
        <Link to="/signup" className="bg-moss text-white px-6 py-3 rounded-md text-sm font-medium">Create free account</Link>
      </div>

      <div className="border-t border-line px-8 py-7 flex justify-between max-w-[1180px] mx-auto text-xs text-muted">
        <span>© 2026 Smart Clinic</span>
        <span>Built for small clinic teams</span>
      </div>
    </div>
  );
}