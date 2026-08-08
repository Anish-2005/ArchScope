/**
 * Normalizes a GitHub repository input (URL or `owner/repo`) into a canonical URL.
 * Returns `null` when the input cannot be interpreted as a GitHub repository.
 */
export function normalizeGithubInput(input: string): string | null {
    let value = input.trim();
    if (!value) return null;

    if (!value.includes("github.com/") && value.includes("/")) {
        value = `https://github.com/${value.replace(/^\/+/, "")}`;
    }

    if (!value.includes("github.com/")) return null;

    const match = value.match(/github\.com\/([^/\s]+)\/([^/\s]+?)(?:\.git)?(?:[/?#]|$)/i);
    if (!match?.[1] || !match?.[2]) return null;

    return value;
}

/**
 * Extracts `{ owner, repo }` from a GitHub repository URL.
 */
export function parseGithubUrl(input: string): { owner: string; repo: string } | null {
    const match = input.match(/github\.com\/([^/\s]+)\/([^/\s]+?)(?:\.git)?(?:[/?#]|$)/i);
    const owner = match?.[1];
    const repo = match?.[2];
    if (!owner || !repo) return null;
    return { owner, repo };
}
