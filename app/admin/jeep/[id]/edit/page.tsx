import JeepForm from "../../JeepForm";
import { getJeepById } from "@/app/admin/actions/jeep";
import { notFound } from "next/navigation";

export default async function EditJeepPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const jeep = await getJeepById(id);

    if (!jeep) {
        notFound();
    }

    return <JeepForm isEdit={true} initialData={jeep} />;
}
