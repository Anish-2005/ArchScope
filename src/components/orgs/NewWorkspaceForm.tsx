import { Plus } from "lucide-react";

interface NewWorkspaceFormProps {
    value: string;
    creating: boolean;
    onChange: (value: string) => void;
    onSubmit: () => void;
}

export const NewWorkspaceForm = ({ value, creating, onChange, onSubmit }: NewWorkspaceFormProps) => (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/60">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2 mb-4"><Plus className="w-4 h-4 text-cyan-400"/> New Workspace</h3>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <input
                type="text"
                placeholder="Organization Name"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-zinc-100 mb-4 outline-none focus:border-cyan-400/50"
            />
            <button
                type="submit"
                disabled={!value || creating}
                className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all disabled:opacity-50"
            >
                {creating ? "Provisioning..." : "Create Workspace"}
            </button>
        </form>
    </div>
);
