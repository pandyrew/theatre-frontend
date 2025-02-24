import { Actor } from "../types";
import { DynamoDBItem } from "../types/dynamodb";

interface RawActorItem {
  id: number | string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  phoneNumber?: string;
  auditionDate: string;
  auditionNotes?: string;
  previousExperience?: string;
  weekdayAvailability?: string;
  weekendAvailability?: string;
  specialConsiderations?: string;
  clerkUserId: string;
  createdAt: string;
  updatedAt: string;
}

export function transformActorsData(data: unknown): Actor[] {
  if (!Array.isArray(data)) {
    throw new Error("Invalid response format");
  }

  if (data.length === 0) {
    return [];
  }

  let nextId = 1;
  return data.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Invalid actor data format at index ${index}`);
    }

    const isDynamoDBItem =
      item &&
      typeof item === "object" &&
      "Id" in item &&
      (item as DynamoDBItem).Id &&
      "n" in (item as DynamoDBItem).Id &&
      "Name" in item &&
      (item as DynamoDBItem).Name &&
      "s" in (item as DynamoDBItem).Name;

    try {
      if (isDynamoDBItem) {
        const dbItem = item as DynamoDBItem;
        return {
          id: parseInt(dbItem.Id?.n || String(nextId++)),
          name: dbItem.Name?.s || "",
          email: dbItem.Email?.s || "",
          role: dbItem.Role?.s || "",
          bio: dbItem.Bio?.s || null,
          phoneNumber: dbItem.PhoneNumber?.s || null,
          auditionDate: dbItem.AuditionDate?.s || new Date().toISOString(),
          auditionNotes: dbItem.AuditionNotes?.s || null,
          previousExperience: dbItem.PreviousExperience?.s || null,
          weekdayAvailability: dbItem.WeekdayAvailability?.s || null,
          weekendAvailability: dbItem.WeekendAvailability?.s || null,
          specialConsiderations: dbItem.SpecialConsiderations?.s || null,
          clerkUserId: dbItem.ClerkUserId?.s || "",
          createdAt: dbItem.CreatedAt?.s || new Date().toISOString(),
          updatedAt: dbItem.UpdatedAt?.s || new Date().toISOString(),
        };
      } else {
        const rawItem = item as RawActorItem;
        return {
          id: typeof rawItem.id === "number" ? rawItem.id : nextId++,
          name: rawItem.name || "",
          email: rawItem.email || "",
          role: rawItem.role || "",
          bio: rawItem.bio || null,
          phoneNumber: rawItem.phoneNumber || null,
          auditionDate: rawItem.auditionDate || new Date().toISOString(),
          auditionNotes: rawItem.auditionNotes || null,
          previousExperience: rawItem.previousExperience || null,
          weekdayAvailability: rawItem.weekdayAvailability || null,
          weekendAvailability: rawItem.weekendAvailability || null,
          specialConsiderations: rawItem.specialConsiderations || null,
          clerkUserId: rawItem.clerkUserId || "",
          createdAt: rawItem.createdAt || new Date().toISOString(),
          updatedAt: rawItem.updatedAt || new Date().toISOString(),
        };
      }
    } catch (error) {
      throw new Error(`Failed to transform actor at index ${index}: ${error}`);
    }
  });
}
