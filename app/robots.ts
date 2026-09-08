import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://www.pmkmipa.web.id";

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/about", "/activities", "/contact", "/presensi/*"],
                disallow: ["/admin/", "/api/", "/login"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
