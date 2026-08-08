const SOURCE_EXTENSIONS = /\.(ts|tsx|js|jsx|py|go|java|cs|rs|rb)$/i;
const IGNORED_DIRS = /(node_modules|dist|build|coverage|vendor|__pycache__)/;
const MAX_SAMPLES = 48;
const MAX_SAMPLE_BYTES = 180_000;

/**
 * Fetches a bounded sample of source files for heuristic analysis.
 */
export async function sampleSources(
    files: string[],
    rawFetcher: (path: string) => Promise<string | null>
): Promise<Record<string, string>> {
    const candidates = files
        .filter((f) => SOURCE_EXTENSIONS.test(f) && !IGNORED_DIRS.test(f))
        .slice(0, MAX_SAMPLES);

    const samples: Record<string, string> = {};
    await Promise.all(
        candidates.map(async (file) => {
            const text = await rawFetcher(file);
            if (text && text.length <= MAX_SAMPLE_BYTES) samples[file] = text;
        })
    );
    return samples;
}
