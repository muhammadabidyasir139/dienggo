import CabinForm from "../CabinForm";
import { getFacilities } from "@/app/admin/actions/facility";

export default async function CreateCabinPage() {
    const facilities = await getFacilities();
    return <CabinForm isEdit={false} facilities={facilities} />;
}
