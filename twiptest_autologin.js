const puppeteer = require(/*puppeteer*/'puppeteer-core');
const fs = require('fs');
function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  });
}
const twitchUserName = "Twitch ID";
const twitchUserPassword = "Twitch PW";

const twitchLoginButton = '#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div.Layout-sc-nxg1ff-0.eFpRTs > form > div > div:nth-child(3) > button';

//main function
(async () => {
  //open page, goto twip.kr
  const browser = await puppeteer.launch(
    {headless: false, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'},
    {args: [/*'--window-size=1388,768', '--remote-debugging-port=21222', */'--user-data-dir=C:\\Users\\tehrb\\AppData\\Local\\Google\\Chrome\\User Data']}
  );
  const page = await browser.newPage();

  ///////////set cookies
  const cookies = fs.readFileSync('cookies.json', 'utf8');

  const deserializedCookies = JSON.parse(cookies);
  await page.setCookie(...deserializedCookies);
  ///////////

  await page.setViewport({width: 800, height: 600});
  await page.goto('https://ejn.mytwip.net/');
  await delay(5000);
  ///////////hide this due to Cookies Set////////////////
/**********************************************************
  //click login(watcher) button
  await page.click("#login-button-area a.lbtn.watcher");
  //wait for twitch login page
  await page.waitForSelector(twitchLoginButton,{visible: true});
  await delay(500);

  //input id and pw, click login button
  await page.click('input[id=login-username]');
  await page.type('[id=login-username]', twitchUserName);
  await page.click('input[id=password-input]');
  await page.type('[id=password-input]', twitchUserPassword);
  await page.click(twitchLoginButton);
  //wait for email auth completed, and twip page(logged in state)
  await page.waitForSelector('#nav > a:nth-child(5)',{visible: true});

  await delay(500);
**********************************************************/

  //logged in twip completely, now do some tasks
  //////////////////////////////////////////////////
  //await page.click('#nav > a:nth-child(5)');

  //goto donation page(self)
  await page.goto(page.url()+twitchUserName+'/');
  //get current cash
  const nowCashSelector = 'body > nav > div.maybe-wrapped-in-dropdown > div > a > span.now-cash';  //  'body > nav:nth-child(2) > div.maybe-wrapped-in-dropdown > div > a > span.now-cash'
  await page.waitForSelector(nowCashSelector);
  let cashElement = await page.$(nowCashSelector);
  let cashBefore = await page.evaluate(el => el.textContent, cashElement);
  cashBefore = Number(cashBefore.replace(/,/g, ""));
  //console.log("cashBefore activated");
  //excute message donation
  await page.waitForSelector('#donation-text-textarea');
  await page.click('#donation-text-textarea');
  await page.type('#donation-text-textarea', "MessageDonationTest_via_Puppeteer_"+ twitchUserName);
  await page.click('#make-donate-btn');
  //console.log("donation activated");
  //get current cash(after donation)
  await delay(3000);
  await page.waitForSelector(nowCashSelector);
  cashElement = await page.$(nowCashSelector);
  let cashAfter = await page.evaluate(el => el.textContent, cashElement);
  cashAfter = Number(cashAfter.replace(/,/g, ""));
  var now = new Date();
  console.log(
    (
//     cashBefore + "/" + (cashAfter+1000)
     cashBefore === (cashAfter+1000)
    )+ " / " + now
  );

/////////////unhide this when cookies expired//////////////
/*
  const cookies = await page.cookies()
  const cookieJson = JSON.stringify(cookies)

  fs.writeFileSync('cookies.json', cookieJson)
*/
//////////////////////////////////////////////////////////

})();
