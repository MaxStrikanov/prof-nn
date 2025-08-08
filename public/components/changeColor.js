const changeColor = () => {
  const colorDots = document.querySelectorAll('.coloring__dot');
  const image = document.querySelector('.coloring__img');

  // Сопоставление цвета и номера изображения
  const colorToNumber = {
    red: 1,
    yellow: 2,
    green: 3,
    blue: 4,
    violet: 5,
    black: 6
  };

  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      // Удалить класс "selected" у всех
      colorDots.forEach(d => d.classList.remove('selected'));

      // Добавить "selected" к текущему
      dot.classList.add('selected');

      // Получить цвет из класса
      const classList = Array.from(dot.classList);
      const colorClass = classList.find(c => c.startsWith('coloring__dot--'));
      const color = colorClass.split('--')[1];

      // Получить номер и заменить изображение
      const number = colorToNumber[color];
      image.src = `/public/img/totem_13-${number}.avif`;
    });
  });
}

export default changeColor;