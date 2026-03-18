import { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/admin/Sidebar";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Admin Panel - Dienggo",
    description: "Dashboard administrasi Dienggo",
};

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        redirect("/login");
    }

    return (
        <div className={`flex min-h-screen bg-slate-50 ${inter.className}`}>
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">{children}</div>
            </main>
        </div>
    );
}
