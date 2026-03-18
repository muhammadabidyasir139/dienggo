import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilDashboardPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) return null;

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-foreground">Profil Saya</h1>
                <p className="text-neutral-500 mt-2">Perbarui informasi diri dan profil Anda untuk pengalaman yang lebih persononali.</p>
            </div>

            {/* Profile Form */}
            <div className="max-w-3xl bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm">
                <ProfileForm user={user} />
            </div>
        </div>
    );
}
