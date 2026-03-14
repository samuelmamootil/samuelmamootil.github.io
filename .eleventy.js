import rss from "@11ty/eleventy-plugin-rss";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(rss);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/resume.pdf": "resume.pdf" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/favicon-32x32.png": "favicon-32x32.png" });
  eleventyConfig.addPassthroughCopy({ "src/favicon-16x16.png": "favicon-16x16.png" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/llms.txt": "llms.txt" });
  eleventyConfig.addPassthroughCopy({ "src/humans.txt": "humans.txt" });
  eleventyConfig.addPassthroughCopy({ "src/googlefc31aa7984365772.html": "googlefc31aa7984365772.html" });
  eleventyConfig.addPassthroughCopy({ "src/BingSiteAuth.xml": "BingSiteAuth.xml" });
  eleventyConfig.addPassthroughCopy({ "src/a1b2c3d4e1b2c3d4e1b2c3d4e1b2c3d4.txt": "a1b2c3d4e1b2c3d4e1b2c3d4e1b2c3d4.txt" });
  eleventyConfig.addWatchTarget("src/assets/css/");

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/writing/*.md").reverse()
  );

  // Maps post tags → a relevant Unsplash image URL (800×420, deterministic)
  eleventyConfig.addFilter("postImage", (tags = []) => {
    const map = {
      "migration":   "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=420&fit=crop",
      "azure":       "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=420&fit=crop",
      "aws":         "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&h=420&fit=crop",
      "gcp":         "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=420&fit=crop",
      "security":    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=420&fit=crop",
      "iam":         "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=420&fit=crop",
      "terraform":   "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=420&fit=crop",
      "devops":      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=420&fit=crop",
      "kubernetes":  "https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?w=800&h=420&fit=crop",
      "docker":      "https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?w=800&h=420&fit=crop",
      "mlops":       "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=420&fit=crop",
      "ai":          "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=420&fit=crop",
      "architecture":"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=420&fit=crop",
      "cloud":       "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=420&fit=crop",
    };
    const lower = (tags || []).map(t => t.toLowerCase());
    for (const key of Object.keys(map)) {
      if (lower.includes(key)) return map[key];
    }
    return "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=420&fit=crop";
  });

  eleventyConfig.addGlobalData("sheetWebhookUrl", () => process.env.SHEET_WEBHOOK_URL || "");

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
