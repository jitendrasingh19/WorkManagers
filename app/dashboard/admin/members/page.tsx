'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ConfirmDialog from "@/components/ConfirmDialogBox";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  email: string;
  plan: string;
  age?: number;
  weight?: number;
  height?: number;
  phone?: string;
  gender?: string;
  created_at?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMember,setViewMember] = useState<Member | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    plan: "",
    age: "",
    weight: "",
    height: "",
    phone: "",
    gender: "",
    password: ""
  });

  // ✅ Fetch members
  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setMembers(data || []);
  };

  useEffect(() => {
    fetchMembers();

    // Realtime subscription for members
    const channel = supabase
      .channel("realtime-members-page")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "members" },
        (payload) => {
          const newMember = payload.new as Member;
          toast.success(`🎉 ${newMember.name || "New Member"} joined!`);
          setMembers((prev) => [newMember, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "members" },
        (payload) => {
          const updatedMember = payload.new as Member;
          setMembers((prev) =>
            prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "members" },
        (payload) => {
          const deletedMember = payload.old as Member;
          setMembers((prev) => prev.filter((m) => m.id !== deletedMember.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ✅ Delete
 const deleteMember = async (id: string) => {
  await supabase.from("members").delete().eq("id", id);
  fetchMembers();
};

  // ✅ Open modal
  const openModal = (member?: Member) => {
    if (member) {
      setSelectedMember(member);
      setForm({
        name: member.name || "",
        email: member.email || "",
        plan: member.plan || "",
        age: member.age?.toString() || "",
        weight: member.weight?.toString() || "",
        height: member.height?.toString() || "",
        phone: member.phone || "",
        gender: member.gender || "",
        password: ""
      });
    } else {
      setSelectedMember(null);
      setForm({
        name: "",
        email: "",
        plan: "",
        age: "",
        weight: "",
        height: "",
        phone: "",
        gender: "",
        password: ""
      });
    }

    setIsModalOpen(true);
  };

  // ✅ Save
  const saveMember = async () => {
    if (!form.name || !form.email || !form.plan) return;

    if (selectedMember) {
      // Update existing member
      const payload = {
        name: form.name,
        email: form.email,
        plan: form.plan,
        age: form.age ? Number(form.age) : null,
        weight: form.weight ? Number(form.weight) : null,
        height: form.height ? Number(form.height) : null,
        phone: form.phone || "",
        gender: form.gender || "",
      };

      await supabase
        .from("members")
        .update(payload)
        .eq("id", selectedMember.id);
    } else {
      // Create new member via API
      if (!form.password) {
        alert("Password is required for new members");
        return;
      }

      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          plan: form.plan,
          age: form.age,
          weight: form.weight,
          height: form.height,
          phone: form.phone,
          gender: form.gender,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error creating member: ${error.error}`);
        return;
      }
    }

    setIsModalOpen(false);
    fetchMembers();
  };

  // ✅ Safe filter
  const filteredMembers = members.filter(
    (m) =>
      (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (

    
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <ConfirmDialog
  isOpen={!!deleteId}
  title="Delete Member"
  message="Are you sure you want to delete this member? This action cannot be undone."
  onCancel={() => setDeleteId(null)}
  onConfirm={async () => {
    if (deleteId) {
      await deleteMember(deleteId);
      setDeleteId(null);
    }
  }}
/>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Members</h1>
          <p className="text-sm text-gray-500">Manage your members</p>
        </div>

        <button
          onClick={() => openModal()}
          className="bg-black text-white px-4 py-2 rounded-xl text-sm"
        >
          + Add Member
        </button>
      </div>
      {viewMember && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl w-full max-w-xl">

      <h2 className="text-xl font-semibold mb-4">
        Member Profile
      </h2>

      <div className="space-y-3 text-sm">
        <p><strong>Name:</strong> {viewMember.name || "-"}</p>
        <p><strong>Email:</strong> {viewMember.email || "-"}</p>
        <p><strong>Plan:</strong> {viewMember.plan || "-"}</p>
        <p><strong>Age:</strong> {viewMember.age || "-"}</p>
        <p><strong>Weight:</strong> {viewMember.weight || "-"}</p>
        <p><strong>Height:</strong> {viewMember.height || "-"}</p>
        <p><strong>Phone:</strong> {viewMember.phone || "-"}</p>
        <p><strong>Gender:</strong> {viewMember.gender || "-"}</p>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => setViewMember(null)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}


      {/* Search */}
      <input
        type="text"
        placeholder="Search members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-80 border rounded-xl px-4 py-2 text-sm"
      />

      {/* Members List */}
      <div className="bg-white rounded-2xl border divide-y">

        {filteredMembers.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No members found</p>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-[2fr_1fr_1fr] items-center p-4 hover:bg-gray-50 transition"
            >

              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                  {member.name?.charAt(0)?.toUpperCase() || "?"}
                </div>

                <div>
                  <p
                onClick={() => setViewMember(member)}
                className="font-medium cursor-pointer hover:underline"
                  >
  {member.name || "No Name"}
</p>
                  <p className="text-xs text-gray-500">{member.email || "-"}</p>
                </div>
              </div>

              {/* Center */}
              <div className="flex justify-center">
                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">
                  {member.plan || "-"}
                </span>
              </div>

              {/* Right */}
              <div className="flex justify-end gap-3 text-sm">
                <button
                  onClick={() => openModal(member)}
                  className="text-gray-600 hover:text-black"
                >
                  Edit
                </button>

                <button
                 onClick={() => setDeleteId(member.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>

            </div>
          ))
        )}

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <h2 className="text-lg font-semibold mb-4">
              {selectedMember ? "Edit Member" : "Add Member"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input placeholder="Name *" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border px-3 py-2 rounded" />

              <input type="email" placeholder="Email *" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border px-3 py-2 rounded" />

              <input placeholder="Plan *" value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                className="border px-3 py-2 rounded" />

              <input type="number" placeholder="Age" value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="border px-3 py-2 rounded" />

              <input type="number" placeholder="Weight" value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="border px-3 py-2 rounded" />

              <input type="number" placeholder="Height" value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                className="border px-3 py-2 rounded" />

              <input placeholder="Phone" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="border px-3 py-2 rounded" />

              <select value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="border px-3 py-2 rounded">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              {!selectedMember && (
                <input type="password" placeholder="Password *"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="border px-3 py-2 rounded md:col-span-2" />
              )}

            </div>
            

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>

              <button
                onClick={saveMember}
                className="bg-black text-white px-4 py-2 rounded"
              >
                {selectedMember ? "Update" : "Add Member"}
              </button>
            </div>

          </div>
        </div>
        
      )}

    </div>
    
  );
}