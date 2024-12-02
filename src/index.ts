import { initChromeProfile, initChromeDriver } from './util'

async function main() {
  const profilePath = await initChromeProfile()
  const driver = initChromeDriver(profilePath)

  try {
  } finally {
    await driver.quit()
  }
}

main()
