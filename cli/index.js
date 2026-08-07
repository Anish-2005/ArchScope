#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import gradient from 'gradient-string';
import axios from 'axios';

const program = new Command();
const archGradient = gradient(['#22d3ee', '#14b8a6']);
console.log(archGradient('\n  ▲ ArchScope Engine CLI v2.0.0'));
console.log(chalk.gray('  Engineering intelligence for platform teams\n'));

program.name('archscope').description('Repository intelligence for architectural oversight').version('2.0.0');
program.command('scan').description('Analyze a repository through the ArchScope API')
  .argument('<repo>', 'GitHub repository URL or owner/repo shorthand')
  .option('-o, --output <type>', 'Output format (json, text)', 'text')
  .option('--api-url <url>', 'ArchScope API base URL', process.env.ARCHSCOPE_API_URL || 'http://localhost:3000')
  .option('--organization <name>', 'Organization workspace', 'personal')
  .action(async (repo, options) => {
    const repoUrl = !repo.includes('github.com/') && repo.includes('/') ? `https://github.com/${repo.replace(/^\/+/, '')}` : repo;
    const spinner = ora({ text: chalk.cyan('Running repository intelligence scan...'), color: 'cyan' }).start();
    try {
      const apiUrl = options.apiUrl.replace(/\/$/, '');
      const { data: report } = await axios.post(`${apiUrl}/api/scan`, { repoUrl, organization: options.organization }, { timeout: 120000 });
      spinner.stop();
      if (options.output === 'json') return console.log(JSON.stringify(report, null, 2));
      const output = [
        '', `${chalk.bold('Repository:')} ${chalk.cyan(`${report.repo.owner}/${report.repo.name}`)}`,
        `${chalk.bold('Engineering health:')} ${chalk.green(report.healthScore)}/100`,
        `${chalk.bold('Architecture index:')} ${chalk.bold.yellow(report.complexityScore)}/100`,
        `${chalk.bold('Delivery risk:')} ${report.deliveryRisk}`, `${chalk.bold('ML readiness:')} ${report.mlReadiness}/100`, '',
        `${chalk.bold('Priority findings:')}`, report.findings.slice(0, 3).map((finding) => `  ${chalk.gray('•')} ${finding.title}`).join('\n'), ''
      ].join('\n');
      process.stdout.write(boxen(output, { padding: 1, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderStyle: 'round', borderColor: 'cyan', title: 'ARCHITECTURAL REPORT', titleAlignment: 'center' }) + '\n');
    } catch (error) {
      spinner.fail(chalk.red('Scan failed. Confirm the API is running and the repository is accessible.'));
      console.error(chalk.dim(error instanceof Error ? error.message : 'Unknown error'));
      process.exitCode = 1;
    }
  });

program.parse();
