let observer = null;
export const lazy = function(vDom, heap) {
  let isLazy = vDom.element?.getAttribute("lazy");

  if (isLazy === undefined || isLazy === null) return;
  let src = vDom.element.getAttribute("src");
  if (!src) return;
  vDom.element.setAttribute("_src", src);
  vDom.element.removeAttribute("src");
  if (!observer) {
    observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let imageSrc = entry.target.getAttribute("_src");
          if (imageSrc) {
            entry.target.setAttribute("src", imageSrc);
            entry.target.removeAttribute("_src");
          }
          observer.unobserve(vDom.element);
        }
      });
    });
  }
  observer.observe(vDom.element);
};
