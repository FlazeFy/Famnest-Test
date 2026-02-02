const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
        // baseUrl : 'https://famnest.leonardhors.com',
        // For Backend Apps
        baseUrl: 'http://localhost:5555/',
        // For Frontend Apps
        // baseUrl: 'http://localhost:3000/',
        specPattern : ["integrations"],
        supportFile: "supports/e2e.ts"    
    }
})