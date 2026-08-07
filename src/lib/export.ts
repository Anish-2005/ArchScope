import { StackReport } from "./types";
import { jsPDF } from "jspdf";

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

export function exportToPdf(data: StackReport): void {
    const doc = new jsPDF();

    // Header / Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(34, 211, 238); // Cyan
    doc.text("ArchScope Architecture Brief", 20, 20);

    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text(`Repository: ${data.repo.owner}/${data.repo.name}`, 20, 32);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Scanned: ${data.scannedAt ? new Date(data.scannedAt).toLocaleString() : new Date().toLocaleString()}`, 20, 40);

    // Executive Metrics Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(20, 48, 170, 28, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Health Score: ${data.healthScore}/100`, 30, 60);
    doc.text(`Complexity: ${data.complexityScore}/100`, 85, 60);
    doc.text(`Delivery Risk: ${data.deliveryRisk.toUpperCase()}`, 140, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Files: ${data.signals.fileCount} | Dependencies: ${data.signals.dependencyCount} | Workflows: ${data.signals.workflowCount}`, 30, 69);

    // Tech Stack Summary
    let y = 88;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Technology Stack Overview", 20, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    if (data.languages.length) { doc.text(`Languages: ${data.languages.join(", ")}`, 20, y); y += 6; }
    if (data.frameworks.length) { doc.text(`Frameworks: ${data.frameworks.join(", ")}`, 20, y); y += 6; }
    if (data.database.length) { doc.text(`Databases: ${data.database.join(", ")}`, 20, y); y += 6; }
    if (data.infrastructure.length) { doc.text(`Infrastructure: ${data.infrastructure.join(", ")}`, 20, y); y += 6; }

    // Risk Intelligence / Findings
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Key Risk Intelligence & Findings", 20, y);
    y += 8;

    doc.setFontSize(9);
    data.findings.slice(0, 5).forEach((f) => {
        doc.setFont("helvetica", "bold");
        doc.text(`• [${f.severity.toUpperCase()}] ${f.title}`, 20, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(f.detail, 165);
        doc.text(lines, 25, y);
        y += lines.length * 4 + 3;
    });

    // Recommendations Roadmap
    if (y > 230) {
        doc.addPage();
        y = 20;
    }

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Recommended Action Items", 20, y);
    y += 8;

    doc.setFontSize(9);
    data.recommendations.forEach((r) => {
        doc.setFont("helvetica", "bold");
        doc.text(`• [${r.priority.toUpperCase()}] ${r.title}`, 20, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(r.detail, 165);
        doc.text(lines, 25, y);
        y += lines.length * 4 + 3;
    });

    doc.save(`archscope-${data.repo.owner}-${data.repo.name}.pdf`);
}
