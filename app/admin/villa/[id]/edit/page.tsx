import VillaForm from "../../VillaForm";
import { getVillaById } from "@/app/admin/actions/villa";
import { getFacilities } from "@/app/admin/actions/facility";
import { notFound } from "next/navigation";

export default async function EditVillaPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [villa, facilities] = await Promise.all([
        getVillaById(id),
        getFacilities(),
    ]);

    if (!villa) {
        notFound();
    }

    return <VillaForm isEdit={true} initialData={villa} facilities={facilities} />;
}
