import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { ChevronLeft, Mail, Calendar, CreditCard, Hash, User, MapPin } from "lucide-react";

export default async function MemberProfilePage({ params }: any) {
  const { id } = params;

  const { data: member, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 font-sans">
        <p className="text-xl font-medium">Member profile not found</p>
        <Link href="/dashboard/manager/members" className="text-blue-600 hover:underline mt-2">
          Return to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans">
      {/* Navigation */}
      <Link 
        href="/dashboard/manager/members" 
        className="group inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> 
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
        {/* Dynamic Header Banner */}
        <div className="h-48 bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
          {/* Subtle Gym Branding Background */}
          <div className="absolute right-10 bottom-10 opacity-10">
             <h2 className="text-6xl font-black text-white italic tracking-tighter">IRON & STEEL</h2>
          </div>
        </div>
        
        <div className="px-6 md:px-12 pb-12">
          <div className="relative flex flex-col md:flex-row md:items-end -mt-20 md:space-x-8">
            {/* Interactive Profile Image */}
            <div className="relative group mx-auto md:mx-0">
              <div className="w-40 h-40 rounded-3xl bg-white p-1.5 shadow-2xl overflow-hidden">
                <img
                  src={member.image_url || `https://ui-avatars.com/api/?name=${member.name}&background=0D8ABC&color=fff&size=256`}
                  alt={member.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
              </div>
              <div className="absolute inset-1.5 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <p className="text-white text-xs font-bold uppercase tracking-widest">Update Photo</p>
              </div>
            </div>

            {/* Profile Title & Primary Stats */}
            <div className="mt-6 md:mb-4 text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center md:justify-start">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                  {member.name}
                </h1>
                <span className={`mx-auto md:mx-0 w-fit px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                  member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  ● {member.status}
                </span>
              </div>
              <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start mt-3">
                <Hash className="w-4 h-4 mr-1 text-blue-500" /> Member ID: {id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {/* Manage Buttons */}
            <div className="mt-8 md:mb-4 flex gap-2">
               <button className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-bold transition-all">
                 Freeze Account
               </button>
               <button className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
                 Edit Profile
               </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 border-y border-slate-50 py-8">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Plan</p>
              <p className="text-xl font-bold text-blue-600">{member.plan}</p>
            </div>
            <div className="text-center md:text-left border-l border-slate-100 pl-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Age</p>
              <p className="text-xl font-bold text-slate-900">{member.age || "—"} Years</p>
            </div>
            <div className="text-center md:text-left border-l border-slate-100 pl-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Check-ins</p>
              <p className="text-xl font-bold text-slate-900">24 <span className="text-xs text-slate-400">/mo</span></p>
            </div>
            <div className="text-center md:text-left border-l border-slate-100 pl-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joined</p>
              <p className="text-xl font-bold text-slate-900">
                {new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            
            {/* Left Col: Contact Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" /> Member Details
              </h3>
              <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Email Address</label>
                  <p className="text-slate-900 font-semibold flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-slate-400" /> {member.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Emergency Contact</label>
                  <p className="text-slate-900 font-semibold">— Not Provided —</p>
                </div>
              </div>
            </div>

            {/* Right Col: Activity/Billing Summary */}
            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" /> Subscription
              </h3>
              <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                {/* Decorative background circle */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                
                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Premium Membership</p>
                <p className="text-3xl font-black mt-1 uppercase italic">{member.plan} Access</p>
                <div className="mt-8 flex justify-between items-end">
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">Auto-Renew: ON</span>
                  <p className="text-sm font-medium underline cursor-pointer">View Billing History</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}