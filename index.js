const puppeteer = require("puppeteer");
const dataPeserta = require("./datapeserta.json");
const dataHasilAbsen = [];
const dataHasilAbsen1 = [];
const dataHasilAbsen2 = [];
const fs = require('fs');
const cliProgress = require('cli-progress');

(async() => {
    const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36');
    await page.goto("https://kolabjar-asnpintar.lan.go.id/login", { waitUntil: 'networkidle0' });
    await page.type('[name="username"]', 'lemdik34');
    await page.type('[name="password"]', 'lemdik34');
    await Promise.all([
        page.click('[type="submit"]'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar1.start(dataPeserta.length, 0);
    for (let index = 0; index < 15; ++index) {
        let url = dataPeserta[index].URL;
        let nama = dataPeserta[index].nama;
        await page.goto(url, { waitUntil: 'networkidle0' });
        const data = await page.evaluate(
            () => Array.from(
                document.querySelectorAll('div[class="custom-scrollbar table-wrapper-scroll-y"] > table > tbody > tr'),
                row => Array.from(row.querySelectorAll('th, td'), cell => cell.innerText)
            )
        );
        const dataDariTabel = {
            nama: nama,
            absen: data
        }
        dataHasilAbsen.push(dataDariTabel);
        const progres = index + 1;
        bar1.update(progres);
    }
    for (let index = 15; index < 30; ++index) {
        let url = dataPeserta[index].URL;
        let nama = dataPeserta[index].nama;
        await page.goto(url, { waitUntil: 'networkidle0' });
        const data = await page.evaluate(
            () => Array.from(
                document.querySelectorAll('div[class="custom-scrollbar table-wrapper-scroll-y"] > table > tbody > tr'),
                row => Array.from(row.querySelectorAll('th, td'), cell => cell.innerText)
            )
        );
        const dataDariTabel = {
            nama: nama,
            absen: data
        }
        dataHasilAbsen1.push(dataDariTabel);
        const progres = index + 1;
        bar1.update(progres);
    }
    for (let index = 30; index < dataPeserta.length; ++index) {
        let url = dataPeserta[index].URL;
        let nama = dataPeserta[index].nama;
        await page.goto(url, { waitUntil: 'networkidle0' });
        const data = await page.evaluate(
            () => Array.from(
                document.querySelectorAll('div[class="custom-scrollbar table-wrapper-scroll-y"] > table > tbody > tr'),
                row => Array.from(row.querySelectorAll('th, td'), cell => cell.innerText)
            )
        );
        const dataDariTabel = {
            nama: nama,
            absen: data
        }
        dataHasilAbsen2.push(dataDariTabel);
        const progres = index + 1;
        bar1.update(progres);
    }
    //await page.screenshot({ path: "kolabjar.png" });
    const content = JSON.stringify(dataHasilAbsen);
    const content1 = JSON.stringify(dataHasilAbsen1);
    const content2 = JSON.stringify(dataHasilAbsen2);
    fs.writeFile('./cekabsen.txt', content, err => {
        if (err) {
            console.error(err)
            return
        } else {
            // do nothing
        }

    });
    fs.writeFile('./cekabsen1.txt', content1, err => {
        if (err) {
            console.error(err)
            return
        } else {
            // do nothing
        }

    });
    fs.writeFile('./cekabsen2.txt', content2, err => {
        if (err) {
            console.error(err)
            return
        } else {
            bar1.stop();
        }

    });
    await browser.close();
})();