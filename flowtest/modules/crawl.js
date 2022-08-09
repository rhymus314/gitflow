import puppeteer from "puppeteer-core";
import os from 'os'
import fs from 'fs'

const macUrl = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const whidowsUrl = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const currentOs = os.type()
const launchConfig = {
  headless: false,
  defaultViewport: null,
  ignoreDefaultArgs: ['--disable-extensions'],
  args: [ '--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications', '--disable-extensions'],
  executablePath: currentOs == 'Darwin' ? macUrl : whidowsUrl
}

let browser = null
let page = null
let finalData = []
// let stock = ['div.kospi_area.group_quot' , 'div.kosdaq_area.group_quot' , 'kospi200_area group_quot quot_opn']

// const pageSelector = '#content > div.article > div.section2 > div.section_stock_market > div.section_stock > div.kospi_area.group_quot'

const launch = async function () {

    browser = await puppeteer.launch(launchConfig);
    const pages = await browser.pages();
    page = pages[0]

}

const goto = async function(url) {
    return await page.goto(url)
}

const evalCode = async function () {
    await page.evaluate(function(){

        document.querySelector("#NM_FAVORITE > div.group_nav > ul.list_nav.NM_FAVORITE_LIST > li:nth-child(3) > a").click()
        
    })
}

const evalcosdaq = async function () {
    
    await page.waitForSelector('#content > div.article > div.section2 > div.section_stock_market > div.section_stock > div.kospi_area.group_quot > div.heading_area')
    const infoArr = await page.evaluate(function(){

        var trArr = document.querySelectorAll("#content > div.article > div.section2 > div.section_stock_market > div.section_stock > div")


        var returnData = []

        // stock = ['div.kospi_area.group_quot' , 'div.kosdaq_area.group_quot' , 'kospi200_area group_quot quot_opn']

        for (var i=0; i < trArr.length; i++) {

            var currentTr = trArr[i]

            var cosdaq = currentTr.querySelector(`div.heading_area > h4 > a > em > span`)?.innerText//.replaceAll('\t', '')
            var address = currentTr.querySelectorAll(`div.heading_area a span`)[3]?.innerText//.replaceAll('\t', '')
            var price = currentTr.querySelectorAll(`div.heading_area a span`)[4]?.innerText//.replaceAll('\t', '')
            var updown = currentTr.querySelectorAll(` div.heading_area a span`)[8]?.innerText//.replaceAll('\t','')

            var jsonData = {
                cosdaq,
                address,
                price,
                updown
            }
            console.log(address)

            if(jsonData.address != undefined) {
                returnData.push(jsonData)
                
            }

        }
        return returnData
    })
    finalData = finalData.concat(infoArr)

    // browser.close()
}

const evalHot = async function() {
    await page.waitForTimeout(3000)
    await page.evaluate(function(){
        document.querySelector("#container > div.aside > div > div.aside_area.aside_popular > a > em").click()
    })
}

const evalHotline = async function () {
    console.log(1)

    await page.waitForTimeout(3000)
    console.log(2)

    
    await page.waitForSelector("#contentarea > div.box_type_l > table > tbody > tr:nth-child(3)")

    const infoArr2 = await page.evaluate(function(){

        var trArr2 = document.querySelectorAll("#contentarea > div.box_type_l > table > tbody > tr")

        var returnData2 = []

        for (var i=0; i < trArr2.length; i++) {

            var currentTr2 = trArr2[i]

            var cosdaq2 = currentTr2.querySelector(`td`)?.innerText//.replaceAll('\t', '')
            var address2 = currentTr2.querySelectorAll(`td`)[2]?.innerText//.replaceAll('\t', '')
            var price2 = currentTr2.querySelectorAll(`td`)[3]?.innerText//.replaceAll('\t', '')
            var updown2 = currentTr2.querySelectorAll(`td`)[4]?.innerText//.replaceAll('\t','')
            var now = currentTr2.querySelectorAll(`td`)[4]?.innerText//.replaceAll('\t','')

            var jsonData2 = {
                "rank" : cosdaq2,
                "name" :address2,
                "value" :price2,
                "price" : updown2,
                "how" :now
            }
            console.log(address2)

            if(jsonData2.name != undefined) {
                returnData2.push(jsonData2)
                
            }

        }
        return returnData2
    })
    finalData = finalData.concat(infoArr2)

    browser.close()
}

const writeFile = async function() {
    const stringData = JSON.stringify(finalData)

    const exist = fs.existsSync(`./json/dataset`)

    if(!exist) {

        fs.mkdir(`./json/dataset`, {recursive: true}, function(err){
            console.log(err)
        })

    }
    const filePath = './json/dataseta.json'

    await fs.writeFileSync(filePath, stringData)
}

export{

    launch,
    goto,
    evalCode,
    evalcosdaq,
    evalHot,
    evalHotline,
    writeFile

}