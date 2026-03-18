import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CustomerSidebar } from "@/components/dashboard/CustomerSidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    if (session.user.role === "admin") {
        redirect("/admin");
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <CustomerSidebar />

            {/* Content Area */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
