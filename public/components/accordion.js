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

const changeImg = () => {
  // Массив путей к картинкам
const images = [
  '/public/img/q1.avif',
  '/public/img/q2.avif',
  '/public/img/q3.avif',
  '/public/img/q4.avif',
  '/public/img/q5.avif',
  '/public/img/q6.avif'
]

const items = document.querySelectorAll('.questions__item')
const imgBlock = document.querySelector('.questions__img')

items.forEach((item, index) => {
  item.addEventListener('click', () => {
    imgBlock.classList.add('fade')

    setTimeout(() => {
      imgBlock.style.backgroundImage = `url(${images[index]})`
      imgBlock.classList.remove('fade')
    }, 300)
  })
})
}

export {changeImg, accordion};