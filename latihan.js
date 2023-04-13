const puppeteer = require("puppeteer");
const dataHasilAbsen = [];
const fs = require('fs');
const cliProgress = require('cli-progress');
exports.getabsen = (req, res) => {
    const url = req.body.url;
    const user = req.body.user;
    const pass = req.body.password;
(async() => {
    const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36');
    await page.goto("https://kolabjar-asnpintar.lan.go.id/login", { waitUntil: 'networkidle0' });
    await page.type('[name="username"]', user);
    await page.type('[name="password"]', pass);
    await Promise.all([
        page.click('[type="submit"]'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await page.goto(url, { waitUntil: 'networkidle0' });
    const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('table tbody tr td a'))
        return tds.map(a => a.href)
      });
      const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
      bar1.start(data.length, 0);
    for (const [index, value]of data.entries()) {
        await page.goto(value, { waitUntil: 'networkidle0' });
        const nama = await page.evaluate(
            //() =>  document.querySelectorAll('div[class="col-md-6 border-left"] > div > table > tr:nth-child(1) > td ')
            () => Array.from(
                document.querySelectorAll('div[class="col-md-6 border-left"] > div > table > tbody > tr'),
                row => Array.from(row.querySelectorAll('th, td'), cell => cell.innerText)
            )
        );
        const data1 = await page.evaluate(
            () => Array.from(
                document.querySelectorAll('div[class="custom-scrollbar table-wrapper-scroll-y"] > table > tbody > tr'),
                row => Array.from(row.querySelectorAll('th, td'), cell => cell.innerText)
            )
        );

        const dataDariTabel = {
            nama: nama[1][1],
            absen: data1
        };
        dataHasilAbsen.push(dataDariTabel);
        const progres = index + 1;
        bar1.update(progres);
        if((index + 1) == data.length) {
            bar1.stop();
            const content = dataHasilAbsen;
            res.send({
                status: 'sukses',
                data: content
            });

        }
    }
    
    await page.screenshot({ path: "kolabjar.png" });
    await browser.close();
})();
}