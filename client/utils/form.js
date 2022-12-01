function scrollToErrorElement(errors) {
  const keys = Object.keys(errors);
  if (keys.length > 0) {
    const selector = `[id=${keys[0]}]`;
    const errorElement = document.querySelector(selector);
    if (errorElement) {
      window.scrollTo({
        top:
          errorElement.getBoundingClientRect().top +
          window.scrollY -
          window.innerHeight / 2 +
          100,
        behavior: 'smooth',
      });

      setTimeout(() => {
        errorElement.focus();
      }, 300);
    }
  }
}

export { scrollToErrorElement };
