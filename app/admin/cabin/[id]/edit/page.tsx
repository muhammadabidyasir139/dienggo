import CabinForm from "../../CabinForm";
import { getCabinById } from "@/app/admin/actions/cabin";
import { getFacilities } from "@/app/admin/actions/facility";
import { notFound } from "next/navigation";

export default async function EditCabinPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [cabin, facilities] = await Promise.all([
        getCabinById(id),
        getFacilities(),
    ]);

    if (!cabin) {
        notFound();
    }

    return <CabinForm isEdit={true} initialData={cabin} facilities={facilities} />;
}
