// magnifier.js
const magnifier = () => {
  class Magnifier {
    constructor(el, opts = {}) {
      this.el = el;
      this.opts = Object.assign({
        zoom: 1.5,
        zoomMin: 1,
        zoomMax: 3,
        zoomStep: 0.25,
        imageBase: null, // нижний слой
        imageLens: null  // картинка под лупой
      }, opts);

      // Хелпер: обернуть урл
      const wrap = v => v && (v.startsWith('url(') ? v : `url('${v}')`);

      // Если передали одну старую опцию image — используем её и там и там
      if (this.opts.image && !this.opts.imageBase && !this.opts.imageLens) {
        this.opts.imageBase = this.opts.image;
        this.opts.imageLens = this.opts.image;
      }

      if (this.opts.imageBase) this.el.style.setProperty('--img1', wrap(this.opts.imageBase));
      if (this.opts.imageLens) this.el.style.setProperty('--img2', wrap(this.opts.imageLens));

      this.zoom = this.opts.zoom;
      this._onMove = this._onMove.bind(this);
      this._onWheel = this._onWheel.bind(this);
      this._onLeave = this._onLeave.bind(this);

      // центр по умолчанию
      this._setMask(this.el.clientWidth / 2, this.el.clientHeight / 2);

      this.el.addEventListener('mousemove', this._onMove);
      this.el.addEventListener('wheel', this._onWheel, { passive: false });
      this.el.addEventListener('mouseleave', this._onLeave);
    }

    _setMask(x, y) {
      const rect = this.el.getBoundingClientRect();
      const clampedX = Math.max(0, Math.min(x, rect.width));
      const clampedY = Math.max(0, Math.min(y, rect.height));

      // Позиция маски
      this.el.style.setProperty('--mask-x', clampedX + 'px');
      this.el.style.setProperty('--mask-y', clampedY + 'px');
      this.el.style.setProperty('--zoom', this.zoom);

      // Смещение фона под лупой так, чтобы под курсором «лежала» нужная точка
      // Формула: при увеличении фон двигаем на -(x*(z-1)), -(y*(z-1))
      const dx = -(clampedX * (this.zoom - 1));
      const dy = -(clampedY * (this.zoom - 1));
      this.el.style.setProperty('--bgx', dx + 'px');
      this.el.style.setProperty('--bgy', dy + 'px');
    }

    _onMove(e) {
      const rect = this.el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this._setMask(x, y);
    }

    _onWheel(e) {
      e.preventDefault();
      const dir = Math.sign(e.deltaY);
      if (dir > 0 && this.zoom > this.opts.zoomMin) {
        this.zoom = Math.max(this.opts.zoomMin, this.zoom - this.opts.zoomStep);
      }
      if (dir < 0 && this.zoom < this.opts.zoomMax) {
        this.zoom = Math.min(this.opts.zoomMax, this.zoom + this.opts.zoomStep);
      }
      // Обновляем и смещения, и css var --zoom
      const rect = this.el.getBoundingClientRect();
      const mx = parseFloat(getComputedStyle(this.el).getPropertyValue('--mask-x')) || rect.width / 2;
      const my = parseFloat(getComputedStyle(this.el).getPropertyValue('--mask-y')) || rect.height / 2;
      this._setMask(mx, my);
    }

    _onLeave() {}
    destroy() {
      this.el.removeEventListener('mousemove', this._onMove);
      this.el.removeEventListener('wheel', this._onWheel);
      this.el.removeEventListener('mouseleave', this._onLeave);
    }
  }

  document.querySelectorAll('.magnifier').forEach(el => {
    new Magnifier(el, {
      zoom: 1.5,
      zoomMin: 1,
      zoomMax: 3,
      zoomStep: 0.25
      // можно передать imageBase и imageLens тут или через inline style в HTML
    });
  });

  window.Magnifier = Magnifier;
};

export default magnifier;
