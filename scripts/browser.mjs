import {existsSync} from 'node:fs';
import {chromium} from 'playwright-chromium';
export const executablePath=[process.env.CHROME_PATH,'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',chromium.executablePath(),'/usr/bin/google-chrome','/usr/bin/chromium'].find(p=>p&&existsSync(p));
if(!executablePath)throw new Error('Install Chromium: npx playwright install chromium, or set CHROME_PATH');
