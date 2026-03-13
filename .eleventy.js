import rss from "@11ty/eleventy-plugin-rss";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(rss);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/resume.pdf": "resume.pdf" });
  eleventyConfig.addWatchTarget("src/assets/css/");

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/writing/*.md").reverse()
  );

  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  );
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString());

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
}
