import { CodeTerminal } from "../CodeTerminal";

export const CliSection = () => (
    <>
        <p className="text-zinc-300 leading-relaxed text-sm mb-6">
            The ArchScope CLI allows you to trigger deep architectural scans directly from your terminal or CI/CD pipelines.
        </p>
        <CodeTerminal
            lines={[
                { comment: "// Install global binary", command: "npm install -g @archscope/cli" },
                {
                    comment: "// Run a tactical scan",
                    prompt: true,
                    command: (
                        <>
                            archscope scan <span className="text-amber-400">facebook/react</span> --output <span className="text-cyan-400">json</span>
                        </>
                    ),
                },
            ]}
        />
    </>
);
