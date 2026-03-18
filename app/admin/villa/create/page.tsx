import VillaForm from "../VillaForm";
import { getFacilities } from "@/app/admin/actions/facility";

export default async function CreateVillaPage() {
    const facilities = await getFacilities();
    return <VillaForm isEdit={false} facilities={facilities} />;
}
