import { Actor } from "../types";

interface ActorCardProps {
  actor: Actor;
  userId: string | null | undefined;
  onDelete: (id: number) => void;
}

export function ActorCard({ actor, userId, onDelete }: ActorCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Invalid date";
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-black/[.08] dark:border-white/[.145] hover:border-transparent transition-colors">
      <h2 className="text-xl font-semibold mb-2 font-[family-name:var(--font-geist-sans)]">
        {actor.name}
      </h2>
      <p className="text-gray-600 dark:text-gray-300">{actor.email}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Role: {actor.role}
      </p>
      {actor.bio && actor.bio.trim() !== "" && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-1">Bio</h3>
          <p className="text-sm">{actor.bio}</p>
        </div>
      )}

      <div className="space-y-3 text-sm">
        {actor.phoneNumber && actor.phoneNumber.trim() !== "" && (
          <p>📱 {actor.phoneNumber}</p>
        )}
        <p>📅 Audition: {formatDate(actor.auditionDate)}</p>

        {actor.previousExperience && actor.previousExperience.trim() !== "" && (
          <div>
            <h3 className="font-medium mb-1">Previous Experience</h3>
            <p className="text-sm">{actor.previousExperience}</p>
          </div>
        )}

        {actor.auditionNotes && actor.auditionNotes.trim() !== "" && (
          <div>
            <h3 className="font-medium mb-1">Audition Notes</h3>
            <p className="text-sm">{actor.auditionNotes}</p>
          </div>
        )}

        <div className="font-[family-name:var(--font-geist-mono)]">
          {actor.weekdayAvailability &&
            actor.weekdayAvailability.trim() !== "" && (
              <p>📆 Weekdays: {actor.weekdayAvailability}</p>
            )}
          {actor.weekendAvailability &&
            actor.weekendAvailability.trim() !== "" && (
              <p>📆 Weekends: {actor.weekendAvailability}</p>
            )}
        </div>

        {actor.specialConsiderations &&
          actor.specialConsiderations.trim() !== "" && (
            <div>
              <h3 className="font-medium mb-1">Special Considerations</h3>
              <p className="text-sm">{actor.specialConsiderations}</p>
            </div>
          )}
      </div>

      {/* Only show delete button for the user's own profile */}
      {actor.clerkUserId === userId && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => onDelete(actor.id)}
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 text-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
