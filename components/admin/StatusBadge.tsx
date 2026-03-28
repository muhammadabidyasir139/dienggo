export default function StatusBadge({ status }: { status: string }) {
    const getStatusStyle = () => {
        switch (status.toLowerCase()) {
            case "paid":
                return "bg-green-100 text-green-700 border-green-200";
            case "unpaid":
                return "bg-amber-100 text-amber-700 border-amber-200";
            case "cancelled":
                return "bg-red-100 text-red-700 border-red-200";
            case "refunded":
                return "bg-slate-100 text-slate-700 border-slate-200";
            case "pending":
                return "bg-amber-100 text-amber-700 border-amber-200";
            case "approved":
                return "bg-green-100 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const getStatusLabel = () => {
        switch (status.toLowerCase()) {
            case "paid":
                return "Lunas";
            case "unpaid":
                return "Belum Bayar";
            case "cancelled":
                return "Dibatalkan";
            case "refunded":
                return "Dikembalikan";
            case "pending":
                return "Menunggu";
            case "approved":
                return "Disetujui";
            case "rejected":
                return "Ditolak";
            default:
                return status;
        }
    };

    return (
        <span
            className={`px-2.5 py-1 text-xs font-medium border rounded-full ${getStatusStyle()}`}
        >
            {getStatusLabel()}
        </span>
    );
}
