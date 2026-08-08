import { StackReport } from "../types";

export function exportToCsv(data: StackReport): void {
    const rows = [
        ["Section", "Item / Title", "Category / Detail", "Severity / Priority"],
        ...data.languages.map((l) => ["Language", l, "-", "-"]),
        ...data.frameworks.map((f) => ["Framework", f, "-", "-"]),
        ...data.frontend.map((f) => ["Frontend", f, "-", "-"]),
        ...data.backend.map((b) => ["Backend", b, "-", "-"]),
        ...data.database.map((d) => ["Database", d, "-", "-"]),
        ...data.infrastructure.map((i) => ["Infrastructure", i, "-", "-"]),
        ...data.devtools.map((d) => ["DevTools", d, "-", "-"]),
        ...data.findings.map((f) => ["Finding", f.title, f.detail, f.severity]),
        ...data.recommendations.map((r) => ["Recommendation", r.title, r.detail, r.priority]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `archscope-${data.repo.owner}-${data.repo.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
