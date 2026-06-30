import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const htmlPath = path.join(root, 'docs', 'kpt-akış-diagram.html')
const outJpeg = path.join(root, 'docs', 'KPT_GUNCELLEME_VERSIYON_AKIS.jpeg')

const htmlUrl = `file:///${htmlPath.replace(/\\/g, '/')}`

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 })
await page.goto(htmlUrl, { waitUntil: 'networkidle0' })
await page.screenshot({
  path: outJpeg,
  type: 'jpeg',
  quality: 92,
  fullPage: false,
})
await browser.close()

console.log('JPEG oluşturuldu:', outJpeg)
console.log('Boyut:', fs.statSync(outJpeg).size, 'bytes')
