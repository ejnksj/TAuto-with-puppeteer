const puppeteer = require(/*puppeteer*/'puppeteer-core');
const fs = require('fs');
function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  });
}
const twitchUserName = "ID";
const twitchUserPassword = "PW";

const twitchLoginButton = '#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div:nth-child(3) > form > div > div:nth-child(3) > button';

(async () => {
  const browser = await puppeteer.launch(
    {headless: false, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'},
    {args: ['--user-data-dir=C:\\Users\\user\\AppData\\Local\\Google\\Chrome\\User Data']}
  );
  const page = await browser.newPage();

  await page.setViewport({width: 800, height: 600});
  await page.goto('https://twip.kr/');

  await page.click("#login-button-area a.lbtn.watcher");
  await page.waitForSelector(twitchLoginButton,{visible: true});
  await delay(500);

  await page.click('input[id=login-username]');
  await page.type('[id=login-username]', twitchUserName);
  await page.click('input[id=password-input]');
  await page.type('[id=password-input]', twitchUserPassword);
  await page.click(twitchLoginButton);
//  await page.waitForSelector('#nav > a:nth-child(5)',{visible: true});

  await delay(8000);

  await page.goto(page.url()+twitchUserName+'/');
  const cookies = await page.cookies()
  const cookieJson = JSON.stringify(cookies)

  fs.writeFileSync('cookies.json', cookieJson)

  console.log("GET_COOKIES End");
})();
