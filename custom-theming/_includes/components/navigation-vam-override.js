const truncate = require('~lib/truncate');
const { html } = require('~lib/common-tags');

/**
 * This controls the various navigation elements (nav, skip-link, menu and
 * search icons, and search results if enabled). It is visible on all pages.
 *
 * A note that while Hugo includes .Next and .Prev variables that can be used
 * to connect to the next and previous pages in the linear order of the site,
 * Quire makes available the option of hiding pages from the linear order in the
 * book in order to have custom pages in other formats (PDF, EPUB, etc.).
 * Because of this, the .Next and .Prev variables are not used here, and instead
 * eligible pages are ranged through and based on weight, the next or previous
 * one in the range is linked to.
 */
module.exports = function (eleventyConfig) {
  const eleventyNavigation = eleventyConfig.getFilter('eleventyNavigation');
  const pageTitle = eleventyConfig.getFilter('pageTitle');
  const { imageDir } = eleventyConfig.globalData.config.figures;

  return function (params) {
    const { collections, pagination, title } = params;
    const {
      currentPage,
      currentPageIndex,
      nextPage,
      percentProgress,
      previousPage,
    } = pagination;

    if (!currentPage) return;

    const home = '/';
    const isHomePage = currentPage.url === home;

    const navBarLabel = ({ label, short_title, title }) => {
      return pageTitle({ label, title: short_title || truncate(title, 34) });
    };

    const navBarStartButton = () => {
      if (!isHomePage) return '';
      const secondPageLink = collections.navigation[1].url;
      return `
        <li class="quire-navbar-page-controls__item quire-home-page">
          <a href="${secondPageLink}" rel="next">
            <span class="visually-hidden">Next Page: </span>
            <span class="quire-navbar-button play-button">
              <svg data-outputs-exclude="epub,pdf">
                <switch>
                  <use xlink:href="#start-icon"></use>
                </switch>
              </svg>
            </span>
          </a>
        </li>
      `;
    };

    const navBarPreviousButton = () => {
      if (!previousPage) return '';
      const { data, url } = previousPage;
      const { label, short_title, title } = data;
      return html`
        <li class="quire-navbar-page-controls__item quire-previous-page">
          <a href="${url}" rel="previous">
            <span class="visually-hidden">Previous Page: </span>
            <svg class="left-icon" data-outputs-exclude="epub,pdf">
              <switch>
                <use xlink:href="#left-arrow-icon"></use>
              </switch>
            </svg>
            ${navBarLabel({ label, short_title, title })}
          </a>
        </li>
      `;
    };

    const navBarHomeButton = () => {
      if (!previousPage) return '';
      return html`
        <li class="quire-navbar-page-controls__item quire-home-page">
          <a href="${home}" rel="home">
            <span class="visually-hidden">Home Page: </span>
            <span class="quire-navbar-button home-button">
              <svg data-outputs-exclude="epub,pdf">
                <switch>
                  <use xlink:href="#home-icon"></use>
                </switch>
              </svg>
            </span>
          </a>
        </li>
      `;
    };

    const navBarNextButton = () => {
      if (isHomePage || !nextPage) return '';
      const { data, url } = nextPage;
      const { label, short_title, title } = data;
      return html`
        <li class="quire-navbar-page-controls__item quire-next-page">
          <a href="${url}" rel="next">
            <span class="visually-hidden">Next Page: </span>
            ${navBarLabel({ label, short_title, title })}
            <svg data-outputs-exclude="epub,pdf">
              <switch>
                <use xlink:href="#right-arrow-icon"></use>
              </switch>
            </svg>
          </a>
        </li>
      `;
    };

    return html`
      <div class="quire-navbar">
        <nav class="quire-navbar-controls" aria-label="full">
          <a href="#main" class="quire-navbar-skip-link" tabindex="0">
            Skip to Main Content
          </a>
          <div class="quire-navbar-controls__left">
            <button
              class="quire-navbar-button menu-button"
              id="quire-controls-menu-button"
              onclick="toggleMenu()"
              aria-expanded="true"
              aria-controls="site-menu"
              tabindex="0"
            >
              <svg
                class="quire-navbar-button__open"
                width="16"
                height="13"
                viewBox="0 0 16 13"
                fill="none"
                data-outputs-exclude="epub,pdf"
              >
                <path
                  d="M15.0498 12.0169H0.94104C0.59608 12.0169 0.31543 11.7739 0.31543 11.4752C0.31543 11.2046 0.547492 10.9752 0.856553 10.9388L0.948823 10.9342H15.0584C15.4034 10.9342 15.684 11.1769 15.684 11.4752C15.684 11.7466 15.4517 11.9762 15.1424 12.0118L15.0498 12.0169ZM15.0498 6.87426H0.94104C0.59608 6.87426 0.31543 6.6313 0.31543 6.33265C0.31543 6.06174 0.547878 5.83219 0.857338 5.79608L0.949669 5.79104H15.0584C15.4034 5.79104 15.684 6.034 15.684 6.33265C15.684 6.60355 15.4516 6.83311 15.1421 6.86921L15.0498 6.87426ZM15.0507 1.73106H0.94104C0.59608 1.73106 0.31543 1.48836 0.31543 1.19005C0.31543 0.918694 0.54778 0.689126 0.857109 0.653495L0.949669 0.648438H15.0584C15.4034 0.648438 15.684 0.891397 15.684 1.19005C15.684 1.46072 15.452 1.69011 15.1429 1.72652L15.0507 1.73106Z"
                  fill="white"
                />
                <path
                  d="M15.0415 11.7014L15.1145 11.6974C15.2557 11.678 15.3686 11.5804 15.3686 11.4756C15.3686 11.3556 15.2238 11.2504 15.0588 11.2504H0.956967L0.884828 11.2539C0.743985 11.2741 0.63158 11.3714 0.63158 11.4756C0.63158 11.5959 0.77636 11.7014 0.9414 11.7014H15.0415ZM15.0415 6.55883L15.1141 6.55486C15.2555 6.5351 15.3686 6.43751 15.3686 6.33301C15.3686 6.21271 15.2238 6.10719 15.0588 6.10719H0.958658L0.886137 6.11115C0.744683 6.13092 0.63158 6.22851 0.63158 6.33301C0.63158 6.45331 0.77636 6.55883 0.9414 6.55883H15.0415ZM15.0432 1.41563L15.1154 1.41208C15.2562 1.3919 15.3686 1.29458 15.3686 1.19041C15.3686 1.07011 15.2238 0.964588 15.0588 0.964588H0.958658L0.885714 0.968574C0.744523 0.988006 0.63158 1.08564 0.63158 1.19041C0.63158 1.31039 0.77636 1.41563 0.9414 1.41563H15.0432ZM15.0588 12.333H0.9414C0.4212 12.333 0 11.949 0 11.4756C0 11.0364 0.3636 10.674 0.8316 10.6242L0.9414 10.6188H15.0588C15.5784 10.6188 16.0002 11.0022 16.0002 11.4756C16.0002 11.9154 15.6366 12.2778 15.1686 12.327L15.0588 12.333ZM15.0588 7.19041H0.9414C0.4212 7.19041 0 6.80641 0 6.33301C0 5.89321 0.3636 5.53141 0.8316 5.48161L0.9414 5.47561H15.0588C15.5784 5.47561 16.0002 5.85961 16.0002 6.33301C16.0002 6.77281 15.6366 7.13461 15.1686 7.18441L15.0588 7.19041ZM15.0588 2.04721H0.9414C0.4212 2.04721 0 1.66381 0 1.19041C0 0.750608 0.3636 0.388208 0.8316 0.339008L0.9414 0.333008H15.0588C15.5784 0.333008 16.0002 0.717008 16.0002 1.19041C16.0002 1.62961 15.6366 1.99201 15.1686 2.04181L15.0588 2.04721Z"
                  fill="white"
                />
              </svg>
              <svg
                class="quire-navbar-button__close"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.11665 7.99956L2.5586 12.5577L3.44249 13.4415L8.00054 8.88345L12.5586 13.4415L13.4425 12.5577L8.88441 7.99956L13.4425 3.4415L12.5587 2.55762L8.00054 7.11568L3.44248 2.55762L2.55859 3.4415L7.11665 7.99956Z"
                  fill="white"
                />
              </svg>
              <span class="visually-hidden">Table of Contents</span>
            </button>

            <button
              class="quire-navbar-button search-button"
              id="search-open"
              aria-expanded="false"
              aria-controls="js-search"
              onclick="toggleSearch()"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                data-outputs-exclude="epub,pdf"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15 8.5C15 12.0899 12.0899 15 8.5 15C4.91015 15 2 12.0899 2 8.5C2 4.91015 4.91015 2 8.5 2C12.0899 2 15 4.91015 15 8.5ZM17 8.5C17 13.1944 13.1944 17 8.5 17C3.80558 17 0 13.1944 0 8.5C0 3.80558 3.80558 0 8.5 0C13.1944 0 17 3.80558 17 8.5ZM14.4733 15.8876L19.2511 20.6654L20.4633 19.0491L15.8875 14.4734C15.467 14.9928 14.9928 15.4671 14.4733 15.8876Z"
                  fill="white"
                />
              </svg>
              <span class="visually-hidden">Search</span>
            </button>

            <a href="https://research.vam.ac.uk/" target="_blank" class="quire-navbar__title has-h5-font-size"
              >Research Institute</a
            >
          </div>
          <nav class="quire-navbar-controls__center" aria-label="quick">
            <ul
              class="quire-navbar-page-controls"
            >
              ${navBarStartButton()} ${navBarPreviousButton()}
              ${navBarNextButton()}
            </ul>
          </nav>
          <div class="quire-navbar-controls__right">
            <a class="quire-navbar-logo-link" href="https://www.vam.ac.uk/" target="_blank" aria-label="Home">
              <svg
                class="quire-navbar-logo"
                xmlns="http://www.w3.org/2000/svg"
                width="155"
                height="91"
                fill="currentColor"
                viewBox="0 0 155 91"
              >
                <path
                  d="M71.64 90.001c-6.13 0-11.253-1.739-14.815-5.029A15.529 15.529 0 0 1 53 79.502a17.718 17.718 0 0 1 2.616-17.763 25.578 25.578 0 0 1 9.257-7.127c1.678-.77 3.063-1.356 4.118-1.738 0 0-.018-.025-.046-.07a115.254 115.254 0 0 1-1.951-3.12c-3.676-6.124-4.187-13.072-1.3-17.7a13.9 13.9 0 0 1 6.243-5.353 20.123 20.123 0 0 1 18.54 1.425 10.199 10.199 0 0 1 3.048 3.068 7.882 7.882 0 0 1 1.2 4.215c0 5.07-3.85 8.373-7.08 10.252-2.828 1.646-7.05 3.867-7.091 3.89l15.83 25.133a38.641 38.641 0 0 0 3.837-7.756 36.1 36.1 0 0 0 1.941-7.413c.268-2.024.338-3.315-.945-4.179-.741-.5-1.882-.745-3.937-.853a6.028 6.028 0 0 1-.91-.11.661.661 0 0 1 .14-1.314h14.369a.598.598 0 0 1 .618.564.653.653 0 0 1-.445.727 7.678 7.678 0 0 1-1.3.186 5.057 5.057 0 0 0-3.823 1.75c-.737.87-1.241 2.966-1.574 4.354l-.02.084a47.495 47.495 0 0 1-6.907 15.617l1.178 1.87 1.387 2.2c1.572 2.48 3.958 5.434 6.4 5.434a3.058 3.058 0 0 0 3.135-1.82c.449-1.076.835-1.514 1.332-1.514.111.001.221.02.327.055a.726.726 0 0 1 .451.4 1.084 1.084 0 0 1 0 .848 9.216 9.216 0 0 1-3.771 3.86 13.652 13.652 0 0 1-6.983 1.911 16.956 16.956 0 0 1-7.21-1.465 11.743 11.743 0 0 1-4.551-3.662 29.245 29.245 0 0 1-17.483 5.613Zm-1.748-35.8a14.611 14.611 0 0 0-5.5 6.44 17.619 17.619 0 0 0-1.423 7.018 18.58 18.58 0 0 0 4.948 12.3 17.734 17.734 0 0 0 5.425 4.078 15.402 15.402 0 0 0 6.718 1.55 14.733 14.733 0 0 0 8.144-2.73c-3.64-5.67-5.186-8.093-8.922-13.946l-.011-.017c-2.09-3.273-4.95-7.756-9.33-14.612l-.022-.036-.014-.022-.017-.026.004.003Zm8.93-27.47c-2.326 0-3.907.724-4.972 2.278a7.383 7.383 0 0 0-.953 5.417c.317 1.862.934 3.66 1.825 5.325 1.773 3.383 4.884 8.266 4.915 8.315a13.654 13.654 0 0 0 5.87-11.288c.152-2.75-.629-5.47-2.215-7.722a5.828 5.828 0 0 0-4.47-2.325ZM36.85 89.756a.413.413 0 0 1-.4-.28c-.04-.119-6.528-19.882-12.8-38.994l-.51-1.552C17.427 31.528 10.318 9.872 10.008 8.92 9.7 7.985 8.525 4.856 6.32 3.79a9.892 9.892 0 0 0-4.113-.817 8.092 8.092 0 0 1-1.866-.245.574.574 0 0 1-.334-.62.66.66 0 0 1 .672-.633h33.146c.5 0 .784.091.88.573a.773.773 0 0 1-.117.623.611.611 0 0 1-.45.241c-.411.036-.608.052-1.038.082-3.23.225-4.47.78-5.1 2.28-.324.77-.14 2.162.6 4.512l10.658 33.94.04.13c2.99 9.524 5.816 18.521 5.915 18.834h.08c.186-.482 19.817-51.478 20.555-53.5.887-2.426 1.023-3.886.44-4.735-.716-1.047-1.7-1.294-4.113-1.466l-.577-.04c-.771-.054-1.436-.1-1.758-.143-.427-.058-.643-.28-.643-.66 0-.554.472-.67.867-.67l17.21.006a.641.641 0 0 1 .638.672.662.662 0 0 1-.713.657c-2.784.152-4.223.45-5.311 1.1a5.87 5.87 0 0 0-2.105 2.9c-.242.6-9.154 23.254-17.772 45.164l-.022.056a54183.49 54183.49 0 0 1-14.733 37.451.437.437 0 0 1-.407.274Zm117.367-.49h-36.472a.658.658 0 0 1-.707-.667.699.699 0 0 1 .58-.737c.34-.05.683-.087 1.147-.126a14.088 14.088 0 0 0 3.94-.77 3.177 3.177 0 0 0 1.82-2.728 10.468 10.468 0 0 0-.706-2.9l-20.422-56.843c.07-.21 7.847-23.53 8.013-24.039.093-.285.274-.456.484-.456.21 0 .386.163.489.436.2.54 30.267 79.363 30.55 80.1 2.316 6.071 6.155 6.876 9.888 7.18.707.058 1.195.11 1.349.135a.711.711 0 0 1 .648.5c.029.093.039.19.029.287a.663.663 0 0 1-.63.628Z"
                ></path>
              </svg>
            </a>
          </div>
        </nav>
        <div class="quire-progress-bar">
          <div style="width: ${percentProgress}%;">
            <span
              >${currentPageIndex + 1}/${collections.navigation.length}</span
            >
          </div>
        </div>
      </div>
    `;
  };
};
