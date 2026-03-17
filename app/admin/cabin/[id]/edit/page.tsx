import CabinForm from "../../CabinForm";
import { getCabinById } from "@/app/admin/actions/cabin";
import { notFound } from "next/navigation";

export default async function EditCabinPage({
    params,
}: {
    params: { id: string };
}) {
    const cabin = await getCabinById(params.id);

    if (!cabin) {
        notFound();
    }

    return <CabinForm isEdit={true} initialData={cabin} />;
}
