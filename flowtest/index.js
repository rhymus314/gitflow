import { launch, goto, evalCode, evalHot, evalcosdaq ,evalHotline, writeFile} from './modules/crawl.js'

async function main () {

    await launch()

    await goto('https://www.naver.com')

    await evalCode()

    await evalcosdaq()

    await evalHot()

    await evalHotline()

    await writeFile()

    

    // process.exit(1)

}

main()