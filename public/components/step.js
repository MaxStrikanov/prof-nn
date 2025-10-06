import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

document.addEventListener('DOMContentLoaded', () => {
  const timelineEl = document.querySelector('.hww .timeline')
  if (!timelineEl) return

  // утилиты
  const clamp01 = gsap.utils.clamp(0, 1)
  const smoothstep = t => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t)) // мягкая S-кривая

  // соберём шаги
  const steps = Array.from(document.querySelectorAll('.hww .step')).map(step => {
    const dot = step.querySelector('.dot')
    const card = step.querySelector('.card')
    const isLeft = step.classList.contains('step--left')

    // стартовые состояния карточки совпадают с SCSS
    if (card) {
      card.style.setProperty('--tx', isLeft ? '-80px' : '80px')
      card.style.setProperty('--ty', '48px')
      card.style.setProperty('--ts', '.94')
      card.style.opacity = '0'
    }
    step.style.setProperty('--dot-progress', '0')

    return {
      step, dot, card, isLeft,
      dotTopRel: 0,
      dotH: (dot?.offsetHeight) || 1
    }
  })

  // геометрия
  const pageY = el => el.getBoundingClientRect().top + window.scrollY
  let timelineTop = 0
  let timelineH = 0

  function computeMetrics() {
    timelineTop = pageY(timelineEl)
    timelineH = timelineEl.offsetHeight

    steps.forEach(s => {
      const dotTop = s.dot ? pageY(s.dot) : pageY(s.step)
      s.dotH = (s.dot?.offsetHeight) || s.step.offsetHeight || 1
      s.dotTopRel = dotTop - timelineTop
    })
  }

  // апдейт по прогрессу линии (0..1)
  function updateByProgress(p) {
    const lineY = p * timelineH // сколько пикселей «залито» сверху вниз

    steps.forEach(s => {
      // 1) заливка точки: от момента касания (0) до прохождения низа точки (1)
      const tDot = clamp01((lineY - s.dotTopRel) / s.dotH)
      s.step.style.setProperty('--dot-progress', String(tDot))

      // 2) карточка: должна быть ПОЛНОСТЬЮ к моменту касания
      //    берём "пре-ролл" в пикселях: пока линия в диапазоне [-leadPx .. 0] относительно верха точки,
      //    карточка идёт от 0 до 1. В точке (dist=0) она уже 1.
      const leadPx = 280 // увеличен для большей плавности
      const dist = lineY - s.dotTopRel // 0 — линия коснулась верха точки
      let tCardRaw = clamp01((dist + leadPx) / leadPx) // dist=-leadPx -> 0, dist=0 -> 1
      
      // более плавная кривая для всей анимации карточки
      const tCard = smoothstep(smoothstep(tCardRaw))

      if (s.card) {
        // более плавные трансформации
        const dx = (1 - tCard) * (s.isLeft ? -80 : 80)
        const dy = (1 - tCard) * 40
        const sc = 0.94 + 0.06 * tCard   // 0.94 → 1.00
        
        // более плавная прозрачность - начинается раньше и заканчивается позже
        const opacityStart = 0.2 // начинаем показывать с 20% прогресса
        const opacityEnd = 0.8   // полностью показываем к 80% прогресса
        const op = clamp01((tCard - opacityStart) / (opacityEnd - opacityStart))

        s.card.style.setProperty('--tx', dx + 'px')
        s.card.style.setProperty('--ty', dy + 'px')
        s.card.style.setProperty('--ts', String(sc))
        s.card.style.opacity = String(op)
      }
    })
  }

  // метрики и триггеры
  computeMetrics()
  ScrollTrigger.addEventListener('refreshInit', computeMetrics)
  window.addEventListener('resize', () => { computeMetrics(); ScrollTrigger.refresh() })

  // линия: скраб с инерцией, апдейтим точки/карточки на каждом тике
  gsap.set(timelineEl, { '--line-progress': 0 })
  gsap.to(timelineEl, {
    '--line-progress': 1,
    ease: 'none',
    scrollTrigger: {
      trigger: timelineEl,
      start: 'top center',
      end: 'bottom center',
      scrub: 1.8,
      onUpdate: self => updateByProgress(self.progress)
    }
  })
})