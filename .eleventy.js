module.exports = function (config) {


  // Add a date formatter filter to Nunjucks
  config.addFilter("dateDisplay", require("./filters/dates.js"));
  config.addFilter("timestamp", require("./filters/timestamp.js"));
  config.addFilter("squash", require("./filters/squash.js"));


  config.addPassthroughCopy('img');
  config.addPassthroughCopy('css');
  config.addPassthroughCopy('js');

  config.addCollection('experiments', function (collection) {
    return collection.getAll().reverse().filter(function (item) {
      // console.log('status' in item.data);
      if ('status' in item.data == true) {
        return item.data
      }
    });
  });

  return {
    dir: {
      input: "src/site",
      output: "dist",
      includes: "_includes"
    },
    templateFormats: ["njk", "md", "png", "ico", "pdf"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
  };

};
