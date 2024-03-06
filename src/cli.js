#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import yargs from 'yargs';

const {argv} = yargs(process.argv.slice(2));

const configPath = path.join(process.cwd(), '.gitpiercer');

if (argv.u) {
    fs.writeFileSync(configPath, argv.u);
    console.log(`Saved username: ${argv.u}`);
} else {
    const repoName = argv._[0];
    if (repoName) {
        const username = fs.readFileSync(configPath, 'utf8').trim();
        const gitpiercerUrl = `https://raw.githubusercontent.com/${username}/${repoName}/master/.gitpiercer`;

        try {
            const gitpiercerContent = execSync(`curl -sL ${gitpiercerUrl}`, { encoding: 'utf8' });
            console.log(`Executing .gitpiercer from ${gitpiercerUrl}`);
            execSync(gitpiercerContent, { stdio: 'inherit', shell: true });
        } catch (error) {
            console.error(`Failed to download or execute .gitpiercer from ${gitpiercerUrl}`);
        }
    } else {
        console.log('Please provide a repository name.');
    }
}