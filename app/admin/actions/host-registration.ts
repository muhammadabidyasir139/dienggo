"use server";

import { db } from "@/db";
import { hostRegistrations, villas, cabins, jeeps } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function submitHostRegistration(formData: any) {
  try {
    const rawSize = typeof formData === "string" ? formData.length : JSON.stringify(formData).length;
    console.log(`[HostRegistration] Received payload size: ${(rawSize / 1024 / 1024).toFixed(2)} MB`);

    // If data is a string (JSON), parse it
    const data = typeof formData === "string" ? JSON.parse(formData) : formData;

    const [newRegistration] = await db
      .insert(hostRegistrations)
      .values({
        ...data,
        status: "pending",
      })
      .returning();
    revalidatePath("/admin/host-registrations");
    return { success: true, data: newRegistration };
  } catch (error: any) {
    console.error("Submit host registration error:", error);
    return { success: false, error: error.message };
  }
}

export async function getHostRegistrations() {
  try {
    return await db
      .select()
      .from(hostRegistrations)
      .orderBy(desc(hostRegistrations.createdAt));
  } catch (error: any) {
    console.error("Get host registrations error:", error);
    return [];
  }
}

export async function getUserHostRegistrations(userId: string) {
  try {
    return await db
      .select()
      .from(hostRegistrations)
      .where(eq(hostRegistrations.userId, userId))
      .orderBy(desc(hostRegistrations.createdAt));
  } catch (error: any) {
    console.error("Get user host registrations error:", error);
    return [];
  }
}

export async function approveHostRegistration(id: string) {
  try {
    const registration = await db.query.hostRegistrations.findFirst({
      where: eq(hostRegistrations.id, id),
    });

    if (!registration) throw new Error("Registration not found");

    const slug =
      registration.nama.toLowerCase().replace(/ /g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 7);

    // Map to corresponding table based on category
    if (registration.category === "villa") {
      await db.insert(villas).values({
        slug,
        nama: registration.nama,
        harga: registration.hargaDasar,
        lokasi: registration.alamatJalan + ", " + registration.kota,
        koordinat: registration.koordinat,
        deskripsi: registration.deskripsi,
        fotoUtama: (registration.fotos as string[])[0] || "",
        galeri: registration.fotos,
        fasilitasUtama: registration.fasilitas,
        whatsappOwner: registration.whatsappOwner,
        isActive: true,
      });
    } else if (registration.category === "cabin") {
      await db.insert(cabins).values({
        slug,
        nama: registration.nama,
        harga: registration.hargaDasar,
        lokasi: registration.alamatJalan + ", " + registration.kota,
        koordinat: registration.koordinat,
        deskripsi: registration.deskripsi,
        fotoUtama: (registration.fotos as string[])[0] || "",
        galeri: registration.fotos,
        fasilitasUtama: registration.fasilitas,
        whatsappOwner: registration.whatsappOwner,
        isActive: true,
      });
    } else if (registration.category === "jeep") {
      await db.insert(jeeps).values({
        slug,
        nama: registration.nama,
        harga: registration.hargaDasar,
        deskripsi: registration.deskripsi,
        fotoUtama: (registration.fotos as string[])[0] || "",
        galeri: registration.fotos,
        whatsappOwner: registration.whatsappOwner,
        isActive: true,
      });
    }

    await db
      .update(hostRegistrations)
      .set({ status: "approved", updatedAt: new Date() })
      .where(eq(hostRegistrations.id, id));

    revalidatePath("/admin/host-registrations");
    revalidatePath("/villa");
    revalidatePath("/hotel-cabin");
    revalidatePath("/jeep");

    return { success: true };
  } catch (error: any) {
    console.error("Approve host registration error:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectHostRegistration(id: string) {
  try {
    await db
      .update(hostRegistrations)
      .set({ status: "rejected", updatedAt: new Date() })
      .where(eq(hostRegistrations.id, id));
    revalidatePath("/admin/host-registrations");
    return { success: true };
  } catch (error: any) {
    console.error("Reject host registration error:", error);
    return { success: false, error: error.message };
  }
}
