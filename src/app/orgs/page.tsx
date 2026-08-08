"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, LogOut } from "lucide-react";
import { ActiveContextCard } from "@/components/orgs/ActiveContextCard";
import { Org, OrgCard } from "@/components/orgs/OrgCard";
import { NewWorkspaceForm } from "@/components/orgs/NewWorkspaceForm";
import { AccessControlCard } from "@/components/orgs/AccessControlCard";

interface Session {
    org: string;
    role: string;
    userId: string;
}

export default function OrgsPage() {
    const [orgs, setOrgs] = useState<Org[]>([]);
    const [session, setSession] = useState<Session | null>(null);
    const [newOrgName, setNewOrgName] = useState("");
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchState = async () => {
            const [authRes, orgsRes] = await Promise.all([
                fetch("/api/auth"),
                fetch("/api/orgs")
            ]);

            const authData = await authRes.json();
            if (!authData.session) {
                router.push("/login");
                return;
            }
            setSession(authData.session);

            if (orgsRes.ok) {
                const orgsData = await orgsRes.json();
                setOrgs(orgsData.orgs || []);
            }
            setLoading(false);
        };
        fetchState();
    }, [router]);

    const handleCreateOrg = async () => {
        if (!newOrgName) return;
        setCreating(true);
        try {
            const res = await fetch("/api/orgs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newOrgName, plan: "team" })
            });
            if (res.ok) {
                const data = await res.json();
                setOrgs([...orgs, data.org]);
                setNewOrgName("");
            }
        } finally {
            setCreating(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth", { method: "DELETE" });
        router.push("/login");
    };

    const handleSwitchOrg = () => {
        handleLogout();
    };

    if (loading) return null;

    return (
        <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                        <Building2 className="h-3.5 w-3.5" /> Workspace Management
                    </div>
                    <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-50">Organizations</h1>
                    <p className="mt-2.5 max-w-xl text-zinc-300 text-sm sm:text-base font-medium">
                        Manage your enterprise workspaces, access controls, and team members.
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-rose-400 transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {session && (
                        <ActiveContextCard org={session.org} role={session.role} userId={session.userId} />
                    )}

                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mt-10 mb-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-violet-400"/> Available Workspaces</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {orgs.map((org) => (
                            <OrgCard
                                key={org.name}
                                org={org}
                                active={session?.org === org.name}
                                onSwitch={handleSwitchOrg}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <NewWorkspaceForm
                        value={newOrgName}
                        creating={creating}
                        onChange={setNewOrgName}
                        onSubmit={handleCreateOrg}
                    />
                    <AccessControlCard />
                </div>
            </div>
        </div>
    );
}
