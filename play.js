
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
  let [serviceWorkerPage] = browserContext.serviceWorkers();
  if (!serviceWorkerPage)
    serviceWorkerPage = await browserContext.waitForEvent('serviceworker');
  const page = await browserContext.newPage()
  await page.goto(url.pathToFileURL(path.join(__dirname, 'test.html')).href)

  await serviceWorkerPage.evaluate(async () => {
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: () => { chrome.dom.openOrClosedShadowRoot(document.querySelector('span')).querySelector('input').value = "bebo" }
    });
  })

  await new Promise(r => setTimeout(r, 10_000));

  await browserContext.close();
}
begin()