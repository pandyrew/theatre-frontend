"use client";

import { useState, useEffect } from "react";
import { Actor, ActorFormData } from "../types";
import { actorApi } from "../services/api";
import axios from "axios";

interface ActorFormProps {
  actor?: Actor;
  onSuccess?: () => void;
}

export default function ActorForm({ actor, onSuccess }: ActorFormProps) {
  // Log the actor prop whenever it changes
  useEffect(() => {
    if (actor) {
      console.log("ActorForm received actor:", {
        ...actor,
        auditionDate: new Date(actor.auditionDate).toISOString(),
      });
    }
  }, [actor]);

  const [formData, setFormData] = useState<ActorFormData>({
    name: actor?.name || "",
    email: actor?.email || "",
    role: actor?.role || "",
    bio: actor?.bio || "",
    phoneNumber: actor?.phoneNumber || "",
    auditionDate: actor?.auditionDate
      ? new Date(actor.auditionDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    auditionNotes: actor?.auditionNotes || "",
    previousExperience: actor?.previousExperience || "",
    weekdayAvailability: actor?.weekdayAvailability || "",
    weekendAvailability: actor?.weekendAvailability || "",
    specialConsiderations: actor?.specialConsiderations || "",
  });

  // Log form data whenever it changes
  useEffect(() => {
    console.log("ActorForm current form data:", formData);
  }, [formData]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fillTestData = () => {
    const testData: ActorFormData = {
      name: "John Smith",
      email: "john.smith@example.com",
      role: "Lead Actor",
      bio: "Experienced theater performer with 5+ years of stage experience",
      phoneNumber: "(555) 123-4567",
      auditionDate: new Date().toISOString().split("T")[0],
      auditionNotes: "Strong vocal range, excellent stage presence",
      previousExperience:
        "Lead roles in 'Hamlet' and 'The Phantom of the Opera'",
      weekdayAvailability: "Mon-Fri 6PM-10PM",
      weekendAvailability: "Sat-Sun All Day",
      specialConsiderations: "Allergic to stage smoke",
    };
    setFormData(testData);
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return "Name is required";
    }
    if (!formData.email.trim()) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email address";
    }
    if (!formData.role.trim()) {
      return "Role is required";
    }
    return null;
  };

  const prepareFormData = () => {
    try {
      // Convert the date string to a proper ISO string
      const auditionDate = new Date(formData.auditionDate);
      if (isNaN(auditionDate.getTime())) {
        throw new Error("Invalid audition date");
      }

      // Format data to match the backend's ActorDTO structure
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role.trim(),
        bio: formData.bio?.trim() || null,
        phoneNumber: formData.phoneNumber?.trim() || null,
        auditionDate: formData.auditionDate, // Send as YYYY-MM-DD for backend DateTime parsing
        auditionNotes: formData.auditionNotes?.trim() || null,
        previousExperience: formData.previousExperience?.trim() || null,
        weekdayAvailability: formData.weekdayAvailability?.trim() || null,
        weekendAvailability: formData.weekendAvailability?.trim() || null,
        specialConsiderations: formData.specialConsiderations?.trim() || null,
      };

      console.log("Submitting data:", submissionData);
      return submissionData;
    } catch (error) {
      console.error("Error preparing form data:", error);
      throw new Error("Failed to prepare form data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submissionData = prepareFormData();
      console.log(
        "Submitting data to backend:",
        JSON.stringify(submissionData, null, 2)
      );

      if (actor) {
        await actorApi.update(actor.id, submissionData);
      } else {
        await actorApi.create(submissionData);
      }
      onSuccess?.();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("API Error Response:", {
          status: err.response?.status,
          data: JSON.stringify(err.response?.data, null, 2),
          headers: err.response?.headers,
        });

        if (err.response?.status === 400) {
          let errorMessage = "Validation error: ";

          // Handle different error response formats
          if (typeof err.response.data === "string") {
            errorMessage += err.response.data;
          } else if (typeof err.response.data === "object") {
            if (err.response.data.errors) {
              // Handle ASP.NET validation errors
              const errors = Object.values(err.response.data.errors || {})
                .flat()
                .join(", ");
              errorMessage += errors || "Invalid data submitted";
            } else {
              // Try to extract a meaningful message from the object
              errorMessage +=
                Object.entries(err.response.data || {})
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", ") || "Please check all required fields";
            }
          } else {
            errorMessage += "Please check all required fields";
          }
          setError(errorMessage);
        } else if (err.response?.status === 401) {
          setError("Unauthorized: Please log in to continue");
        } else if (err.response?.status === 403) {
          setError(
            "Forbidden: You don't have permission to perform this action"
          );
        } else {
          setError(
            `Failed to ${actor ? "update" : "create"} actor. Please try again`
          );
        }
      } else {
        console.error("Non-Axios Error:", err);
        setError(`An unexpected error occurred. Please try again`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-geist-sans)]">
          {actor ? "Edit Actor" : "Create Actor"}
        </h2>
        <button
          type="button"
          onClick={fillTestData}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 text-blue-600 dark:text-blue-400 px-4 py-2 text-sm"
        >
          Fill Test Data
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Audition Date
          </label>
          <input
            type="date"
            name="auditionDate"
            value={formData.auditionDate}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Weekday Availability
          </label>
          <input
            type="text"
            name="weekdayAvailability"
            value={formData.weekdayAvailability || ""}
            onChange={handleChange}
            placeholder="e.g., Mon-Fri 6PM-9PM"
            className="w-full p-2 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Weekend Availability
          </label>
          <input
            type="text"
            name="weekendAvailability"
            value={formData.weekendAvailability || ""}
            onChange={handleChange}
            placeholder="e.g., Sat-Sun 10AM-6PM"
            className="w-full p-2 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Previous Experience
          </label>
          <textarea
            name="previousExperience"
            value={formData.previousExperience || ""}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Audition Notes
          </label>
          <textarea
            name="auditionNotes"
            value={formData.auditionNotes || ""}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Special Considerations
          </label>
          <textarea
            name="specialConsiderations"
            value={formData.specialConsiderations || ""}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full border border-solid transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm h-10 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : actor ? "Update Actor" : "Create Actor"}
        </button>
      </div>
    </form>
  );
}
