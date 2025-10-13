import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the HTTP codes JSON
const codesPath = path.join(__dirname, 'http-codes.json');
const codes = JSON.parse(fs.readFileSync(codesPath, 'utf-8'));

// Create docs directory if it doesn't exist
const docsDir = path.join(__dirname, 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

// Generate a page for each HTTP code
codes.forEach(code => {
  // Create SEO-friendly description (max 160 chars)
  const description = `${code.code} ${code.name}: ${code.meaning.substring(0, 140)}...`;
  
  const content = `---
layout: doc
title: ${code.code} ${code.name} - HTTP Status Code Explained
description: ${description}
head:
  - - meta
    - name: description
      content: ${description}
  - - meta
    - name: keywords
      content: HTTP ${code.code}, ${code.name}, HTTP status code, REST API, web development
  - - link
    - rel: canonical
      href: https://httpcodes.shadowlanes.com/${code.code}
---

<script setup>
const structuredData = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "${code.code} ${code.name} - HTTP Status Code",
  "description": "${code.meaning}",
  "url": "https://httpcodes.shadowlanes.com/${code.code}",
  "keywords": "HTTP ${code.code}, ${code.name}, HTTP status code",
  "articleBody": "${code.meaning} ${code.whenToUse}",
  "publisher": {
    "@type": "Organization",
    "name": "HTTP Codes Explainer"
  }
}
</script>

<script type="application/ld+json" v-html="JSON.stringify(structuredData)"></script>

# ${code.code} ${code.name}

## Meaning

${code.meaning}

## When to Use

${code.whenToUse}

## Example

${code.example}

## When Not to Use

${code.whenNotToUse}

${code.source ? `## Source\n\n${code.source}` : ''}

---

<div style="margin-top: 40px;">
  <a href="/" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">← Back to Search</a>
</div>
`;

  const fileName = `${code.code}.md`;
  const filePath = path.join(docsDir, fileName);
  
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${fileName}`);
});

// Create a codes index page
const codesIndexContent = `---
layout: doc
title: All HTTP Status Codes
---

# All HTTP Status Codes

## 1xx Informational

${codes.filter(c => c.code >= 100 && c.code < 200).map(c => `- [${c.code} ${c.name}](/${c.code})`).join('\n')}

## 2xx Success

${codes.filter(c => c.code >= 200 && c.code < 300).map(c => `- [${c.code} ${c.name}](/${c.code})`).join('\n')}

## 3xx Redirection

${codes.filter(c => c.code >= 300 && c.code < 400).map(c => `- [${c.code} ${c.name}](/${c.code})`).join('\n')}

## 4xx Client Errors

${codes.filter(c => c.code >= 400 && c.code < 500).map(c => `- [${c.code} ${c.name}](/${c.code})`).join('\n')}

## 5xx Server Errors

${codes.filter(c => c.code >= 500 && c.code < 600).map(c => `- [${c.code} ${c.name}](/${c.code})`).join('\n')}
`;

fs.writeFileSync(path.join(docsDir, 'codes.md'), codesIndexContent);
console.log('Created: codes.md');

console.log(`\nGenerated ${codes.length} pages successfully!`);
