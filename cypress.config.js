import { defineConfig } from 'cypress'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  e2e: {
    baseUrl: 'http://invoiceshelf.test',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    downloadsFolder: 'cypress/downloads',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    env: {
      coverage: false
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        },
        downloadExists(filename) {
          const downloadPath = path.join(config.downloadsFolder, filename)
          return fs.existsSync(downloadPath)
        },
        clearDownloads() {
          const downloadPath = config.downloadsFolder
          
          try {
            if (fs.existsSync(downloadPath)) {
              const files = fs.readdirSync(downloadPath)
              files.forEach(file => {
                const filePath = path.join(downloadPath, file)
                if (fs.statSync(filePath).isFile()) {
                  fs.unlinkSync(filePath)
                }
              })
            }
            return null
          } catch (error) {
            console.log('Error clearing downloads:', error.message)
            return null
          }
        }
      })
    },
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
}) 