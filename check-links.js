const blc = require('broken-link-checker');
const chalk = require('chalk');
const success = chalk.green;
const error = chalk.red;

const siteUrl = process.env.MP_URL || 'https://nearme-example.staging-oregon.near-me.com';

const options = {
  filterLevel: 0,
  honorRobotExclusions: false,
  // rateLimit: 100, // default: 0
  excludedKeywords: ['*api-reference/*', 'localhost'], // there is too much noise in there
  maxSockets: 20,
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36 OPR/56.0.3051.116'
};

const customData = {
  failed: [],
  succeeded: []
};

const siteChecker = new blc.SiteChecker(options, {
  link: function(result, customData) {
    if (result.broken) {
      console.log(
        error(
          `[BROKEN] Link: ${result.url.resolved} \
          \n\t Page: ${result.base.resolved} \
          \n\t Reason: ${blc[result.brokenReason]}`
        )
      );
      customData.failed.push(result);
    } else {
      customData.succeeded.push(result);
    }
  },
  end: function() {
    console.log('');
    if (customData.failed.length === 0) {
      console.log(success(`All links are working correctly at ${siteUrl}`));
      process.exit(0);
    } else {
      console.log(success(`Correct: ${customData.succeeded.length}`));
      console.log(error(`Broken: ${customData.failed.length}`));

      process.exit(1);
    }
  }
});

siteChecker.enqueue(siteUrl, customData);
