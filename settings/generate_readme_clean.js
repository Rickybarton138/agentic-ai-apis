/**
 * Generate a focused README and category pages for the agentic AI subset.
 *
 * Source data comes from ../apify_actors.json, but the generated repo only
 * keeps the categories relevant to autonomous AI agents:
 * - Agents
 * - AI (displayed as AI Models)
 * - MCP Servers
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const jsonPath = path.join(ROOT_DIR, 'apify_actors.json');

const ALLOWED_CATEGORIES = [
    { key: 'Agents', displayName: 'Agents' },
    { key: 'AI', displayName: 'AI Models' },
    { key: 'MCP Servers', displayName: 'MCP Servers' },
];

const ALLOWED_CATEGORY_MAP = new Map(
    ALLOWED_CATEGORIES.map((category) => [category.key, category])
);

if (!fs.existsSync(jsonPath)) {
    throw new Error(`Missing source data at ${jsonPath}`);
}

const actors = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

function shouldFilterActor(actor) {
    const title = (actor.title || actor.name || '').toLowerCase();
    const name = (actor.name || '').toLowerCase();
    const description = (actor.description || '').toLowerCase().trim();

    const filterPatterns = [
        /^my actor/i,
        /^testactor/i,
        /^test crawler/i,
        /^test actor/i,
        /^my actorrr/i,
        /^my actor\s*\d+$/i,
        /^test\s*$/i,
        /^test\s+crawler/i,
    ];

    if (filterPatterns.some((pattern) => pattern.test(title) || pattern.test(name))) {
        return true;
    }

    return description === 'test' || (description === '' && (title.includes('my actor') || title.includes('test')));
}

function formatFolderName(displayName, count) {
    return `${displayName.toLowerCase().replace(/\s+/g, '-')}-apis-${count}`;
}

function truncateDescription(description, maxLength = 200) {
    if (!description || description.length <= maxLength) {
        return description || '-';
    }

    let cutPoint = maxLength;
    const lastSpace = description.lastIndexOf(' ', maxLength);
    if (lastSpace > maxLength * 0.8) {
        cutPoint = lastSpace;
    }

    return `${description.substring(0, cutPoint).trim()}...`;
}

function sanitizeTableValue(value) {
    return (value || '').replace(/\|/g, '&#124;').replace(/\n/g, ' ');
}

function groupActorsByAllowedCategory(allActors) {
    const grouped = new Map(ALLOWED_CATEGORIES.map((category) => [category.key, []]));

    for (const actor of allActors) {
        if (shouldFilterActor(actor)) {
            continue;
        }

        const categories = actor.categories || [];
        for (const category of categories) {
            if (!ALLOWED_CATEGORY_MAP.has(category)) {
                continue;
            }

            const list = grouped.get(category);
            const exists = list.some(
                (entry) => entry.name === actor.name && entry.username === actor.username
            );

            if (!exists) {
                list.push(actor);
            }
        }
    }

    return grouped;
}

function writeCategoryReadme(category, categoryActors) {
    const folderName = formatFolderName(category.displayName, categoryActors.length);
    const categoryDir = path.join(ROOT_DIR, folderName);
    fs.mkdirSync(categoryDir, { recursive: true });

    const sortedActors = [...categoryActors].sort((a, b) =>
        (a.title || a.name || '').localeCompare(b.title || b.name || '')
    );

    let content = `# ${category.displayName}\n\n`;
    content += `<p align="right"><a href="../README.md#table-of-contents">Back to main list</a></p>\n\n`;
    content += `**${categoryActors.length.toLocaleString()} APIs in this category**\n\n`;
    content += `| API Name | Description |\n`;
    content += `|----------|-------------|\n`;

    for (const actor of sortedActors) {
        const title = sanitizeTableValue(actor.title || actor.name || 'Unknown');
        const url = actor.affiliate_url || actor.url || '';
        const description = sanitizeTableValue(truncateDescription(actor.description || ''));
        content += `| [${title}](${url}) | ${description || '-'} |\n`;
    }

    content += `\n`;
    fs.writeFileSync(path.join(categoryDir, 'README.md'), content, 'utf-8');
}

function removeDisallowedCategoryDirectories(allowedFolderNames) {
    const topLevelEntries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });

    for (const entry of topLevelEntries) {
        if (!entry.isDirectory()) {
            continue;
        }

        if (!entry.name.endsWith('-apis-697') &&
            !entry.name.endsWith('-apis-1208') &&
            !entry.name.endsWith('-apis-131') &&
            !/-apis-\d+$/.test(entry.name)) {
            continue;
        }

        if (allowedFolderNames.has(entry.name)) {
            continue;
        }

        fs.rmSync(path.join(ROOT_DIR, entry.name), { recursive: true, force: true });
    }
}

function writeRootReadme(categoryCounts) {
    const totalCount = categoryCounts.reduce((sum, category) => sum + category.count, 0);
    const today = new Date().toISOString().split('T')[0];

    let content = `# Agentic AI APIs\n\n`;
    content += `The ultimate collection of APIs for building autonomous AI agents - ${totalCount.toLocaleString()} production-ready APIs across Agents, AI Models, and MCP Servers. Stop wasting weeks building infrastructure. Plug these in and ship your agent today.\n\n`;
    content += `<a id="table-of-contents"></a>\n\n`;
    content += `## Collection Stats\n\n`;
    content += `| Metric | Count |\n`;
    content += `|--------|-------|\n`;
    content += `| Total APIs | ${totalCount.toLocaleString()} |\n`;
    content += `| Categories | ${categoryCounts.length} |\n`;
    content += `| Last Updated | ${today} |\n\n`;
    content += `## Included Categories\n\n`;

    for (const category of categoryCounts) {
        content += `- [${category.displayName}](./${category.folderName}/) - ${category.count.toLocaleString()} APIs\n`;
    }

    content += `\n## Scope\n\n`;
    content += `This repository is intentionally focused on the APIs most useful for autonomous AI agent workflows:\n\n`;
    content += `- Agents for agentic execution, orchestration, and autonomous task handling\n`;
    content += `- AI Models for generation, reasoning, extraction, and model-powered workflows\n`;
    content += `- MCP Servers for tool access through the Model Context Protocol\n\n`;
    content += `Everything outside those three categories has been removed from the tracked repository structure.\n\n`;
    content += `## Notes\n\n`;
    content += `- The generation scripts in [settings](./settings/) rebuild only these three categories.\n`;
    content += `- API links keep the existing affiliate tracking from the upstream source data.\n`;

    fs.writeFileSync(path.join(ROOT_DIR, 'README.md'), content, 'utf-8');
}

const groupedActors = groupActorsByAllowedCategory(actors);
const categoryCounts = [];
const allowedFolderNames = new Set();

for (const category of ALLOWED_CATEGORIES) {
    const categoryActors = groupedActors.get(category.key) || [];
    const folderName = formatFolderName(category.displayName, categoryActors.length);
    allowedFolderNames.add(folderName);
    writeCategoryReadme(category, categoryActors);
    categoryCounts.push({
        displayName: category.displayName,
        count: categoryActors.length,
        folderName,
    });
}

removeDisallowedCategoryDirectories(allowedFolderNames);
writeRootReadme(categoryCounts);

console.log('Focused README and category pages generated successfully.');
