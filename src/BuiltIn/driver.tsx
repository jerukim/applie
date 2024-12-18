import {
  By,
  Key,
  until,
  WebElement,
  type ThenableWebDriver,
} from "selenium-webdriver"
import {
  CompanySize,
  companySizeRangeToInputId,
  CyberSecuritySkills,
  CyberSecuritySubCategory,
  DataAnalyticsSkills,
  DataAnalyticsSubCategory,
  DatePosted,
  DeveloperEngineerSkills,
  DeveloperEngineerSubCategory,
  Experience,
  Industry,
  JobCategory,
  OperationsSubCategory,
  SalesSubCategory,
  type BuiltInJobFilters,
} from "./filters"

type Job = {
  title: string
  company: string
  url: string
}

export class BuiltInDriver {
  private driver: ThenableWebDriver
  private url = {
    login: "https://accounts.builtin.com/Login",
    home: "https://builtin.com",
    jobs: "https://builtin.com/jobs",
  }
  private locator = {
    filterButton: By.className(`filter-button`),
    filterContainer: By.id(`allFiltersOffcanvas`),
    earlyApplicantSwitch: By.id(`earlyApplicantSwitch`),
    datePostedRadio: (datePosted: DatePosted) =>
      By.id(`postedDate-offcanvas-${datePosted}`),
    jobCategoryRadio: (jobCategory: JobCategory) =>
      By.id(`category-offcanvas-${jobCategory}`),
    jobSubCategoryCheckbox: (jobSubCategory: string) =>
      By.id(`subCategory-offcanvas-${jobSubCategory}`),
    skillsContainer: By.id(`skills-offcanvas`),
    skillsCheckbox: (skill: string) => By.id(`skills-offcanvas-${skill}`),
    experienceCheckbox: (experience: Experience) =>
      By.id(`experience-offcanvas-${experience}`),
    industryContainer: By.id(`industry-offcanvas`),
    industryCheckbox: (industry: Industry) =>
      By.id(`industry-offcanvas-${industry}`),
    companySizeCheckbox: (companySize: CompanySize) =>
      By.id(`companySize-offcanvas-${companySize}`),
    showMoreButton: By.xpath(`//div[contains(text(), "Show more")]`),
    applyButton: By.css(`.offcanvas-footer button[aria-label="Close"]`),
    jobsListTop: By.id("search-results-top"),
    jobsListBottom: By.id("search-results-bottom"),
    jobCard: By.css('div[id^="job-card-"]'),
  }

  constructor(driver: ThenableWebDriver) {
    this.driver = driver
  }

  public async login() {
    await this.driver.get(this.url.login)
    console.log("Login with email magic link to continue...")
    await this.driver.wait(until.urlContains(this.url.home), 500 * 60 * 5)
  }

  public async goToJobsPage() {
    await this.driver.get(this.url.jobs)
  }

  public async setJobFilters(filters: BuiltInJobFilters) {
    console.log("Setting job filters...")

    try {
      await this.driver
        .findElement(this.locator.filterButton)
        .sendKeys(Key.SPACE)
    } catch (error) {
      console.error('Could not find "Filter" button.', error)
      throw error
    }

    const filtersContainer = await this.driver.wait(
      until.elementLocated(this.locator.filterContainer)
    )

    await this.driver.sleep(500)

    if (filters.earlyApplicant) {
      try {
        await filtersContainer
          .findElement(this.locator.earlyApplicantSwitch)
          .sendKeys(Key.SPACE)
      } catch (error) {
        console.error(
          "Could not find `Early Applicant` input, check selector",
          error
        )
        throw error
      }
    }

    await this.driver.sleep(500)

    if (filters.datePosted) {
      try {
        await filtersContainer
          .findElement(this.locator.datePostedRadio(filters.datePosted))
          .sendKeys(Key.SPACE)
      } catch (error) {
        console.error(
          `Could not find "Date Posted" input with id ${filters.datePosted}, check selector`,
          error
        )
      }
    }

    await this.driver.sleep(500)

    if (filters.jobCategory) {
      try {
        await filtersContainer
          .findElement(this.locator.jobCategoryRadio(filters.jobCategory))
          .sendKeys(Key.SPACE)
      } catch (error) {
        console.error(
          `Could not find "Job Category" input with id ${filters.jobCategory}, check selector`,
          error
        )
      }
    }

    await this.driver.sleep(500)

    if (
      filters.jobCategory &&
      filters.jobSubCategory &&
      filters.jobSubCategory.length
    ) {
      const subcategories = Array.from(new Set(filters.jobSubCategory)).filter(
        (subcategory) => {
          switch (filters.jobCategory) {
            case JobCategory.CybersecurityIT:
              return subcategory in CyberSecuritySubCategory
            case JobCategory.DataAnalytics:
              return subcategory in DataAnalyticsSubCategory
            case JobCategory.DeveloperEngineer:
              return subcategory in DeveloperEngineerSubCategory
            case JobCategory.Operations:
              return subcategory in OperationsSubCategory
            case JobCategory.Sales:
              return subcategory in SalesSubCategory
          }
        }
      )

      try {
        if (subcategories.length) {
          await this.driver.wait(until.elementsLocated(By.className("ps-lg")))
        }
      } catch (error) {
        console.error(`Could not find "Job Subcategories"`, error)
      }

      for (const subcategory of subcategories) {
        try {
          await filtersContainer
            .findElement(this.locator.jobSubCategoryCheckbox(subcategory))
            .sendKeys(Key.SPACE)
        } catch (error) {
          console.error(
            `Could not find "Job Subcategory" input with id ${subcategory}, check selector`,
            error
          )
        }
      }
    }

    await this.driver.sleep(500)

    if (filters.skills && filters.skills.length) {
      const skills = Array.from(new Set(filters.skills)).filter((skill) => {
        switch (filters.jobCategory) {
          case JobCategory.CybersecurityIT:
            return skill in CyberSecuritySkills
          case JobCategory.DataAnalytics:
            return skill in DataAnalyticsSkills
          case JobCategory.DeveloperEngineer:
            return skill in DeveloperEngineerSkills
        }
      })

      if (skills.length) {
        try {
          await this.driver.wait(
            until.elementLocated(this.locator.skillsContainer)
          )
        } catch (error) {
          console.error(`Could not find "Skills" container.`, error)
        }
      }

      for (const skill of skills) {
        try {
          await filtersContainer
            .findElement(this.locator.skillsCheckbox(skill))
            .sendKeys(Key.SPACE)
        } catch (error) {
          console.error(
            `Could not find "Skills" input with id ${skill}.`,
            error
          )
        }
      }
    }

    await this.driver.sleep(500)

    if (filters.experience) {
      for (const level of new Set(filters.experience)) {
        try {
          filtersContainer
            .findElement(this.locator.experienceCheckbox(level))
            .sendKeys(Key.SPACE)
        } catch (error) {
          console.error(
            `Could not find "Experience" input with id ${level}.`,
            error
          )
          throw error
        }
      }
    }

    await this.driver.sleep(500)

    if (filters.companySize) {
      for (const companySize of companySizeRangeToInputId(
        filters.companySize
      )) {
        try {
          await filtersContainer
            .findElement(this.locator.companySizeCheckbox(companySize))
            .sendKeys(Key.SPACE)
        } catch (error) {
          console.error(
            `Could not find "Company Size" input with id ${companySize}.`,
            error
          )
        }
      }
    }

    await this.driver.sleep(500)

    if (filters.industry && filters.industry.length) {
      const container = filtersContainer.findElement(
        this.locator.industryContainer
      )

      try {
        await container.findElement(this.locator.showMoreButton).click()

        await this.driver.sleep(500)
      } catch (error) {
        console.error(`Could not find "Show more" button.`, error)
      }

      for (const industry of filters.industry) {
        try {
          await filtersContainer
            .findElement(this.locator.industryCheckbox(industry))
            .sendKeys(Key.SPACE)
        } catch (error) {
          console.error(
            `Could not find "Industry" input with id ${industry}.`,
            error
          )
        }
      }
    }

    try {
      await filtersContainer.findElement(this.locator.applyButton).click()
    } catch (error) {
      console.error('Could not find "Apply" button.', error)
    }

    await this.driver.wait(until.elementIsNotVisible(filtersContainer))
  }

  public async getJobsOnPage() {
    return [
      ...(await this.parseJobCards(
        await this.driver
          .findElement(this.locator.jobsListTop)
          .findElements(this.locator.jobCard)
      )),
      ...(await this.parseJobCards(
        await this.driver
          .findElement(this.locator.jobsListBottom)
          .findElements(this.locator.jobCard)
      )),
    ]
  }

  private async parseJobCards(jobCards: WebElement[]) {
    return await Promise.all(
      jobCards.map(async (jobCard) => {
        const company = await jobCard.findElement(
          By.css('a[href^="/company/"] span')
        )
        const title = await jobCard.findElement(By.css("h2 a[href^='/job/']"))

        return {
          company: await company.getText(),
          title: await title.getText(),
          url: await title.getAttribute("href"),
        } as Job
      })
    )
  }

  public async applyToJobs(jobs: Job[]) {
    // iterate over jobs
    // determine correct driver needed to apply to job by parsing url
    // open job in new tab if driver exists
    // autofill form fields and submit
    // on success company name to avoid applying again
  }
}
