#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import https from 'https';

const args = process.argv.slice(2);
const command = args[0];
const target = args[1] || '.';

const API_BASE = process.env.ARCHSCOPE_URL || 'https://archscope.dev';
const TOKEN = process.env.ARCHSCOPE_TOKEN;
const ORG = process.env.ARCHSCOPE_ORG || 'personal';

if (!command || ['-h', '--help'].includes(command)) {
    console.log(`
ArchScope Enterprise CLI

Usage:
  archscope scan <repo_url>     Run a policy scan against a repository
  archscope report <repo_url>   Fetch and print the full JSON architecture report
  archscope drift <repo_url>    Check for architecture drift vs baseline

Options:
  Set env var ARCHSCOPE_TOKEN for private API access
  Set env var ARCHSCOPE_ORG to specify the target workspace

Examples:
  archscope scan vercel/next.js
  archscope report github.com/facebook/react
`);
    process.exit(0);
}

function makeRequest(endpoint, method, body) {
    return new Promise((resolve, reject) => {
        const url = new URL(`${API_BASE}${endpoint}`);
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {})
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
                } catch {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function run() {
    if (command === 'scan') {
        console.log(`\nAnalyzing ${target} via ArchScope CI Gate...`);
        try {
            const { status, data } = await makeRequest('/api/ci', 'POST', { repoUrl: target, org: ORG });
            
            if (status === 200) {
                console.log('\n✅ [PASS] Architecture within policy guardrails');
                console.log(`   Health Score: ${data.healthScore}/100`);
                console.log(`   Complexity:   ${data.complexityScore}/100`);
                console.log(`   Full Report:  ${data.reportUrl}\n`);
                process.exit(0);
            } else if (status === 422) {
                console.log('\n❌ [FAIL] Policy violations detected');
                data.violations.forEach(v => console.log(`   - ${v}`));
                console.log(`\n   Full Report: ${data.reportUrl}\n`);
                process.exit(1);
            } else {
                console.log(`\n⚠️ API Error: ${data.error || 'Unknown error'}`);
                process.exit(1);
            }
        } catch (e) {
            console.error('\nNetwork error connecting to ArchScope', e);
            process.exit(1);
        }
    } 
    else if (command === 'report') {
        // Just print raw JSON of the scan endpoint
        const { status, data } = await makeRequest('/api/scan', 'POST', { repoUrl: target, org: ORG });
        console.log(JSON.stringify(data, null, 2));
        process.exit(status === 200 ? 0 : 1);
    }
    else {
        console.log(`Unknown command: ${command}`);
        process.exit(1);
    }
}

run();
