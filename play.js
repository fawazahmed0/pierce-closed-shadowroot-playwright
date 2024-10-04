
const { chromium } = require('playwright');
const path = require('path')
const url = require('node:url');

async function begin() {
  const pathToExtension = path.join(__dirname, 'extension')
  const userDataDir = path.join(__dirname, 'userdir')
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      '--disable-web-security'
    ]
  })

  const page = await browserContext.newPage()
  await page.goto(url.pathToFileURL(path.join(__dirname, 'test.html')).href)

  await new Promise(r => setTimeout(r, 10_000));


  await browserContext.close();
}
begin()