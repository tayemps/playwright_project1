export function getEnvOrDefault(name: string, fallback: string): string {
    return process.env[name] ?? fallback;
}
