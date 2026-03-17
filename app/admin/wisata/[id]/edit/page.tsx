import WisataForm from "../../WisataForm";
import { getWisataById } from "@/app/admin/actions/wisata";
import { notFound } from "next/navigation";

export default async function EditWisataPage({
    params,
}: {
    params: { id: string };
}) {
    const wisata = await getWisataById(params.id);

    if (!wisata) {
        notFound();
    }

    return <WisataForm isEdit={true} initialData={wisata} />;
}
