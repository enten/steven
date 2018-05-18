import { getJsonLdFromResume } from './src/resume.lib';

import CV from './src/resume.json';
import { writeFileSync } from 'fs';

const jsonLdResume = getJsonLdFromResume(CV);
const jsonLdResumeRaw = JSON.stringify(jsonLdResume, null, 2);

writeFileSync('./steven-ld.json', jsonLdResumeRaw, 'utf-8');

console.log('write steven-ld.json');
