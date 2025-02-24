"use client";

import { useState } from "react";
import ActorList from "../components/ActorList";
import ActorForm from "../components/ActorForm";

export default function ActorsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-geist-sans)]">
            Theatre Actors
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-full border border-solid transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4"
          >
            {showForm ? "View Actors" : "Add Actor"}
          </button>
        </div>

        {showForm ? (
          <ActorForm
            onSuccess={() => {
              setShowForm(false);
              // The ActorList component will automatically refresh its data
            }}
          />
        ) : (
          <ActorList />
        )}
      </div>
    </div>
  );
}
