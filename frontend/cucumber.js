export default {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/steps/*.js'],
    paths: ['../features/room/usageScenarios.feature'],
    format: ['@cucumber/pretty-formatter'],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true,
    parallel: 1,
    retry: 1,
    timeout: 70000,
    worldParameters: {
      baseUrl: 'http://localhost:5173'
    }
  }
}; 