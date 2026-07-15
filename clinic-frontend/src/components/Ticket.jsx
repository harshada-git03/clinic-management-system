export default function Ticket({ token, title, meta, status }) {
  const statusStyles = {
    PENDING: "bg-clay-light text-clay",
    CONFIRMED: "bg-moss-light text-moss",
    COMPLETED: "bg-sand text-[#5A5A50]",
    CANCELLED: "bg-danger-light text-danger",
    PAID: "bg-moss-light text-moss",
  };
  return (
    <div className="flex flex-col sm:flex-row bg-white border border-line rounded-lg overflow-hidden hover:border-moss transition-colors">
      <div className="sm:w-[72px] flex-shrink-0 bg-moss-light flex sm:flex-col items-center justify-center gap-2 sm:gap-0 border-b sm:border-b-0 sm:border-r border-dashed border-[#B9C4B6] px-4 py-2 sm:py-2.5">
        <div className="font-mono text-lg font-medium text-moss">{token}</div>
        <div className="text-[9px] uppercase tracking-wide text-[#7C8A79]">Token</div>
      </div>
      <div className="flex-1 px-4 py-3.5 flex justify-between items-center flex-wrap gap-2">
        <div>
          <div className="text-[14.5px] font-medium">{title}</div>
          <div className="text-xs text-muted mt-0.5">{meta}</div>
        </div>
        <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${statusStyles[status] || ""}`}>
          {status}
        </span>
      </div>
    </div>
  );
}