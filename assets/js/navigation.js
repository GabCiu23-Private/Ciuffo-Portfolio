function initNavigation() {
  const page = document.body.dataset.page || "";
  const navLinks = document.querySelectorAll(".site-nav a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) {
      return;
    }

    const linkPath = new URL(href, window.location.href).pathname;
    const currentPath = window.location.pathname;
    const isProjectPage = page.startsWith("project");
    const isWorkLink = linkPath.endsWith("/pages/work.html");

    if (linkPath === currentPath || (isProjectPage && isWorkLink)) {
      link.classList.add("is-active");
    }
  });
}

window.CiuffoNavigation = {
  initNavigation,
};
