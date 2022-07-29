const puppeteer = require('puppeteer');
const caps_chrome = {
  'browserName': 'Chrome',
  'browserVersion': 'latest',
  'LT:Options': {
    'platform': 'Windows 10',
    'build': 'Sample Puppeteer-Jest',
    'name': 'Puppeteer-jest test on Chrome',
    'resolution': '1366x768',
    'user': process.env.LT_USERNAME,
    'accessKey': process.env.LT_USER_KEY,
    'network': true
  }
};

let browser = null;
let page = null;
describe('Search Text', () => {
  before(async () => {
    browser = await puppeteer.connect({browserWSEndpoint: `wss://cdp.lambdatest.com/puppeteer?capabilities=${encodeURIComponent(JSON.stringify(caps_chrome))}`})
    page = await browser.newPage()
  });

  it('should be titled "Lambdatest"', async () => {
    let text = 'LambdaTest'
    await page.goto('https://www.duckduckgo.com');
    var element = await page.$('[name="q"]');
    await element.click();
    await element.type(text);
    await Promise.all([page.keyboard.press('Enter'), page.waitForNavigation()])
    var title = await page.title();
    try {
      expect(title).toEqual(text+' at DuckDuckGo', 'Expected page title is incorrect!');
      await page.evaluate(_ => { }, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'assertion passed' } })}`);
    } catch {
      await page.evaluate(_ => { }, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: 'assertion failed' } })}`);
    }
  });
  after(async()=>{
    await page.close()
    await browser.close()
  })
});