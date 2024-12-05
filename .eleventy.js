const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
  // Add a date formatter filter to Nunjucks
  eleventyConfig.addFilter("dateDisplay", require("./filters/dates.js"));
  eleventyConfig.addFilter("timestamp", require("./filters/timestamp.js"));
  eleventyConfig.addFilter("squash", require("./filters/squash.js"));

  eleventyConfig.addPassthroughCopy("css");

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addCollection("experiments", function (collection) {
    return collection
      .getAllSorted()
      .reverse()
      .filter(function (item) {
        if ("status" in item.data == true) {
          return item.data;
        }
      });
  });

  return {
    dir: {
      input: "src/site",
      output: "dist",
      includes: "_includes",
    },
    templateFormats: [
      "njk",
      "md",
      "png",
      "ico",
      "pdf",
      "css",
      "js",
      "wav",
      "mp3",
      "gltf",
      "glb",
      "json",
    ],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
