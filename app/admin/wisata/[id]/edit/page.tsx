import AktivitasForm from "../../AktivitasForm";
import { getAktivitasById } from "@/app/admin/actions/wisata";
import { notFound } from "next/navigation";

export default async function EditAktivitasPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const aktivitas = await getAktivitasById(id);

    if (!aktivitas) {
        notFound();
    }

    return <AktivitasForm isEdit={true} initialData={aktivitas} />;
}
