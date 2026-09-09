export interface ParsedTTLResult {
    tempat: string | null
    date: Date | null
    displayStr: string
}

const MONTH_MAP: Record<string, number> = {
    // Januari
    januari: 0,
    jan: 0,
    january: 0,

    // Februari
    februari: 1,
    feb: 1,
    pebruari: 1,
    peb: 1,
    february: 1,
    febr: 1,

    // Maret
    maret: 2,
    mar: 2,
    march: 2,

    // April
    april: 3,
    apr: 3,

    // Mei
    mei: 4,
    mey: 4,
    may: 4,

    // Juni
    juni: 5,
    jun: 5,
    june: 5,

    // Juli
    juli: 6,
    jul: 6,
    july: 6,

    // Agustus
    agustus: 7,
    ags: 7,
    agt: 7,
    agu: 7,
    august: 7,
    aug: 7,

    // September
    september: 8,
    sep: 8,
    sept: 8,
    spetember: 8,
    setember: 8,

    // Oktober
    oktober: 9,
    okt: 9,
    october: 9,
    oct: 9,

    // November
    november: 10,
    nov: 10,
    nopember: 10,
    nop: 10,

    // Desember
    desember: 11,
    des: 11,
    december: 11,
    dec: 11,
}

/**
 * Parsing teks Tanggal Lahir atau Tempat, Tanggal Lahir (TTL) Indonesia dengan toleransi typo dan berbagai format.
 * Contoh input:
 * - "Ndeuama, 18 Mei 2005"
 * - "Kupang, 06 Spetember 2005" (typo Spetember)
 * - "Moyome, 03 Mey 2004" (variasi Mey)
 * - "Soe, 25 Nov 2004"
 * - "Kupang, 06/09/2005"
 * - "2005-09-06"
 * - Serial number Excel (38490)
 * - Objek Date bawaan JavaScript
 */
export function parseIndonesianTTL(val: unknown): ParsedTTLResult {
    if (val === undefined || val === null) {
        return { tempat: null, date: null, displayStr: "-" }
    }

    // 1. Objek Date bawaan JavaScript
    if (val instanceof Date && !isNaN(val.getTime())) {
        const y = val.getFullYear()
        const m = String(val.getMonth() + 1).padStart(2, "0")
        const d = String(val.getDate()).padStart(2, "0")
        return { tempat: null, date: val, displayStr: `${y}-${m}-${d}` }
    }

    // 2. Serial Number Excel (contoh: 38490)
    if (typeof val === "number" && val > 0) {
        const dateCode = val > 60 ? val - 1 : val
        const utcDays = dateCode - 25568
        const d = new Date(Math.round(utcDays * 86400 * 1000))
        if (!isNaN(d.getTime())) {
            const y = d.getUTCFullYear()
            const m = String(d.getUTCMonth() + 1).padStart(2, "0")
            const day = String(d.getUTCDate()).padStart(2, "0")
            return { tempat: null, date: d, displayStr: `${y}-${m}-${day}` }
        }
    }

    const str = String(val).trim()
    if (!str) {
        return { tempat: null, date: null, displayStr: "-" }
    }

    // 3. Format teks bulan Indonesia dengan tempat opsional
    // Contoh: "Ndeuama, 18 Mei 2005", "Kupang, 06 Spetember 2005", "Soe 25 Nov 2004", "18-Mei-2005"
    const textMonthRegex = /(?:^(.*?)[,\s\-/]+)?(\d{1,2})[\s\-/]+([a-zA-Z]+)[\s\-/]+(\d{4})$/i
    const textMatch = str.match(textMonthRegex)
    if (textMatch) {
        const rawTempat = textMatch[1] ? textMatch[1].replace(/^[,\s\-/]+|[,\s\-/]+$/g, "").trim() : null
        const day = parseInt(textMatch[2], 10)
        const monthStr = textMatch[3].toLowerCase()
        const year = parseInt(textMatch[4], 10)

        if (monthStr in MONTH_MAP && day >= 1 && day <= 31 && year >= 1940 && year <= 2050) {
            const monthIdx = MONTH_MAP[monthStr]
            const d = new Date(Date.UTC(year, monthIdx, day))
            if (!isNaN(d.getTime())) {
                const mStr = String(monthIdx + 1).padStart(2, "0")
                const dStr = String(day).padStart(2, "0")
                const formattedDate = `${year}-${mStr}-${dStr}`
                return {
                    tempat: rawTempat || null,
                    date: d,
                    displayStr: formattedDate,
                }
            }
        }
    }

    // 4. Format angka DD/MM/YYYY atau DD-MM-YYYY dengan tempat opsional
    // Contoh: "Kupang, 06/09/2005", "06-09-2005"
    const numDateRegex = /(?:^(.*?)[,\s]+)?(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
    const numMatch = str.match(numDateRegex)
    if (numMatch) {
        const rawTempat = numMatch[1] ? numMatch[1].replace(/^[,\s\-/]+|[,\s\-/]+$/g, "").trim() : null
        const day = parseInt(numMatch[2], 10)
        const month = parseInt(numMatch[3], 10) - 1
        const year = parseInt(numMatch[4], 10)
        if (day >= 1 && day <= 31 && month >= 0 && month <= 11 && year >= 1940 && year <= 2050) {
            const d = new Date(Date.UTC(year, month, day))
            if (!isNaN(d.getTime())) {
                const mStr = String(month + 1).padStart(2, "0")
                const dStr = String(day).padStart(2, "0")
                const formattedDate = `${year}-${mStr}-${dStr}`
                return {
                    tempat: rawTempat || null,
                    date: d,
                    displayStr: formattedDate,
                }
            }
        }
    }

    // 5. Format ISO YYYY-MM-DD dengan tempat opsional
    // Contoh: "Kupang, 2005-09-06", "2005-09-06"
    const isoRegex = /(?:^(.*?)[,\s]+)?(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/
    const isoMatch = str.match(isoRegex)
    if (isoMatch) {
        const rawTempat = isoMatch[1] ? isoMatch[1].replace(/^[,\s\-/]+|[,\s\-/]+$/g, "").trim() : null
        const year = parseInt(isoMatch[2], 10)
        const month = parseInt(isoMatch[3], 10) - 1
        const day = parseInt(isoMatch[4], 10)
        if (day >= 1 && day <= 31 && month >= 0 && month <= 11 && year >= 1940 && year <= 2050) {
            const d = new Date(Date.UTC(year, month, day))
            if (!isNaN(d.getTime())) {
                const mStr = String(month + 1).padStart(2, "0")
                const dStr = String(day).padStart(2, "0")
                const formattedDate = `${year}-${mStr}-${dStr}`
                return {
                    tempat: rawTempat || null,
                    date: d,
                    displayStr: formattedDate,
                }
            }
        }
    }

    // 6. Fallback bawaan new Date()
    const parsed = new Date(str)
    if (!isNaN(parsed.getTime())) {
        const y = parsed.getFullYear()
        const m = String(parsed.getMonth() + 1).padStart(2, "0")
        const d = String(parsed.getDate()).padStart(2, "0")
        return { tempat: null, date: parsed, displayStr: `${y}-${m}-${d}` }
    }

    return { tempat: str, date: null, displayStr: "-" }
}
