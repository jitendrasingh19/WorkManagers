"use client";

import Link from "next/link";

type Trainer = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  specializations?: string[];
  experience?: number;
  status?: string;
  rating?: number | null;
  sessionsCompleted?: number;
  assignedClients?: number;
  joinedAt?: string;
};

export default function TrainerTable({ trainers = [] }: { trainers?: Trainer[] }) {
  if (!trainers.length) {
    return <div className="p-6 text-center text-gray-400">No trainers found</div>;
  }

  return (
    <div className="overflow-hidden border rounded-xl bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Photo</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Phone</th>
            <th className="px-4 py-3 text-left">Specializations</th>
            <th className="px-4 py-3 text-left">Experience</th>
            <th className="px-4 py-3 text-left">Sessions</th>
            <th className="px-4 py-3 text-left">Clients</th>
            <th className="px-4 py-3 text-left">Rating</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Joined</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {trainers.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">

              {/* Photo */}
              <td className="px-4 py-3">
                <img
                  src={t.photoUrl || "/placeholder.png"}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </td>

              {/* Name */}
              <td className="px-4 py-3">
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-gray-500">{t.email}</div>
              </td>

              {/* Phone */}
              <td className="px-4 py-3">{t.phone || "—"}</td>

              {/* Specializations */}
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {t.specializations?.map((s) => (
                    <span
                      key={s}
                      className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </td>

              {/* Experience */}
              <td className="px-4 py-3">
                {t.experience ? `${t.experience} yrs` : "—"}
              </td>

              {/* Sessions */}
              <td className="px-4 py-3">
                {t.sessionsCompleted?.toLocaleString()}
              </td>

              {/* Clients */}
              <td className="px-4 py-3">
                {t.assignedClients?.toLocaleString()}
              </td>

              {/* Rating */}
              <td className="px-4 py-3">
                {t.rating ? t.rating.toFixed(1) : "—"}
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <span className="text-xs px-2 py-1 rounded bg-gray-100">
                  {t.status}
                </span>
              </td>

              {/* Joined */}
              <td className="px-4 py-3">
                {t.joinedAt
                  ? new Date(t.joinedAt).toLocaleDateString()
                  : "—"}
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/dashboard/admin/trainers/${t.id}/edit`}
                  className="text-indigo-600"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}