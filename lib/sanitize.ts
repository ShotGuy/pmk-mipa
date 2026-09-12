/**
 * Utility sanitasi input untuk mencegah XSS (Cross-Site Scripting)
 * dan injeksi kode berbahaya pada data pengguna.
 */

const DANGEROUS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript\s*:/gi,
    /data\s*:\s*text\/html/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi,
    /on\w+\s*=\s*[^>\s]+/gi,
]

/**
 * Membersihkan string dari tag HTML berbahaya, script, dan event handler JavaScript inline.
 */
export function sanitizeString(input: string): string {
    if (!input || typeof input !== "string") return ""

    let clean = input
    for (const pattern of DANGEROUS_PATTERNS) {
        clean = clean.replace(pattern, "")
    }

    return clean.trim()
}

/**
 * Mengubah karakter khusus HTML menjadi HTML entity untuk rendering teks yang aman.
 */
export function escapeHtml(input: string): string {
    if (!input || typeof input !== "string") return ""

    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
}

/**
 * Membersihkan seluruh properti string dalam suatu objek secara rekursif.
 */
export function sanitizeObject<T>(data: T): T {
    if (!data || typeof data !== "object") {
        if (typeof data === "string") {
            return sanitizeString(data) as unknown as T
        }
        return data
    }

    if (Array.isArray(data)) {
        return data.map((item) => sanitizeObject(item)) as unknown as T
    }

    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === "string") {
            result[key] = sanitizeString(value)
        } else if (value && typeof value === "object") {
            result[key] = sanitizeObject(value)
        } else {
            result[key] = value
        }
    }

    return result as T
}
