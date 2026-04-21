'use client';

import { useRouter } from "next/navigation";

export default function MemberCard({ member }: any) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/dashboard/manager/members/${member.id}`)}
      className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-md transition"
    >
      <h3 className="font-semibold text-lg">{member.name}</h3>
      <p className="text-sm text-gray-500">{member.email}</p>
      <p className="text-sm text-gray-600 mt-1">Plan: {member.plan}</p>

      <span className="inline-block mt-2 text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
        {member.status}
      </span>
    </div>
  );
}