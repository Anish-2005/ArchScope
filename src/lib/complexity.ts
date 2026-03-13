import { StackReport } from './types';

export function calculateComplexity(report: StackReport): number {
    let score = 0;

    // Language complexity (more languages => a bit more complex, up to a point)
    score += Math.min(report.languages.length * 3, 15);

    // Frameworks (frontend + backend) contribute a bit heavily
    score += report.frontend.length * 5;
    score += report.backend.length * 6;

    // Database tools
    score += report.database.length * 8;

    // Infrastructure is the heaviest weight
    score += report.infrastructure.length * 10;

    // Dev tools
    score += report.devtools.length * 2;

    // Cap score to 100 for visual gauge presentation
    return Math.min(score, 100);
}
