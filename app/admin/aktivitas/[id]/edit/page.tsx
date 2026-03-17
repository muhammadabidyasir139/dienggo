import AktivitasForm from "../../AktivitasForm";
import { getAktivitasById } from "@/app/admin/actions/aktivitas";
import { notFound } from "next/navigation";

export default async function EditAktivitasPage({
    params,
}: {
    params: { id: string };
}) {
    const aktivitas = await getAktivitasById(params.id);

    if (!aktivitas) {
        notFound();
    }

    return <AktivitasForm isEdit={true} initialData={aktivitas} />;
}
