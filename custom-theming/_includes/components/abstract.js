const { html } = require('~lib/common-tags');

/**
 * Publication abstract
 * @param      {Object}  eleventyConfig
 */
module.exports = function (eleventyConfig) {
  const markdownify = eleventyConfig.getFilter('markdownify');
  return function (params) {
    const { abstract } = params;
    return html`
      <section class="section quire-page__abstract">
        <div class="container">
          <div class="content">
            <div class="content__inner">${markdownify(abstract)}</div>
          </div>
        </div>
      </section>
    `;
  };
};
