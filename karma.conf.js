// Karma configuration
// Generated on %DATE%

module.exports = function(config) {
  config.set({
    files: [
      'components/angular/angular.js',
      'components/angular-mocks/angular-mocks.js',
      'src/**/*.js',
      'test/**/*.js'
    ],

    basePath: '',
    frameworks: ['jasmine'],
    exclude: [],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    reporters: ['progress'],
    browsers: ['PhantomJS2'],
    autoWatch: true,
    singleRun: false,
    captureTimeout: 60000
  });
};
