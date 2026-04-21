"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function TrainerForm({ initialData, isEdit = false }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ INITIAL STATE (empty)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active",
    experience: "",
    sessionsCompleted: "",
    assignedClients: "",
    rating: "",
    specializations: "",
    certifications: "",
    joinedAt: "",
    photoUrl: "",
  });

  // ✅ SYNC DATA WHEN EDITING
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        status: initialData.status || "active",
        experience: initialData.experience || "",
        sessionsCompleted: initialData.sessionsCompleted || "",
        assignedClients: initialData.assignedClients || "",
        rating: initialData.rating || "",
        specializations: initialData.specializations?.join(", ") || "",
        certifications: initialData.certifications?.join(", ") || "",
        joinedAt: initialData.joinedAt || "",
        photoUrl: initialData.photoUrl || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toArray = (value: string) =>
    value.split(",").map((v) => v.trim()).filter(Boolean);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      status: form.status,
      experience: Number(form.experience || 0),
      sessions_completed: Number(form.sessionsCompleted || 0),
      assigned_clients: Number(form.assignedClients || 0),
      rating: form.rating ? Number(form.rating) : null,
      specializations: toArray(form.specializations),
      certifications: toArray(form.certifications),
      joined_at: form.joinedAt || undefined,
      photo_url: form.photoUrl || null,
    };

    let error;

    if (isEdit) {
      const res = await supabase
        .from("trainers")
        .update(payload)
        .eq("id", initialData.id);

      error = res.error;
    } else {
      const res = await supabase.from("trainers").insert([payload]);
      error = res.error;
    }

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert(isEdit ? "Trainer updated!" : "Trainer added!");
    router.push("/dashboard/admin/trainers");
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border rounded-2xl p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" />

          <input name="photoUrl" value={form.photoUrl} onChange={handleChange} placeholder="Photo URL" className="w-full border p-2 rounded" />

          <input name="specializations" value={form.specializations} onChange={handleChange} placeholder="Specializations (comma separated)" className="w-full border p-2 rounded" />

          <input name="certifications" value={form.certifications} onChange={handleChange} placeholder="Certifications (comma separated)" className="w-full border p-2 rounded" />

          <input name="experience" type="number" value={form.experience} onChange={handleChange} placeholder="Experience (years)" className="w-full border p-2 rounded" />

          <input name="sessionsCompleted" type="number" value={form.sessionsCompleted} onChange={handleChange} placeholder="Sessions" className="w-full border p-2 rounded" />

          <input name="assignedClients" type="number" value={form.assignedClients} onChange={handleChange} placeholder="Clients" className="w-full border p-2 rounded" />

          <input name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} placeholder="Rating (1-5)" className="w-full border p-2 rounded" />

          <input name="joinedAt" type="date" value={form.joinedAt} onChange={handleChange} className="w-full border p-2 rounded" />

          <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>

          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">
            {loading ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Trainer" : "Add Trainer")}
          </button>
        </form>
      </div>
    </div>
  );
}