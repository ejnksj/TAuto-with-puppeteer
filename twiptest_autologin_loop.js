const puppeteer = require(/*puppeteer*/'puppeteer-core');
const fs = require('fs');
function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  });
}
const twitchUserName = "ID";
const twitchUserPassword = "PW";
const twitchAlertboxURL = 'twipAlertboxURL';

//main function
(async () => {
  //open page, goto twip.kr
  const browser = await puppeteer.launch(
    {headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'},
    {args: [/*'--window-size=1388,768', '--remote-debugging-port=21222', */'--user-data-dir=C:\\Users\\user\\AppData\\Local\\Google\\Chrome\\User Data']}
  );
  const alertboxPage = await browser.newPage();
  const page = await browser.newPage();

  ///////////set cookies
  const cookies = fs.readFileSync('cookies.json', 'utf8');

  const deserializedCookies = JSON.parse(cookies);
  await page.setCookie(...deserializedCookies);
  ///////////

  await alertboxPage.goto(twitchAlertboxURL);

  await page.setViewport({width: 800, height: 600});
  await page.goto('https://twip.kr/');
  await delay(1500);

  /////////////LOOP
  while(1){
  //goto donation page(self)
  await page.goto(page.url()+twitchUserName+'/');
  //get current cash
  const nowCashSelector = 'body > nav > div.maybe-wrapped-in-dropdown > div > a > span.now-cash';  //  'body > nav:nth-child(2) > div.maybe-wrapped-in-dropdown > div > a > span.now-cash'
  var tStamp = new Date().getTime();
  var verifyTime = tStamp;
  await page.waitForSelector(nowCashSelector);
  let cashElement = await page.$(nowCashSelector);
  let cashBefore = await page.evaluate(el => el.textContent, cashElement);
  cashBefore = Number(cashBefore.replace(/,/g, ""));
  //console.log("cashBefore activated");
  //excute message donation
  await page.waitForSelector('#donation-text-textarea');
  await page.click('#donation-text-textarea');
  await page.type('#donation-text-textarea', "MessageDonationTest_via_Puppeteer_"+ verifyTime);
  await page.click('#make-donate-btn');
  //console.log("donation activated");
  //get current cash(after donation)
  await delay(3000);
  await page.waitForSelector(nowCashSelector);
  cashElement = await page.$(nowCashSelector);
  let cashAfter = await page.evaluate(el => el.textContent, cashElement);
  cashAfter = Number(cashAfter.replace(/,/g, ""));

  //focus to overlay tab, and get donation text
  alertboxPage.bringToFront();
  await delay(1000);
  const compareTextSelector = '#comment';
  await alertboxPage.waitForSelector(compareTextSelector);
  let compareText = await alertboxPage.$(compareTextSelector);
  let compareText_Val = await alertboxPage.evaluate(el => el.textContent, compareText);
  let isDonated = (compareText_Val === ("MessageDonationTest_via_Puppeteer_"+ verifyTime));
  let isCashPayed = (cashBefore === (cashAfter+1000));
  let testBool = isDonated && isCashPayed;

  var now = new Date();
  console.log(
    "메시지후원 " + testBool + " / " + now
  );
await delay(6000);
page.bringToFront();
await delay(1800000);
}

})();
