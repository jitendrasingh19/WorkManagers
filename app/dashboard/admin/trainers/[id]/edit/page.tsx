import TrainerForm from "@/components/trainers/TrainerForm";
import { supabase } from "@/lib/supabaseClient";

export default async function EditTrainerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: trainer, error } = await supabase
    .from("trainers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !trainer) {
    return <div className="p-6">Trainer not found</div>;
  }

  const formattedTrainer = {
    id: trainer.id,
    name: trainer.name,
    email: trainer.email,
    phone: trainer.phone,
    photoUrl: trainer.photo_url,
    specializations: trainer.specializations || [],
    certifications: trainer.certifications || [],
    experience: trainer.experience || 0,
    sessionsCompleted: trainer.sessions_completed ?? 0,
    assignedClients: trainer.assigned_clients ?? 0,
    status: trainer.status,
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Edit Trainer</h1>
      <TrainerForm initialData={formattedTrainer} isEdit />
    </div>
  );
}