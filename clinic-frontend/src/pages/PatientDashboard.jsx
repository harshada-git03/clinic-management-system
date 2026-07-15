import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import { getAllAppointments, updateAppointmentStatus } from "../api/appointmentApi";
import { generateInvoice, markInvoicePaid } from "../api/invoiceApi";
import { getAllMedicines, createMedicine } from "../api/medicineApi";
const NAV = [
  { key: "overview", label: "Overview" },
  { key: "appts", label: "Appointments" },
  { key: "rx", label: "Prescriptions" },
  { key: "bill", label: "Invoices" },
  { key: "profile", label: "My profile" },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ doctorId: "", scheduledAt: "", reason: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, a, r, i] = await Promise.all([
        getMyPatientProfile(),
        getMyAppointments(),
        getMyPrescriptions(),
        getMyInvoices(),
      ]);
      setProfile(p.data);
      setAppointments(a.data);
      setPrescriptions(r.data);
      setInvoices(i.data);
    } catch (e) {
      setError("Couldn't load your data. Try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const openBookingModal = async () => {
    setError("");
    try {
      const res = await getAllDoctors();
      setDoctors(res.data);
      setModalOpen(true);
    } catch {
      setError("Couldn't load doctor list.");
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await bookAppointment({
        doctorId: Number(bookingForm.doctorId),
        scheduledAt: bookingForm.scheduledAt,
        reason: bookingForm.reason,
      });
      setModalOpen(false);
      setBookingForm({ doctorId: "", scheduledAt: "", reason: "" });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Try a different time.");
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    try {
      await updateMyPatientProfile({
        dateOfBirth: form.get("dateOfBirth") || null,
        gender: form.get("gender"),
        bloodGroup: form.get("bloodGroup"),
        allergies: form.get("allergies"),
        medicalHistory: form.get("medicalHistory"),
        address: form.get("address"),
        emergencyContact: form.get("emergencyContact"),
      });
      loadAll();
    } catch {
      setError("Couldn't save profile.");
    }
  };

  const upcoming = appointments.find((a) => a.status === "CONFIRMED" || a.status === "PENDING");
  const initials = user?.fullName?.split(" ").map((w) => w[0]).slice(0, 2).join("") || "?";

  return (
    <div className="grid grid-cols-1 md:grid-cols-[224px_1fr] min-h-screen">
      <Sidebar role="Patient" navItems={NAV} active={tab} onNavClick={setTab} />
      <div className="px-5 md:px-9 py-6 md:py-7.5 bg-paper">
        {error && <div className="bg-danger-light text-danger text-sm rounded-md px-4 py-3 mb-4">{error}</div>}
        {loading ? (
          <div className="text-muted text-sm">Loading...</div>
        ) : (
          <>
            {tab === "overview" && (
              <div>
                <div className="flex justify-between items-start flex-wrap gap-3.5 mb-6.5">
                  <div>
                    <h1 className="font-display text-xl font-medium">Welcome back, {user?.fullName?.split(" ")[0]}</h1>
                    <p className="text-sm text-muted mt-1">Here's what's coming up.</p>
                  </div>
                  <button onClick={openBookingModal} className="bg-clay text-white text-sm px-4 py-2.5 rounded-md font-medium">
                    + Book appointment
                  </button>
                </div>
                <div className="text-xs uppercase tracking-wide text-muted mb-3.5 mt-6.5">Next visit</div>
                {upcoming ? (
                  <Ticket token={String(upcoming.id).padStart(3, "0")} title={`Dr. ${upcoming.doctorName}`}
                    meta={`${new Date(upcoming.scheduledAt).toLocaleString()} · ${upcoming.reason || ""}`}
                    status={upcoming.status} />
                ) : (
                  <p className="text-sm text-muted">No upcoming appointments.</p>
                )}
                <div className="text-xs uppercase tracking-wide text-muted mb-3.5 mt-6.5">Latest prescription</div>
                {prescriptions[0] ? (
                  <div className="bg-white border border-line border-l-[3px] border-l-moss rounded-md px-4.5 py-3.5">
                    <div className="text-sm font-medium">{prescriptions[0].items[0]?.medicineName}</div>
                    <div className="text-xs text-muted mt-1">{prescriptions[0].items[0]?.dosage} · {prescriptions[0].items[0]?.frequency}</div>
                  </div>
                ) : <p className="text-sm text-muted">No prescriptions yet.</p>}
              </div>
            )}

            {tab === "appts" && (
              <div>
                <div className="flex justify-between items-start flex-wrap gap-3.5 mb-6.5">
                  <h1 className="font-display text-xl font-medium">Appointments</h1>
                  <button onClick={openBookingModal} className="bg-clay text-white text-sm px-4 py-2.5 rounded-md font-medium">+ Book appointment</button>
                </div>
                <div className="flex flex-col gap-2.5">
                  {appointments.map((a) => (
                    <Ticket key={a.id} token={String(a.id).padStart(3, "0")} title={`Dr. ${a.doctorName}`}
                      meta={`${new Date(a.scheduledAt).toLocaleString()} · ${a.reason || ""}`} status={a.status} />
                  ))}
                  {appointments.length === 0 && <p className="text-sm text-muted">No appointments yet.</p>}
                </div>
              </div>
            )}

            {tab === "rx" && (
              <div>
                <h1 className="font-display text-xl font-medium mb-6.5">Prescriptions</h1>
                {prescriptions.map((p) => (
                  <div key={p.id} className="mb-3">
                    <div className="text-xs text-muted mb-1.5">{new Date(p.createdAt).toLocaleDateString()} · Dr. {p.doctorName}</div>
                    {p.items.map((it, i) => (
                      <div key={i} className="bg-white border border-line border-l-[3px] border-l-moss rounded-md px-4.5 py-3.5 mb-2">
                        <div className="text-sm font-medium">{it.medicineName}</div>
                        <div className="text-xs text-muted mt-1">{it.dosage} · {it.frequency} · {it.durationDays} days</div>
                      </div>
                    ))}
                  </div>
                ))}
                {prescriptions.length === 0 && <p className="text-sm text-muted">No prescriptions yet.</p>}
              </div>
            )}

            {tab === "bill" && (
              <div>
                <h1 className="font-display text-xl font-medium mb-6.5">Invoices</h1>
                <table className="w-full text-sm bg-white border border-line rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-sand text-left text-[11px] uppercase text-muted">
                      <th className="px-4 py-2.5">Visit</th><th className="px-4 py-2.5">Amount</th><th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-t border-line">
                        <td className="px-4 py-3">Appointment #{inv.appointmentId}</td>
                        <td className="px-4 py-3 font-mono">₹{inv.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${inv.status === "PAID" ? "bg-moss-light text-moss" : "bg-clay-light text-clay"}`}>{inv.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {invoices.length === 0 && <p className="text-sm text-muted mt-3">No invoices yet.</p>}
              </div>
            )}

            {tab === "profile" && profile && (
              <div>
                <h1 className="font-display text-xl font-medium mb-6.5">My profile</h1>
                <form onSubmit={handleProfileSave} className="bg-white border border-line rounded-lg p-6.5 max-w-[520px]">
                  <div className="flex items-center gap-3.5 mb-5 pb-4.5 border-b border-line">
                    <div className="w-12 h-12 rounded-full bg-moss text-white flex items-center justify-center font-medium">{initials}</div>
                    <div>
                      <div className="text-sm font-medium">{profile.fullName}</div>
                      <div className="text-xs text-muted">{profile.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs text-muted mb-1.5">Blood group</label>
                      <input name="bloodGroup" defaultValue={profile.bloodGroup || ""} className="w-full px-3 py-2.5 border border-line rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1.5">Gender</label>
                      <input name="gender" defaultValue={profile.gender || ""} className="w-full px-3 py-2.5 border border-line rounded-md text-sm" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs text-muted mb-1.5">Date of birth</label>
                    <input type="date" name="dateOfBirth" defaultValue={profile.dateOfBirth || ""} className="w-full px-3 py-2.5 border border-line rounded-md text-sm" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs text-muted mb-1.5">Allergies</label>
                    <input name="allergies" defaultValue={profile.allergies || ""} className="w-full px-3 py-2.5 border border-line rounded-md text-sm" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs text-muted mb-1.5">Medical history</label>
                    <input name="medicalHistory" defaultValue={profile.medicalHistory || ""} className="w-full px-3 py-2.5 border border-line rounded-md text-sm" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs text-muted mb-1.5">Address</label>
                    <input name="address" defaultValue={profile.address || ""} className="w-full px-3 py-2.5 border border-line rounded-md text-sm" />
                  </div>
                  <div className="mb-5">
                    <label className="block text-xs text-muted mb-1.5">Emergency contact</label>
                    <input name="emergencyContact" defaultValue={profile.emergencyContact || ""} className="w-full px-3 py-2.5 border border-line rounded-md text-sm" />
                  </div>
                  <button type="submit" className="bg-moss text-white text-sm px-5 py-2.5 rounded-md font-medium">Save changes</button>
                </form>
              </div>
            )}
          </>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Book appointment" subtitle="Pick a doctor and a time that works for you.">
        <form onSubmit={handleBook}>
          <div className="mb-4">
            <label className="block text-xs text-muted mb-1.5">Doctor</label>
            <select required value={bookingForm.doctorId} onChange={(e) => setBookingForm({ ...bookingForm, doctorId: e.target.value })}
              className="w-full px-3 py-2.5 border border-line rounded-md text-sm">
              <option value="">Select a doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.fullName} {d.specialization ? `— ${d.specialization}` : ""}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-muted mb-1.5">Date & time</label>
            <input required type="datetime-local" value={bookingForm.scheduledAt}
              onChange={(e) => setBookingForm({ ...bookingForm, scheduledAt: e.target.value })}
              className="w-full px-3 py-2.5 border border-line rounded-md text-sm" />
          </div>
          <div className="mb-5">
            <label className="block text-xs text-muted mb-1.5">Reason for visit</label>
            <input value={bookingForm.reason} onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
              placeholder="Follow-up checkup" className="w-full px-3 py-2.5 border border-line rounded-md text-sm" />
          </div>
          <div className="flex gap-2.5">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-line py-2.5 rounded-md text-sm">Cancel</button>
            <button type="submit" className="flex-1 bg-moss text-white py-2.5 rounded-md text-sm font-medium">Confirm booking</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
