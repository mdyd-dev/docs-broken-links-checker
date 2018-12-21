const blc = require('broken-link-checker');
const chalk = require('chalk');
const success = chalk.green;
const error = chalk.red;

const siteUrl = process.env.MP_URL || 'https://nearme-example.staging-oregon.near-me.com';

const options = {
  filterLevel: 0,
  honorRobotExclusions: false,
  rateLimit: 100,
  excludedKeywords: ['*api-reference/graphql/g*'], // there is too much noise in there
  maxSockets: 5
};

const customData = {
  failed: [],
  succeeded: [],
  index: 1
};

const siteChecker = new blc.SiteChecker(options, {
  link: function(result, customData) {
    if (result.broken) {
      customData.failed.push(result);
    } else {
      customData.succeeded.push(result);
    }

    const isOK = result.broken ? error('[BROKEN]') : success('[OK]');

    console.log(`[${customData.index}]\t ${isOK} ${result.url.resolved}`);
    customData.index = customData.index + 1;
  },
  end: function() {
    if (customData.failed.length === 0) {
      console.log(success(`All links are working correctly at ${siteUrl}`));
      process.exit(0);
    } else {
      console.log(success(`Number of correctly working links: ${customData.succeeded.length}`));

      console.log(error(`Broken links (${customData.failed.length}):`));

      customData.failed.forEach(fail => {
        console.log(error(`\t${blc[fail.brokenReason]} :: ${fail.url.resolved}`));
      });

      console.log(`Checked links in total: ${customData.index}`);

      process.exit(1);
    }
  }
});

siteChecker.enqueue(siteUrl, customData);
