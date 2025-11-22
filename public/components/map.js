export const mapCity = () => {
  document.addEventListener('DOMContentLoaded', function () {
    const svgns = 'http://www.w3.org/2000/svg';
    const svg = document.getElementById('map');
    if (!svg) return;

    const cityPositions = {}; // сюда сложим координаты городов по имени

    document.querySelectorAll('#map .city').forEach(function (city) {
      const titleEl = city.querySelector('title');
      const name =
        city.getAttribute('data-name') ||
        (titleEl ? titleEl.textContent : '');

      if (!name) return;

      // Парсим transform="translate(x,y)"
      const transform = city.getAttribute('transform') || '';
      const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      if (match) {
        const x = parseFloat(match[1]);
        const y = parseFloat(match[2]);
        cityPositions[name] = { x, y };
      }

      // Линия подсказки
      const line = document.createElementNS(svgns, 'path');
      line.setAttribute('class', 'hint-line');
      line.setAttribute('d', 'M0 0 L0 -40 L80 -40');
      city.appendChild(line);

      // Текст подписи
      const text = document.createElementNS(svgns, 'text');
      text.setAttribute('class', 'hint-text');
      text.setAttribute('x', '100');   // чуть дальше от конца линии
      text.setAttribute('y', '-40');
      text.textContent = name;
      city.appendChild(text);

      // Размер текста
      const bbox = text.getBBox();
      const computed = window.getComputedStyle(text);
      const fontSize = parseFloat(computed.fontSize) || 14;

      const paddingX = fontSize * 1.4;
      const paddingY = fontSize * 0.8;

      const rect = document.createElementNS(svgns, 'rect');
      rect.setAttribute('class', 'hint-box');
      rect.setAttribute('x', String(bbox.x - paddingX));
      rect.setAttribute('y', String(bbox.y - paddingY));
      rect.setAttribute('width', String(bbox.width + paddingX * 2));
      rect.setAttribute('height', String(bbox.height + paddingY * 2));
      city.insertBefore(rect, text);

      // Убираем стандартный тултип
      if (titleEl) {
        titleEl.remove();
      }

      // Анимация линии подсказки
      const path = line;
      const length = path.getTotalLength();

      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length);

      city.addEventListener('mouseenter', () => {
        path.style.transition = 'none';
        path.style.strokeDashoffset = String(length);
        path.getBoundingClientRect(); // форсим перерисовку
        path.style.transition = 'stroke-dashoffset 0.4s ease-out';
        path.style.strokeDashoffset = '0';
      });

      city.addEventListener('mouseleave', () => {
        path.style.transition = 'none';
        path.style.strokeDashoffset = String(length);
      });
    });

    // ==== ЛИНИИ МЕЖДУ ГОРОДАМИ ====

    const linksGroup = document.createElementNS(svgns, 'g');
    linksGroup.setAttribute('id', 'city-links');

    // Ставим линии под точками городов
    const citiesGroup = svg.querySelector('#cities');
    if (citiesGroup && citiesGroup.parentNode) {
      citiesGroup.parentNode.insertBefore(linksGroup, citiesGroup);
    } else {
      svg.appendChild(linksGroup);
    }

    function addLink(fromName, toName) {
      const from = cityPositions[fromName];
      const to = cityPositions[toName];
      if (!from || !to) return;

      const line = document.createElementNS(svgns, 'line');
      line.setAttribute('class', 'city-link');
      line.setAttribute('x1', String(from.x));
      line.setAttribute('y1', String(from.y));
      line.setAttribute('x2', String(to.x));
      line.setAttribute('y2', String(to.y));
      linksGroup.appendChild(line);
    }

    // Связи от Нижнего Новгорода
    addLink('Нижний Новгород', 'Москва');
    addLink('Нижний Новгород', 'Санкт-Петербург');
    addLink('Нижний Новгород', 'Казань');
  });
};
