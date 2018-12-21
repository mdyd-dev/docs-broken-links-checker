const blc = require('broken-link-checker');
const chalk = require('chalk');
const success = chalk.green;
const error = chalk.red;

const siteUrl = process.env.MP_URL || 'https://nearme-example.staging-oregon.near-me.com';

const options = {
  filterLevel: 0,
  honorRobotExclusions: false,
  rateLimit: 100,
  exclude: 'localhost',
  maxSockets: 5
};

const customData = {
  failed: [],
  succeeded: []
};

const report = ({ failed, succeeded }) => {
  if (failed.length === 0) {
    console.log(success(`All links are working correctly at ${siteUrl}`));
    process.exit(0);
  } else {
    console.log(success(`Number of correctly working links: ${succeeded.length}`));

    console.log(error(`Broken links (${failed.length}):`));

    failed.forEach(fail => {
      console.log(error(`\t${blc[fail.brokenReason]} :: ${fail.url.resolved}`));
    });

    process.exit(1);
  }
};

const siteChecker = new blc.SiteChecker(options, {
  link: function(result, customData) {
    if (result.broken) {
      customData.failed.push(result);
    } else {
      customData.succeeded.push(result);
    }
  },
  end: function() {
    report(customData);
  }
});

siteChecker.enqueue(siteUrl, customData);
