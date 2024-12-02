import { initChromeProfile, initChromeDriver } from './util'
import {
  BuiltInDriver,
  DatePosted,
  DeveloperEngineerSkills,
  DeveloperEngineerSubCategory,
  Experience,
  Industry,
  JobCategory,
} from './BuiltIn'

async function main() {
  const profilePath = await initChromeProfile()
  const driver = initChromeDriver(profilePath)

  try {
    const builtInDriver = new BuiltInDriver(driver)
    // await builtInDriver.login()
    await builtInDriver.goToJobsPage()
    await builtInDriver.setJobFilters({
      earlyApplicant: false,
      datePosted: DatePosted.PastWeek,
      jobCategory: JobCategory.DeveloperEngineer,
      jobSubCategory: [
        DeveloperEngineerSubCategory['Front-End'],
        DeveloperEngineerSubCategory.Javascript,
      ],
      skills: [
        DeveloperEngineerSkills.JavaScript,
        DeveloperEngineerSkills.Typescript,
        DeveloperEngineerSkills.React,
        DeveloperEngineerSkills.NodeJS,
      ],
      experience: [Experience.MidLevel, Experience.SeniorLevel],
      industry: [],
      companySize: { min: 50, max: 600 },
    })

    await driver.sleep(10000)
  } finally {
    await driver.sleep(10000)
    await driver.quit()
  }
}

main()
