import * as cheerio from 'cheerio';

export interface AuditReport {
    title: string;
    metaDescription: string;
    h1Count: number;
    imagesMissingAlt: number;
    wordCount: number;
}

export function parseHtml(html: string): AuditReport {
    const $ = cheerio.load(html);

    $("script, style, noscript").remove();

    const title = $("title").first().text().trim();

    const metaDescription = $('meta[name="description"]').attr('content')?.trim() ?? '';

    const h1Count = $('h1').length;

    let imagesMissingAlt = 0;
    $("img").each((_, el) => {
        const alt = $(el).attr('alt');
        if (!alt || !alt.trim()) {
            imagesMissingAlt++;
        }
    });

    const text = $("body").text().replace(/\s+/g, ' ').trim();
    const wordCount = text.length === 0 ? 0 : text.split(" ").length;

    return {
        title,
        metaDescription,
        h1Count,
        imagesMissingAlt,
        wordCount
    }
}