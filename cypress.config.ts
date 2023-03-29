import { defineConfig } from 'cypress'
import dotenvPlugin from 'cypress-dotenv'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    experimentalRunAllSpecs: true,
    setupNodeEvents: (on, config) => {
      config = dotenvPlugin(config)
      return config
    }
  }
})
