const puppeteer = require('puppeteer');
function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  });
}
const twitchUserName = "twitch ID";
const twitchUserPassword = "twitch PW";

const twitchLoginButton = '#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div.Layout-sc-nxg1ff-0.eFpRTs > form > div > div:nth-child(3) > button';

//main function
(async () => {
  //open page, goto twip.kr
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://twip.kr');
  //click login(watcher) button
  await page.click("#login-button-area a.lbtn.watcher");
  //wait for twitch login page
  await page.waitForSelector(
    '#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div.Layout-sc-nxg1ff-0.eFpRTs > form > div > div:nth-child(3) > button'
    ,{visible: true}
  );
  await delay(500);
  //input id and pw, click login button
  await page.click('input[id=login-username]');
  await page.type('[id=login-username]', twitchUserName);
  await page.click('input[id=password-input]');
  await page.type('[id=password-input]', twitchUserPassword);
  await page.click(twitchLoginButton);
  //wait for email auth completed, and twip page(logged in state)
  await page.waitForSelector(
    '#nav > a:nth-child(5)'
    ,{visible: true}
  );
  await delay(500);
  //logged in twip completely, now do some tasks
  await page.click('#nav > a:nth-child(5)');

})();
