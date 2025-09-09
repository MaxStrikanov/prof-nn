const accordion = () => {

document.addEventListener('DOMContentLoaded', function() {
  const accordionItems = document.querySelectorAll('.questions__item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.questions__item_header');
    const content = item.querySelector('.questions__item_content');

    header.addEventListener('click', () => {
      const opening = !item.classList.contains('active');

      // Close all others
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          const otherContent = otherItem.querySelector('.questions__item_content');
          otherContent.style.maxHeight = otherContent.scrollHeight + 'px';
          void otherContent.offsetHeight;
          otherItem.classList.remove('active');
          otherContent.style.maxHeight = '0';
        }
      });

      if (opening) {
        item.classList.add('active');
        void content.offsetHeight;
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        void content.offsetHeight;
        item.classList.remove('active');
        content.style.maxHeight = '0';
      }
    });
  });
});

}

export default accordion;