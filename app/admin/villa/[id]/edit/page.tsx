import VillaForm from "../../VillaForm";
import { getVillaById } from "@/app/admin/actions/villa";
import { notFound } from "next/navigation";

export default async function EditVillaPage({
    params,
}: {
    params: { id: string };
}) {
    const villa = await getVillaById(params.id);

    if (!villa) {
        notFound();
    }

    return <VillaForm isEdit={true} initialData={villa} />;
}
