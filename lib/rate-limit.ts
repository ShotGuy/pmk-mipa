/**
 * In-memory sliding window rate limiter.
 * Digunakan untuk mencegah brute-force login, spam form, dan request flooding.
 */

interface RateLimitRecord {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitRecord>()

// Bersihkan entri kedaluwarsa secara berkala (setiap 5 menit)
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanupExpired() {
    const now = Date.now()
    if (now - lastCleanup < CLEANUP_INTERVAL) return

    for (const [key, record] of rateLimitStore.entries()) {
        if (now > record.resetTime) {
            rateLimitStore.delete(key)
        }
    }
    lastCleanup = now
}

export interface RateLimitOptions {
    /** Jumlah maksimal percobaan yang diizinkan dalam rentang waktu */
    maxAttempts: number
    /** Rentang waktu jendela pembatasan dalam milidetik (contoh: 5 * 60 * 1000 untuk 5 menit) */
    windowMs: number
}

export interface RateLimitResult {
    success: boolean
    remaining: number
    resetInSeconds: number
}

/**
 * Memeriksa dan menambah penghitung rate limit untuk key tertentu.
 * Jika count melebihi maxAttempts, mengembalikan success: false.
 */
export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
    cleanupExpired()

    const now = Date.now()
    const record = rateLimitStore.get(key)

    // Jika belum ada atau sudah kedaluwarsa, mulai jendela baru
    if (!record || now > record.resetTime) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + options.windowMs,
        })
        return {
            success: true,
            remaining: options.maxAttempts - 1,
            resetInSeconds: Math.ceil(options.windowMs / 1000),
        }
    }

    // Jika masih dalam jendela aktif
    if (record.count >= options.maxAttempts) {
        return {
            success: false,
            remaining: 0,
            resetInSeconds: Math.ceil((record.resetTime - now) / 1000),
        }
    }

    record.count += 1
    return {
        success: true,
        remaining: options.maxAttempts - record.count,
        resetInSeconds: Math.ceil((record.resetTime - now) / 1000),
    }
}

/**
 * Reset penghitung rate limit untuk key tertentu (misalnya setelah login sukses).
 */
export function resetRateLimit(key: string): void {
    rateLimitStore.delete(key)
}
