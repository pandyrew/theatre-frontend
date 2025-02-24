"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Actor } from "../types";
import { actorApi } from "../services/api";
import { ActorCard } from "./ActorCard";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { transformActorsData } from "../utils/transformActors";

export default function ActorList() {
  const { userId, getToken } = useAuth();
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActors();
  }, []);

  async function loadActors() {
    try {
      setLoading(true);
      setError(null);
      const response = await actorApi.getAll();
      console.log("Actors response:", response);
      const transformedActors = transformActorsData(response.data);
      setActors(transformedActors);
    } catch (error) {
      console.error("Failed to load actors:", error);
      setError("Failed to load actors. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(actor: Actor) {
    if (!window.confirm(`Are you sure you want to delete ${actor.name}?`)) {
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      await actorApi.delete(actor.id, token);
      setActors(actors.filter((a) => a.id !== actor.id));
    } catch (error) {
      console.error("Failed to delete actor:", error);
      setError("Failed to delete actor. Please try again later.");
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {actors.map((actor) => (
        <ActorCard
          key={actor.id}
          actor={actor}
          userId={userId}
          onDelete={() => handleDelete(actor)}
        />
      ))}
    </div>
  );
}
