import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Ticket from "../components/Ticket";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { getMyAppointments, updateAppointmentStatus } from "../api/appointmentApi";
import { createPrescription } from "../api/prescriptionApi";
import { getAllMedicines } from "../api/medicineApi";
import { updateMyDoctorProfile } from "../api/doctorApi";
const NAV = [
  { key: "today", label: "Today's schedule" },
  { key: "rx", label: "Prescriptions" },
  { key: "profile", label: "My profile" },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("today");
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [rxForAppt, setRxForAppt] = useState(null);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([{ medicineId: "", dosage: "", frequency: "", durationDays: "", instructions: "" }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [a, m] = await Promise.all([getMyAppointments(), getAllMedicines()]);
      setAppointments(a.data);
      setMedicines(m.data);
    } catch {
      setError("Couldn't load your schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const confirmed = appointments.filter((a) => a.status === "CONFIRMED").length;
  const pending = appointments.filter((a) => a.status === "PENDING").length;
  const completed = appointments.filter((a) => a.status === "COMPLETED").length;

  const markCompleted = async (id) => {
    try {
      await updateAppointmentStatus(id, { status: "COMPLETED" });
      load();
    } catch {
      setError("Couldn't update status.");
    }
  };

  const addItem = () => setItems([...items, { medicineId: "", dosage: "", frequency: "", durationDays: "", instructions: "" }]);
  const updateItem = (i, field, val) => {
    const next = [...items];
    next[i][field] = val;
    setItems(next);
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createPrescription({
        appointmentId: rxForAppt.id,
        notes,
        items: items.map((it) => ({ ...it, medicineId: Number(it.medicineId), durationDays: Number(it.durationDays) })),
      });
      setSuccess("Prescription saved.");
      setRxForAppt(null);
      setNotes("");
      setItems([{ medicineId: "", dosage: "", frequency: "", durationDays: "", instructions: "" }]);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save prescription.");
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    try {
      await updateMyDoctorProfile({
        specialization: form.get("specialization"),
        qualification: form.get("qualification"),
        consultationFee: Number(form.get("consultationFee")) || null,
        availability: form.get("availability"),
      });
      setSuccess("Profile updated.");
    } catch {
      setError("Couldn't save profile.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[224px_1fr] min-h-screen">
      <Sidebar role="Doctor" navItems={NAV} active={tab} onNavClick={setTab} />
      <div className="px-5 md:px-9 py-6 md:py-7.5 bg-paper">
        {error && <div className="bg-danger-light text-danger text-sm rounded-md px-4 py-3 mb-4">{error}</div>}
        {success && <div className="bg-moss-light text-moss text-sm rounded-md px-4 py-3 mb-4">{success}</div>}
        {loading ? <div className="text-muted text-sm">Loading...</div> : (
          <>
            {tab === "today" && (
              <div>
                <h1 className="font-display text-xl font-medium">Today's schedule</h1>
                <p className="text-sm text-muted mt-1 mb-6.5">{appointments.length} appointments</p>
                <div className="grid grid-cols-3 gap-3.5 mb-6.5">
                  <StatCard label="Confirmed" value={confirmed} />
                  <StatCard label="Pending" value={pending} />
                  <StatCard label="Completed" value={completed} />
                </div>
                <div className="text-xs uppercase tracking-wide text-muted mb-3.5">Queue</div>
                <div className="flex flex-col gap-2.5 mb-6.5">
                  {appointments.map((a) => (
                    <div key={a.id}>
                      <Ticket token={String(a.id).padStart(3, "0")} title={a.patientName}
                        meta={`${new Date(a.scheduledAt).toLocaleString()} · ${a.reason || ""}`} status={a.status} />
                      {a.status === "CONFIRMED" && (
                        <div className="flex gap-2 mt-1.5 ml-1">
                          <button onClick={() => { setRxForAppt(a); setError(""); }} className="text-xs text-moss font-medium">Write prescription</button>
                          <span className="text-line">·</span>
                          <button onClick={() => markCompleted(a.id)} className="text-xs text-muted font-medium">Mark completed</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {appointments.length === 0 && <p className="text-sm text-muted">No appointments yet.</p>}
                </div>

                {rxForAppt && (
                  <div className="bg-white border border-line rounded-lg p-6.5 max-w-[560px]">
                    <div className="text-sm font-medium mb-4">Prescription for {rxForAppt.patientName}</div>
                    <form onSubmit={submitPrescription}>
                      <div className="mb-4">
                        <label className="block text-xs text-muted mb-1.5">Visit notes</label>
                        <textarea required value={notes} onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3 py-2.5 border border-line rounded-md text-sm" rows={2} />
                      </div>
                      {items.map((it, i) => (
                        <div key={i} className="border border-line rounded-md p-3.5 mb-2.5">
                          <select required value={it.medicineId} onChange={(e) => updateItem(i, "medicineId", e.target.value)}
                            className="w-full px-3 py-2 border border-line rounded-md text-sm mb-2">
                            <option value="">Select medicine</option>
                            {medicines.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <input required placeholder="Dosage (500mg)" value={it.dosage} onChange={(e) => updateItem(i, "dosage", e.target.value)} className="px-3 py-2 border border-line rounded-md text-sm" />
                            <input required placeholder="Frequency" value={it.frequency} onChange={(e) => updateItem(i, "frequency", e.target.value)} className="px-3 py-2 border border-line rounded-md text-sm" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="number" placeholder="Duration (days)" value={it.durationDays} onChange={(e) => updateItem(i, "durationDays", e.target.value)} className="px-3 py-2 border border-line rounded-md text-sm" />
                            <input placeholder="Instructions" value={it.instructions} onChange={(e) => updateItem(i, "instructions", e.target.value)} className="px-3 py-2 border border-line rounded-md text-sm" />
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={addItem} className="text-xs text-moss font-medium mb-4">+ Add another medicine</button>
                      <div className="flex gap-2.5">
                        <button type="button" onClick={() => setRxForAppt(null)} className="flex-1 border border-line py-2.5 rounded-md text-sm">Cancel</button>
                        <button type="submit" className="flex-1 bg-moss text-white py-2.5 rounded-md text-sm font-medium">Save prescription</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {tab === "rx" && (
              <div>
                <h1 className="font-display text-xl font-medium mb-6.5">Prescriptions written</h1>
                <p className="text-sm text-muted">Prescriptions you've written appear here after each visit. (Pulled from your appointment queue's completed visits.)</p>
              </div>
            )}

            {tab === "profile" && (
              <div>
                <h1 className="font-display text-xl font-medium mb-6.5">My profile</h1>
                <form onSubmit={handleProfileSave} className="bg-white border border-line rounded-lg p-6.5 max-w-[520px]">
                  <div className="flex items-center gap-3.5 mb-5 pb-4.5 border-b border-line">
                    <div className="w-12 h-12 rounded-full bg-moss text-white flex items-center justify-center font-medium">
                      {user?.fullName?.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{user?.fullName}</div>
                      <div className="text-xs text-muted">{user?.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs text-muted mb-1.5">Specialization</label>
                      <input name="specialization" className="w-full px-3 py-2.5 border border-line rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1.5">Consultation fee (₹)</label>
                      <input name="consultationFee" type="number" className="w-full px-3 py-2.5 border border-line rounded-md text-sm" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs text-muted mb-1.5">Qualification</label>
                    <input name="qualification" className="w-full px-3 py-2.5 border border-line rounded-md text-sm" />
                  </div>
                  <div className="mb-5">
                    <label className="block text-xs text-muted mb-1.5">Availability</label>
                    <input name="availability" placeholder="Mon–Fri, 9:00 AM – 5:00 PM" className="w-full px-3 py-2.5 border border-line rounded-md text-sm" />
                  </div>
                  <button type="submit" className="bg-moss text-white text-sm px-5 py-2.5 rounded-md font-medium">Save changes</button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
