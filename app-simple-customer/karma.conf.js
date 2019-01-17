// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

// Controls which Chrome version will be used for testing
// https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#environment-variables
// https://github.com/karma-runner/karma-chrome-launcher#headless-chromium-with-puppeteer
// process.env.CHROME_BIN = process.env.CHROME_BIN || require('puppeteer').executablePath();

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true,
      thresholds: {
        global: {
          statements: 80,
          lines: 80,
          branches: 80,
          functions: 80,
        },
      }
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [process.env.JENKINS_HOME ? 'PhantomJS': 'ChromeHeadless'],
    singleRun: false
  });
};
