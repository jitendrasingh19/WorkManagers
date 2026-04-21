'use client';

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CreditCard, Plus } from "lucide-react";

interface Payment {
  id: number;
  member_id: string;
  amount: number;
  status: "paid" | "pending";
  method: "cash" | "upi" | "card";
  date: string;
  plan: string;
  duration: string;
}

interface MemberOption {
  id: string;
  name: string;
}

const statusOptions = ["paid", "pending"] as const;
const methodOptions = ["cash", "upi", "card"] as const;

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formError: string | null;
  newPayment: {
    memberId: string;
    amount: string;
    status: string;
    method: string;
    date: string;
    plan: string;
    duration: string;
  };
  setNewPayment: React.Dispatch<React.SetStateAction<{
    memberId: string;
    amount: string;
    status: string;
    method: string;
    date: string;
    plan: string;
    duration: string;
  }>>;
  members: MemberOption[];
  statusOptions: readonly ["paid", "pending"];
  methodOptions: readonly ["cash", "upi", "card"];
}

function PaymentModal({
  show,
  onClose,
  onSubmit,
  formError,
  newPayment,
  setNewPayment,
  members,
  statusOptions,
  methodOptions,
}: PaymentModalProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Add Payment</h2>

        {formError && (
          <p className="text-red-500 text-sm mb-3">{formError}</p>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <select
            value={newPayment.memberId}
            onChange={(e) =>
              setNewPayment({ ...newPayment, memberId: e.target.value })
            }
            className="w-full border p-3 rounded-xl"
          >
            <option value="">Select Member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={newPayment.amount}
            onChange={(e) =>
              setNewPayment({ ...newPayment, amount: e.target.value })
            }
            className="w-full border p-3 rounded-xl"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={newPayment.plan}
              onChange={(e) =>
                setNewPayment({ ...newPayment, plan: e.target.value })
              }
              className="border p-3 rounded-xl"
            >
              <option>Basic</option>
              <option>Pro</option>
              <option>Premium</option>
            </select>

            <select
              value={newPayment.duration}
              onChange={(e) =>
                setNewPayment({ ...newPayment, duration: e.target.value })
              }
              className="border p-3 rounded-xl"
            >
              <option>1 Month</option>
              <option>3 Months</option>
              <option>6 Months</option>
              <option>1 Year</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={newPayment.status}
              onChange={(e) =>
                setNewPayment({ ...newPayment, status: e.target.value })
              }
              className="border p-3 rounded-xl"
            >
              {statusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <select
              value={newPayment.method}
              onChange={(e) =>
                setNewPayment({ ...newPayment, method: e.target.value })
              }
              className="border p-3 rounded-xl"
            >
              {methodOptions.map((m) => (
                <option key={m}>{m.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <button className="w-full bg-black text-white py-3 rounded-xl hover:bg-orange-600">
            Save Payment
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [newPayment, setNewPayment] = useState({
    memberId: "",
    amount: "",
    status: "paid",
    method: "cash",
    date: "",
    plan: "Basic",
    duration: "1 Month",
  });

  const getMemberName = (memberId: string) => {
    return members.find((member) => member.id === memberId)?.name ?? "Unknown";
  };

  useEffect(() => {
    fetchPayments();
    fetchMembers();
  }, []);

  // ✅ FETCH PAYMENTS WITH JOIN
  const fetchPayments = async () => {
    setFetchError(null);

    const { data, error } = await supabase
      .from("payments")
      .select("id, member_id, amount, status, method, date, plan, duration")
      .order("date", { ascending: false });

    if (error) {
      setFetchError(error.message);
      setPayments([]);
      return;
    }

    setPayments((data ?? []) as Payment[]);

    // ✅ CALCULATE REVENUE
    const revenue = (data ?? [])
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);

    setTotalRevenue(revenue);
  };

  // ✅ FETCH MEMBERS FOR DROPDOWN
  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("id,name");

    if (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
      return;
    }

    setMembers(data ?? []);
  };

  // ✅ ADD PAYMENT
  const addPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!newPayment.memberId) {
      setFormError("Select a member.");
      return;
    }

    const amountValue = Number(newPayment.amount);
    if (!amountValue || amountValue <= 0) {
      setFormError("Enter valid amount.");
      return;
    }

    const { error } = await supabase.from("payments").insert([
      {
        member_id: newPayment.memberId,
        amount: amountValue,
        status: newPayment.status,
        method: newPayment.method.toLowerCase(),
        date: newPayment.date || new Date().toISOString().split("T")[0],
        plan: newPayment.plan,
        duration: newPayment.duration,
      },
    ]);

    if (error) {
      setFormError(error.message);
      return;
    }

    setNewPayment({
      memberId: "",
      amount: "",
      status: "paid",
      method: "cash",
      date: "",
      plan: "Basic",
      duration: "1 Month",
    });

    setShowForm(false);
    fetchPayments();
  };

  // ✅ DELETE PAYMENT
  const deletePayment = async (id: number) => {
    if (!confirm("Delete this payment?")) return;

    await supabase.from("payments").delete().eq("id", id);
    fetchPayments();
  };

 return (
  <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
    
    
    {/* HEADER */}
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 mt-1">Manage all transactions</p>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition"
      >
        <Plus size={18} />
        {showForm ? "Close" : "Add Payment"}
      </button>
    </div>

    {/* REVENUE CARD */}
    <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Total Revenue</p>
        <h2 className="text-3xl font-bold text-green-600 mt-1">
          ₹{totalRevenue}
        </h2>
      </div>
      <div className="bg-green-100 text-green-600 p-3 rounded-xl">
        <CreditCard />
      </div>
    </div>

    {/* FORM */}
    <PaymentModal
      show={showForm}
      onClose={() => setShowForm(false)}
      onSubmit={addPayment}
      formError={formError}
      newPayment={newPayment}
      setNewPayment={setNewPayment}
      members={members}
      statusOptions={statusOptions}
      methodOptions={methodOptions}
    />

    {/* TABLE */}
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-3">Member</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Method</th>
              <th>Plan</th>
              <th>Duration</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 font-medium">
                  {getMemberName(p.member_id)}
                </td>

                <td className="font-semibold">₹{p.amount}</td>

                <td>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      p.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="uppercase text-xs text-gray-600">
                  {p.method}
                </td>

                <td>{p.plan}</td>
                <td>{p.duration}</td>

                <td className="text-gray-500">
                  {new Date(p.date).toLocaleDateString()}
                </td>

                <td>
                  <button
                    onClick={() => deletePayment(p.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);}