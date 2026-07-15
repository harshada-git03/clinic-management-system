import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import { getAllAppointments, updateAppointmentStatus } from "../api/appointmentApi";
import { generateInvoice, markInvoicePaid } from "../api/invoiceApi";
import { getAllMedicines, createMedicine } from "../api/medicineApi";

const NAV = [
  { key: "desk", label: "Front desk" },
  { key: "meds", label: "Medicine catalog" },
];

export default function ReceptionistDashboard() {
  const [tab, setTab] = useState("desk");
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [newMed, setNewMed] = useState({ name: "", manufacturer: "", unitPrice: "", stockQuantity: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [a, m] = await Promise.all([getAllAppointments(), getAllMedicines()]);
      setAppointments(a.data);
      setMedicines(m.data);
    } catch {
      setError("Couldn't load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const confirm = async (id) => {
    try { await updateAppointmentStatus(id, { status: "CONFIRMED" }); load(); }
    catch { setError("Couldn't confirm appointment."); }
  };

  const bill = async (appointmentId) => {
    setError(""); setSuccess("");
    try {
      const res = await generateInvoice(appointmentId);
      setSuccess(`Invoice generated — ₹${res.data.totalAmount.toFixed(2)}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't generate invoice.");
    }
  };

  const addMedicine = async (e) => {
    e.preventDefault();
    try {
      await createMedicine({ ...newMed, unitPrice: Number(newMed.unitPrice), stockQuantity: Number(newMed.stockQuantity) || 0 });
      setNewMed({ name: "", manufacturer: "", unitPrice: "", stockQuantity: "" });
      load();
    } catch {
      setError("Couldn't add medicine.");
    }
  };

  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;
  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;

  const statusStyles = {
    PENDING: "bg-clay-light text-clay",
    CONFIRMED: "bg-moss-light text-moss",
    COMPLETED: "bg-sand text-[#5A5A50]",
    CANCELLED: "bg-danger-light text-danger",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[224px_1fr] min-h-screen">
      <Sidebar role="Receptionist" navItems={NAV} active={tab} onNavClick={setTab} />
      <div className="px-5 md:px-9 py-6 md:py-7.5 bg-paper">
        {error && <div className="bg-danger-light text-danger text-sm rounded-md px-4 py-3 mb-4">{error}</div>}
        {success && <div className="bg-moss-light text-moss text-sm rounded-md px-4 py-3 mb-4">{success}</div>}
        {loading ? <div className="text-muted text-sm">Loading...</div> : (
          <>
            {tab === "desk" && (
              <div>
                <h1 className="font-display text-xl font-medium">Front desk</h1>
                <p className="text-sm text-muted mt-1 mb-6.5">{appointments.length} total appointments</p>
                <div className="grid grid-cols-3 gap-3.5 mb-6.5">
                  <StatCard label="Total appointments" value={appointments.length} />
                  <StatCard label="Awaiting confirmation" value={pendingCount} />
                  <StatCard label="Confirmed" value={confirmedCount} />
                </div>
                <div className="text-xs uppercase tracking-wide text-muted mb-3.5">All appointments</div>
                <table className="w-full text-sm bg-white border border-line rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-sand text-left text-[11px] uppercase text-muted">
                      <th className="px-4 py-2.5">ID</th><th className="px-4 py-2.5">Patient</th><th className="px-4 py-2.5">Doctor</th>
                      <th className="px-4 py-2.5">Time</th><th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id} className="border-t border-line">
                        <td className="px-4 py-3 font-mono text-moss">{String(a.id).padStart(3, "0")}</td>
                        <td className="px-4 py-3">{a.patientName}</td>
                        <td className="px-4 py-3">{a.doctorName}</td>
                        <td className="px-4 py-3">{new Date(a.scheduledAt).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${statusStyles[a.status] || ""}`}>{a.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          {a.status === "PENDING" && (
                            <button onClick={() => confirm(a.id)} className="text-xs border border-line px-3 py-1.5 rounded-md">Confirm</button>
                          )}
                          {a.status === "CONFIRMED" || a.status === "COMPLETED" ? (
                            <button onClick={() => bill(a.id)} className="text-xs border border-line px-3 py-1.5 rounded-md">Bill</button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "meds" && (
              <div>
                <h1 className="font-display text-xl font-medium mb-6.5">Medicine catalog</h1>
                <form onSubmit={addMedicine} className="bg-white border border-line rounded-lg p-5 mb-6.5 grid grid-cols-4 gap-2.5 items-end">
                  <div><label className="block text-xs text-muted mb-1.5">Name</label>
                    <input required value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} className="w-full px-3 py-2 border border-line rounded-md text-sm" /></div>
                  <div><label className="block text-xs text-muted mb-1.5">Manufacturer</label>
                    <input value={newMed.manufacturer} onChange={(e) => setNewMed({ ...newMed, manufacturer: e.target.value })} className="w-full px-3 py-2 border border-line rounded-md text-sm" /></div>
                  <div><label className="block text-xs text-muted mb-1.5">Unit price (₹)</label>
                    <input required type="number" value={newMed.unitPrice} onChange={(e) => setNewMed({ ...newMed, unitPrice: e.target.value })} className="w-full px-3 py-2 border border-line rounded-md text-sm" /></div>
                  <button type="submit" className="bg-clay text-white text-sm px-4 py-2.5 rounded-md font-medium h-fit">+ Add</button>
                </form>
                <table className="w-full text-sm bg-white border border-line rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-sand text-left text-[11px] uppercase text-muted">
                      <th className="px-4 py-2.5">Medicine</th><th className="px-4 py-2.5">Manufacturer</th><th className="px-4 py-2.5">Unit price</th><th className="px-4 py-2.5">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((m) => (
                      <tr key={m.id} className="border-t border-line">
                        <td className="px-4 py-3">{m.name}</td>
                        <td className="px-4 py-3">{m.manufacturer || "—"}</td>
                        <td className="px-4 py-3 font-mono">₹{m.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3">{m.stockQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
