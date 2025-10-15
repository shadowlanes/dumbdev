import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the HTTP codes JSON from public directory
const codesPath = path.join(__dirname, '../docs/public/http-codes.json');
const codes = JSON.parse(fs.readFileSync(codesPath, 'utf-8'));

// Create http-codes directory if it doesn't exist
const httpCodesDir = path.join(__dirname, '../docs/http-codes');
if (!fs.existsSync(httpCodesDir)) {
  fs.mkdirSync(httpCodesDir, { recursive: true });
}

// Generate a page for each HTTP code
codes.forEach(code => {
  const rawDescription = `${code.code} ${code.name}: ${code.meaning}`.replace(/\s+/g, ' ').trim();
  const description = rawDescription.length > 157 ? `${rawDescription.slice(0, 157)}...` : rawDescription;
  const keywords = `HTTP ${code.code}, ${code.name}, HTTP status code, REST API, web development`;
  
  const frontmatterTitle = JSON.stringify(`${code.code} ${code.name} - HTTP Status Code Explained`);
  const frontmatterDescription = JSON.stringify(description);
  const headDescription = JSON.stringify(description);
  const headKeywords = JSON.stringify(keywords);

  const content = `---
layout: doc
title: ${frontmatterTitle}
description: ${frontmatterDescription}
head:
  - - meta
    - name: description
      content: ${headDescription}
  - - meta
    - name: keywords
      content: ${headKeywords}
---

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
  <a href="/http-codes/" style="display: inline-block; padding: 12px 24px; background: hsl(var(--primary)); color: white; text-decoration: none; border-radius: var(--radius); font-weight: 500; transition: all 0.2s ease;">← Back to Search</a>
</div>
`;

  const fileName = `${code.code}.md`;
  const filePath = path.join(httpCodesDir, fileName);
  
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${fileName}`);
});

// Create a codes index page
const codesIndexContent = `---
layout: doc
title: All HTTP Status Codes
description: Complete list of all HTTP status codes organized by category
---

# All HTTP Status Codes

## 1xx Informational

${codes.filter(c => c.code >= 100 && c.code < 200).map(c => `- [${c.code} ${c.name}](/http-codes/${c.code})`).join('\n')}

## 2xx Success

${codes.filter(c => c.code >= 200 && c.code < 300).map(c => `- [${c.code} ${c.name}](/http-codes/${c.code})`).join('\n')}

## 3xx Redirection

${codes.filter(c => c.code >= 300 && c.code < 400).map(c => `- [${c.code} ${c.name}](/http-codes/${c.code})`).join('\n')}

## 4xx Client Errors

${codes.filter(c => c.code >= 400 && c.code < 500).map(c => `- [${c.code} ${c.name}](/http-codes/${c.code})`).join('\n')}

## 5xx Server Errors

${codes.filter(c => c.code >= 500 && c.code < 600).map(c => `- [${c.code} ${c.name}](/http-codes/${c.code})`).join('\n')}
`;

fs.writeFileSync(path.join(httpCodesDir, 'codes.md'), codesIndexContent);
console.log('Created: codes.md');

console.log(`\nGenerated ${codes.length} pages successfully!`);

