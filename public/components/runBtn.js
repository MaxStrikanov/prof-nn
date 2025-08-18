const runBtn = () => {
  document.querySelectorAll('.marquee').forEach(marquee => {
  const track = marquee.querySelector('.marquee__track');

  // клон для бесшовной прокрутки
  const clone = track.cloneNode(true);
  clone.classList.add('is-clone');
  clone.setAttribute('aria-hidden', 'true');
  marquee.appendChild(clone);

  let width = 0;
  let offset = 0;
  let rafId = null;

  const getSpeed = () => {
    const v = Number(marquee.dataset.speed);
    return Number.isFinite(v) ? v : 60;  // px/сек
  };

  function measure() {
    // сброс позиций перед измерением
    track.style.transform = 'translate3d(0,0,0)';
    clone.style.transform = 'translate3d(0,0,0)';
    width = track.scrollWidth;
    // высота контейнера под контент, если не фиксируешь вручную
    if (!marquee.style.height) {
      marquee.style.height = track.offsetHeight + 'px';
    }
  }

  function step(time) {
    if (!step.last) step.last = time;
    const dt = time - step.last;      // мс с прошлого кадра
    step.last = time;

    offset -= getSpeed() * (dt / 1000); // px
    // когда ушли левее целой ширины — закидываем вперёд
    if (-offset >= width) offset += width;

    track.style.transform = `translate3d(${offset}px,0,0)`;
    clone.style.transform = `translate3d(${offset + width}px,0,0)`;

    rafId = requestAnimationFrame(step);
  }

  function start() {
    cancelAnimationFrame(rafId);
    step.last = null;
    measure();
    offset = 0;
    rafId = requestAnimationFrame(step);
  }

  // предпочитает ли пользователь статичность
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) return;

  // старт
  start();

  // пересчёт при ресайзе и после подгрузки шрифтов
  window.addEventListener('resize', measure);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  }

  // опционально — пауза на ховер
  marquee.addEventListener('mouseenter', () => cancelAnimationFrame(rafId));
  marquee.addEventListener('mouseleave', () => {
    step.last = null;
    rafId = requestAnimationFrame(step);
  });
});
}

export default runBtn;