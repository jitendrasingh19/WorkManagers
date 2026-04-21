import TrainerForm from "@/components/trainers/TrainerForm";
import React from "react";
export default function NewTrainerPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Add Trainer</h1>
      <TrainerForm />
    </div>
  );
}