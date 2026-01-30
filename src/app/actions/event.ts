'use server'

import { getDataSource } from "@/lib/db";
import { Event } from "@/src/entities/Event";
import { User } from "@/src/entities/User";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const start_date = formData.get("start_date") as string; // YYYY-MM-DD
  const start_time_str = formData.get("start_time") as string; // HH:MM
  const location = formData.get("location") as string;
  const userId = formData.get("user_id") as string;

  if (!title || !start_date || !start_time_str || !userId) return;

  const db = await getDataSource();
  const user = await db.getRepository(User).findOneBy({ id: userId });

  if (!user) return;

  // Monta a data completa (Data + Hora)
  const fullStartDate = new Date(`${start_date}T${start_time_str}:00`);

  const newEvent = db.getRepository(Event).create({
    title,
    start_time: fullStartDate,
    location,
    user
  });

  await db.getRepository(Event).save(newEvent);
  revalidatePath("/dashboard");
  revalidatePath("/portal");
}

export async function deleteEventAction(eventId: number) {
  const session = await getSession();
  if (!session || session.role !== "admin") return;

  const db = await getDataSource();
  await db.getRepository(Event).delete(eventId);

  revalidatePath("/admin");
}