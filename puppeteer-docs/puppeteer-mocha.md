# Puppeteer Testing With Mocha

Mocha is a JavaScript automation testing framework to run the tests on Node.js and the browser. It enables you to run test cases serially, providing greater flexibility and accurate test reporting while mapping unidentified bugs to the correct test cases.

LambdaTest allows you to run Puppeteer tests with Mocha on a browser farm of 40+ real browsers and operating system combinations. 

This guide will cover the basics of getting started with Puppeteer testing with Mocha on the LambdaTest platform.

## Pre-requisites

1. Clone the LambdaTest-Puppeteer repository on your system.

2. Install the npm dependencies.

```
npm install
```

3. In order to run your Puppeteer tests with Mocha, you will need to set your LambdaTest username and access key in the environment variables. Click the **Access Key** button at the top-right of the Automation Dashboard to access it.

![image](https://user-images.githubusercontent.com/70570645/194759326-9cf2b3a7-57e0-4d91-bd4a-9a456d1da044.png)

**Windows**

```js
set LT_USERNAME="YOUR_LAMBDATEST_USERNAME"
set LT_ACCESS_KEY="YOUR_LAMBDATEST_ACCESS_KEY"
```

**macOS/Linux**

```js
export LT_USERNAME="YOUR_LAMBDATEST_USERNAME"
export LT_ACCESS_KEY="YOUR_LAMBDATEST_ACCESS_KEY"
```

## Running Tests Using Mocha

>**Test Scenario**: The below test script searches LambdaTest on DuckDuckGo and verifies the website title.

1. To run the Puppeteer Mocha tests on LambdaTest, you need make some tweaks to the `google.spec.js` file.

```js
const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const caps_chrome = {
	browserName    : 'Chrome',
	browserVersion : 'latest',
	'LT:Options'   : {
		platform   : 'Windows 10',
		build      : 'Sample Puppeteer-Mocha',
		name       : 'Puppeteer-mocha test on Chrome',
		resolution : '1366x768',
		user       : process.env.LT_USERNAME,
		accessKey  : process.env.LT_ACCESS_KEY,
		network    : true
	}
};
const caps_edge = {
	browserName    : 'MicrosoftEdge',
	browserVersion : 'latest',
	'LT:Options'   : {
		platform   : 'Windows 10',
		build      : 'Sample Puppeteer-Mocha',
		name       : 'Puppeteer-mocha test on Edge',
		resolution : '1366x768',
		user       : process.env.LT_USERNAME,
		accessKey  : process.env.LT_ACCESS_KEY,
		network    : true
	}
};

let browser = null;
let page = null;
describe('Search Text', () => {
	beforeEach(async () => {
		browser = await puppeteer.connect({
			browserWSEndpoint : `wss://cdp.lambdatest.com/puppeteer?capabilities=${encodeURIComponent(
				JSON.stringify(caps_chrome)
			)}`
		});
		page = await browser.newPage();
	});

	it('should be titled "Google"', async () => {
		let text = 'Google';
		await page.goto('https://www.duckduckgo.com');
		var element = await page.$('[name="q"]');
		await element.click();
		await element.type(text);
		await Promise.all([
			page.keyboard.press('Enter'),
			page.waitForNavigation()
		]);
		var title = await page.title();
		try {
			expect(title).equal(text + ' at DuckDuckGo', 'Expected page title is incorrect!');
			await page.evaluate(
				(_) => {},
				`lambdatest_action: ${JSON.stringify({
					action    : 'setTestStatus',
					arguments : { status: 'passed', remark: 'assertion passed' }
				})}`
			);
		} catch (e) {
			await page.evaluate(
				(_) => {},
				`lambdatest_action: ${JSON.stringify({
					action    : 'setTestStatus',
					arguments : { status: 'failed', remark: e.name }
				})}`
			);
		}
	});

	afterEach(async () => {
		await page.close();
		await browser.close();
	});
});
```

2. Now pass the below command to run your test.

```
npm run test
```


3. Visit the LambdaTest Automation Dashboard to see the results of your Puppeteer Mocha tests.
