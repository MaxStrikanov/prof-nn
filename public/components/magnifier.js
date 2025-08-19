const magnifier = () => {
  class Magnifier {
    constructor(el, opts = {}) {
      this.el = el;
      this.opts = Object.assign({
        zoom: 1.5,
        zoomMin: 1,
        zoomMax: 3,
        zoomStep: 0.25
      }, opts);

      // если передали обычный URL, оборачиваем в url('...')
      if (this.opts.image) {
        const val = this.opts.image.startsWith('url(')
          ? this.opts.image
          : `url('${this.opts.image}')`;
        this.el.style.setProperty('--img', val);
      }

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
      this.el.style.setProperty('--mask-x', clampedX + 'px');
      this.el.style.setProperty('--mask-y', clampedY + 'px');
      this.el.style.setProperty('--zoom', this.zoom);
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
      this.el.style.setProperty('--zoom', this.zoom);
    }

    _onLeave() {}
    destroy() {
      this.el.removeEventListener('mousemove', this._onMove);
      this.el.removeEventListener('wheel', this._onWheel);
      this.el.removeEventListener('mouseleave', this._onLeave);
    }
  }

  // Инициализируем все .magnifier на странице
  document.querySelectorAll('.magnifier').forEach(el => {
    new Magnifier(el, {
      zoom: 1.5,
      zoomMin: 1,
      zoomMax: 3,
      zoomStep: 0.25
    });
  });

  // При желании оставим класс в window, чтобы использовать позже вручную
  window.Magnifier = Magnifier;
};

export default magnifier;