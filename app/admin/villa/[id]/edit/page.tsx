import VillaForm from "../../VillaForm";
import { getVillaById } from "@/app/admin/actions/villa";
import { getFacilities } from "@/app/admin/actions/facility";
import { notFound } from "next/navigation";

export default async function EditVillaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let id: string;
  try {
    const resolvedParams = await params;
    id = (resolvedParams as any).id;
  } catch (error) {
    console.error("Error awaiting params:", error);
    return notFound();
  }

  if (!id) return notFound();

  try {
    const [villa, rawFacilities] = await Promise.all([
      getVillaById(id),
      getFacilities(),
    ]);

    if (!villa) {
      return notFound();
    }

    // Sanitize data to ensure it's a plain serializable object for Client Components
    // This avoids issues with Date objects or Drizzle-internal properties
    const serializedVilla = JSON.parse(JSON.stringify(villa));
    const facilities = JSON.parse(JSON.stringify(rawFacilities));

    return (
      <VillaForm
        isEdit={true}
        initialData={serializedVilla}
        facilities={facilities}
      />
    );
  } catch (error) {
    console.error("Error loading villa data:", error);
    // If it's a UUID conversion error or similar DB error, show not found
    return notFound();
  }
}
