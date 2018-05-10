const { DateTime } = require('luxon');

module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy('img');
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('js');

  eleventyConfig.addCollection('experiments', function(collection) {
    return collection.getAll().reverse().filter(function(item) {
      // console.log('status' in item.data);
      if ('status' in item.data == true) {
        return item.data
      }
    });
  });

  eleventyConfig.addCollection('hillsongtech', function(collection) {
    return collection.getFilteredByGlob('hillsongtech/*/**.*').reverse();
  });

  return {
    templateFormats: [
      'md',
      'njk',
      'html'
    ],

    pathPrefix: '/',

    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    passthroughFileCopy: true,
    dir: {
      input: '.',
      includes: '_includes',
      data: '_data',
      output: '_site'
    }
  };
};
