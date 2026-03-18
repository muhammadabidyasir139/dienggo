import FacilityForm from "../../FacilityForm";
import { getFacilityById } from "@/app/admin/actions/facility";
import { notFound } from "next/navigation";

export default async function EditFacilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const facility = await getFacilityById(id);

  if (!facility) {
    notFound();
  }

  return <FacilityForm isEdit={true} initialData={facility} />;
}
