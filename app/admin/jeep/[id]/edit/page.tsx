import JeepForm from "../../JeepForm";
import { getJeepById } from "@/app/admin/actions/jeep";
import { notFound } from "next/navigation";

export default async function EditJeepPage({
    params,
}: {
    params: { id: string };
}) {
    const jeep = await getJeepById(params.id);

    if (!jeep) {
        notFound();
    }

    return <JeepForm isEdit={true} initialData={jeep} />;
}
