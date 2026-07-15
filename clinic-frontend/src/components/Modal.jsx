export default function Modal({ open, onClose, title, subtitle, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-ink/45 z-50 flex items-center justify-center p-5" onClick={onClose}>
      <div className="bg-white rounded-xl p-7 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-muted mb-5">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}