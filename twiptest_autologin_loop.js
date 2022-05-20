const puppeteer = require(/*puppeteer*/'puppeteer-core');
const fs = require('fs');
function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  });
}
const twitchUserName = "twitch ID";
const twipURL = 'https://twip.kr';
const twipAlertboxURL = twipURL+'/widgets/alertbox/a6ypn1o857';

//main function
(async () => {
  //open page, goto twip.kr
  const browser = await puppeteer.launch(
    {headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'},
    {args: ['--user-data-dir=C:\\Users\\tehrb\\AppData\\Local\\Google\\Chrome\\User Data']}
  );
  let pages = await browser.pages();
  const alertboxPage = pages[0];
//  const alertboxPage = await browser.newPage();
  const page = await browser.newPage();

  ///////////set cookies
  const cookies = fs.readFileSync('cookies.json', 'utf8');

  const deserializedCookies = JSON.parse(cookies);
  await page.setCookie(...deserializedCookies);
  ///////////

  await alertboxPage.goto(twipAlertboxURL);

  await page.setViewport({width: 800, height: 600});
  await page.goto(twipURL);
  await delay(1500);

  //goto donation page(self)
  await page.goto(page.url()+twitchUserName+'/');
  /////////////LOOP
  while(1){
  //get current cash
  const nowCashSelector = 'body > nav > div.maybe-wrapped-in-dropdown > div > a > span.now-cash';  //  'body > nav:nth-child(2) > div.maybe-wrapped-in-dropdown > div > a > span.now-cash'
  var tStamp = new Date().getTime();
  var verifyTime = tStamp;
  var now = new Date();
  try{
  await page.waitForSelector(nowCashSelector, {timeout: 5000});
} catch (e) {
    page.screenshot({path: './screenshots/pageerror'+verifyTime+'.png', fullPage: true});
    console.log('↓screen captured(pageerror'+verifyTime+'.png)');
    console.log("*보유 캐시 정보를 찾을 수 없습니다. 스크린샷을 확인하세요. / "+ now);
    await delay(295000);
    page.reload();
    continue;
  }

  let cashElement = await page.$(nowCashSelector);
  let cashBefore = await page.evaluate(el => el.textContent, cashElement);
  cashBefore = Number(cashBefore.replace(/,/g, ""));
  //log error and goto wait when cash is not enough
  var now = new Date();
  if (cashBefore < 1000) {
    console.log("테스트계정 잔여캐시 부족(" + cashBefore + ") / " + now);
    page.screenshot({path: './screenshots/casherror'+verifyTime+'.png', fullPage: true});
    console.log('↓screen captured(casherror'+verifyTime+'.png)');
  } else {

  //console.log("cashBefore activated");
  //excute message donation
  try{
  await page.waitForSelector('#donation-text-textarea');
  await delay(3000);
  await page.click('#donation-text-textarea');
  await page.type('#donation-text-textarea', "MessageDonationTest_via_Puppeteer_"+ verifyTime);
  await delay(1000);
  await page.click('#make-donate-btn');
} catch (e) {
  console.log("후원페이지 에러: "+e);
}

  //console.log("donation activated");
  //get current cash(after donation)
  await delay(10000);  //2시간 이상 동작 시, 후원이 될 때까지 지연이 5초 이상 걸리는 현상이 있음
  await page.waitForSelector(nowCashSelector);
  cashElement = await page.$(nowCashSelector);
  let cashAfter = await page.evaluate(el => el.textContent, cashElement);
  cashAfter = Number(cashAfter.replace(/,/g, ""));
  let isCashPayed = (cashBefore === (cashAfter+1000));
  //take screenshot if cash is not payed
  if (isCashPayed == false) {
    page.screenshot({path: './screenshots/casherror'+verifyTime+'.png', fullPage: true});
    console.log('↓screen captured(casherror'+verifyTime+'.png)');
  }


  //focus to overlay tab, and get donation text
  alertboxPage.bringToFront();
  await delay(1000);
  const compareTextSelector = '#comment';
  await alertboxPage.waitForSelector(compareTextSelector);
  let compareText = await alertboxPage.$(compareTextSelector);
  let compareText_Val = await alertboxPage.evaluate(el => el.textContent, compareText);
  let isDonated = (compareText_Val === ("MessageDonationTest_via_Puppeteer_"+ verifyTime));

  let testBool = isDonated && isCashPayed;

  var now = new Date();
  console.log(
    "메시지후원 " + testBool + " / 테스트계정 잔여캐시: " + cashAfter + " / " + now
  );

  } //(cashBefore < 1000)의 else문 닫는 괄호

  await delay(6000);
  page.bringToFront();
  await delay(277500);
  page.reload();
  } //while(1) 닫는 괄호

})();
