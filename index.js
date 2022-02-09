const puppeteer = require('puppeteer');
function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  });
}
const twitchUserName = "twitch ID";
const twitchUserPassword = "twitch PW";
const twitchLoginButton = '#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div.Layout-sc-nxg1ff-0.eFpRTs > form > div > div:nth-child(3) > button';
(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://twip.kr');
  await page.click("#login-button-area a.lbtn.watcher");

  await delay(3500);

  await page.click('input[id=login-username]');
  await page.type('[id=login-username]', twitchUserName);
  await page.click('input[id=password-input]');
  await page.type('[id=password-input]', twitchUserPassword);
  await page.click(twitchLoginButton);

})();
