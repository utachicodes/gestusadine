
const { execSync } = require('child_process');

try {
    execSync('npx eslint . --format json > eslint_report.json', { stdio: 'inherit' });
} catch (e) {
    // eslint exits 1 on error
}

const fs = require('fs');
if (fs.existsSync('eslint_report.json')) {
    // Read with utf-8 explicitly, assuming eslint outputs consistent encoding
    // If it was utf-16 with BOM from redirection in powershell, we might need checking
    // But npx is usually standard node stream.
    // However, on Windows msg redirection > might imply encoding issues.
    // Let's try reading and if it fails, fallback.

    try {
        const content = fs.readFileSync('eslint_report.json', 'utf8');
        // If content starts with BOM or is weird, handle it? 
        // JSON.parse might fail if it's UTF-16 interpreted as UTF-8 crap.

        let data;
        try {
            data = JSON.parse(content);
        } catch (e) {
            // Try stripping BOM
            data = JSON.parse(content.replace(/^\uFEFF/, ''));
        }

        let errorCount = 0;
        const output = [];
        data.forEach(file => {
            const errors = file.messages.filter(m => m.severity === 2);
            if (errors.length > 0) {
                output.push(`File: ${file.filePath}`);
                errors.forEach(m => {
                    output.push(`  Line ${m.line}: ${m.message} (${m.ruleId})`);
                });
            }
        });
        fs.writeFileSync('lint_summary.txt', output.join('\n'));

    } catch (err) {
        console.error('Error parsing JSON:', err.message);
        // Print raw start to debug
        const raw = fs.readFileSync('eslint_report.json');
        console.log('Raw start:', raw.slice(0, 50).toString('hex'));
    }
}
