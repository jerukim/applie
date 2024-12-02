import path from 'node:path'
import { readdir, mkdir } from 'node:fs/promises'
import Chrome from 'selenium-webdriver/chrome'
import { Browser, Builder } from 'selenium-webdriver'

export async function initChromeProfile() {
  console.log('Checking if Chrome profile exists...')
  const profilePath = path.join(
    import.meta.dir + '/../profiles/chrome'
  )
  try {
    await readdir(profilePath)
    console.log('Chrome profile directory exists.')
  } catch (e) {
    console.log(
      'Chrome profile directory does not exist. Creating...'
    )
    await mkdir(profilePath, { recursive: true })
    console.log('Chrome profile directory created at ' + profilePath)
  }

  return profilePath
}

export function initChromeDriver(profilePath: string) {
  const options = new Chrome.Options()
  options.addArguments(
    // '--start-maximized',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--ignore-certificate-errors',
    '--disable-extensions',
    '--disable-gpu',
    'window-size=1200x800',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-translate',
    '--disable-popup-blocking',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-logging',
    '--disable-autofill',
    '--disable-plugins',
    '--disable-animations',
    '--disable-cache',
    '--user-data-dir=' + profilePath,
    '--profile-directory=' + 'default'
  )
  options.excludeSwitches('enable-automation', 'enable-logging')

  const driver = new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build()

  return driver
}
