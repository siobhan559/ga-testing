const { html } = require('~lib/common-tags');

/**
 * Menu
 *
 * This controls the global table of contents for the publication, which is
 * available on all pages. For users with Javascript enabled, this menu is hidden
 * by default. Users with JS disabled will alwasy see the menu in its expanded state.
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  params
 */
module.exports = function (eleventyConfig) {
  const citation = eleventyConfig.getFilter('citation');
  const copyright = eleventyConfig.getFilter('copyright');
  const eleventyNavigation = eleventyConfig.getFilter('eleventyNavigation');
  const linkList = eleventyConfig.getFilter('linkList');
  const menuHeader = eleventyConfig.getFilter('menuHeader');
  const menuList = eleventyConfig.getFilter('menuList');
  const menuResources = eleventyConfig.getFilter('menuResources');

  const { resource_link: resourceLinks } =
    eleventyConfig.globalData.publication;

  return function (params) {
    const { collections, pageData } = params;

    if (!pageData) return;

    const footerLinks = resourceLinks.filter(
      ({ type }) => type === 'footer-link'
    );

    return html`
      <div class="quire-menu menu" id="site-menu__inner">
        ${menuHeader({ currentURL: pageData.url })}
        <nav
          id="nav"
          class="quire-menu__list menu-list"
          aria-label="contents menu"
        >
          <h3 class="visually-hidden">Table of Contents</h3>
          <button class="quire-menu__search" onclick="toggleSearch()">
            Search
            <svg data-outputs-exclude="epub,pdf">
              <switch><use xlink:href="#search-icon"></use></switch>
            </svg>
          </button>
          ${menuList({
            currentURL: pageData.url,
            navigation: eleventyNavigation(collections.menu),
          })}
        </nav>

        ${menuResources()}

        <div class="quire-menu__formats">
          <p>Cite this Page</p>
          <div class="cite-this">
            <span class="cite-this__heading"> Chicago </span>
            <span class="cite-this__text">
              ${citation({ context: 'page', page: pageData, type: 'chicago' })}
            </span>
          </div>

          <div class="cite-this">
            <span class="cite-this__heading"> MLA </span>
            <span class="cite-this__text">
              ${citation({ context: 'page', page: pageData, type: 'mla' })}
            </span>
          </div>
        </div>

        <div class="quire-menu__footer">
          ${copyright()}
          ${linkList({ links: footerLinks, classes: ['menu-list'] })}
        </div>
      </div>
    `;
  };
};
