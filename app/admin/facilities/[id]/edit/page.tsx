import FacilityForm from "../../FacilityForm";
import { getFacilityById } from "@/app/admin/actions/facility";
import { notFound } from "next/navigation";

export default async function EditFacilityPage({
  params,
}: {
  params: { id: string };
}) {
  const facility = await getFacilityById(params.id);

  if (!facility) {
    notFound();
  }

  return <FacilityForm isEdit={true} initialData={facility} />;
}
