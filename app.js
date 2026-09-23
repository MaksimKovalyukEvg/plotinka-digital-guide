'use strict';

// Generated states keep the original data → state → renderer architecture.
const states = {
  welcome: { kind: 'welcome', next: `route${points[0].id}` },
  finish: { kind: 'finish', next: 'presentation' },
  presentation: { kind: 'presentation', next: 'finish' }
};
points.forEach((point, index) => {
  states[`route${point.id}`] = { kind: 'map', index, next: `point${point.id}` };
  states[`point${point.id}`] = { kind: 'point', index, next: index + 1 < points.length ? `route${points[index + 1].id}` : 'finish' };
});
const app = document.getElementById('app');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const visited = new Set();
let state = 'welcome';
let transitioning = false;
let renderVersion = 0;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
function number(value) { return String(value).padStart(2, '0'); }
function paragraphs(text) { return String(text).split('\n').filter(Boolean).map(p => `<p>${escapeHTML(p)}</p>`).join(''); }
function buttonMarkup(label, action = 'next', secondary = false) {
  return `<button class="${secondary ? 'secondary-button' : 'primary-button'}" type="button" data-action="${action}"><span>${escapeHTML(label)}</span><span class="arrow" aria-hidden="true">${action === 'back' ? '←' : '↗'}</span></button>`;
}
function progressMarkup(index) {
  return `<div class="route-progress"><div class="progress-label"><span><b>${number(index + 1)}</b> / ${number(points.length)}</span><span>${escapeHTML(points[index].section)}</span></div><div class="progress-track" role="progressbar" aria-label="Прогресс прогулки" aria-valuemin="0" aria-valuemax="${points.length}" aria-valuenow="${index + 1}"><span style="width:${(index + 1) / points.length * 100}%"></span></div></div>`;
}
function mascotMarkup(config, context = '') {
  const position = config.position === 'left' ? 'left' : 'right';
  const size = ['small', 'medium', 'large'].includes(config.size) ? config.size : 'medium';
  return `<aside class="mascot mascot--${size} mascot--${position}${config.cutout ? ' mascot--cutout' : ' mascot--panel'} ${context}" aria-label="${escapeHTML(site.mascotName)}">
    <div class="mascot-portrait media-slot">
      <span class="mascot-fallback" aria-hidden="true">${escapeHTML(site.mascotFallback)}</span>
      <img hidden data-optional-image data-src="./assets/mascot/${escapeHTML(config.image)}" alt="${escapeHTML(site.mascotName)}" class="mascot-image">
    </div>
    ${config.speech ? `<div class="mascot-speech"><span>${escapeHTML(site.mascotName)}</span><p>${escapeHTML(config.speech)}</p></div>` : ''}
  </aside>`;
}
function artMarkup(point) {
  return `<figure class="story-art story-art--${point.art} media-slot">
    <div class="photo-fallback" role="img" aria-label="${escapeHTML(site.photoFallback)}: ${escapeHTML(point.title)}"><div class="art-topline"><span>${escapeHTML(point.section)}</span><span>ЕКБ</span></div><span class="art-number" aria-hidden="true">${number(point.id)}</span><span class="art-shape" aria-hidden="true"></span><span class="art-caption">${escapeHTML(site.photoFallback)}</span></div>
    <img hidden class="story-image" data-optional-image data-src="${escapeHTML(point.image)}" alt="${escapeHTML(point.title)}">
  </figure>`;
}
function bindOptionalImages() {
  app.querySelectorAll('[data-optional-image]').forEach(image => {
    const fallback = () => { image.hidden = true; image.closest('.media-slot')?.classList.remove('has-media'); };
    const show = () => {
      // The supplied 1×1 technical placeholders keep default URLs valid. Replace files, no JS edits needed.
      if (image.naturalWidth <= 1 || image.naturalHeight <= 1) return fallback();
      image.hidden = false;
      image.closest('.media-slot')?.classList.add('has-media');
    };
    image.addEventListener('load', show, { once: true });
    image.addEventListener('error', fallback, { once: true });
    image.src = image.dataset.src;
    if (image.complete) { if (image.naturalWidth) show(); else fallback(); }
  });
}

// Coordinates remain percentages of the source PNG. Only the display is rotated 90°.
function svgPosition(x, y) {
  const f = mapConfig.frame;
  return [f.y + f.height - y * mapConfig.height / 100, x * mapConfig.width / 100 - f.x];
}
function routePath(segment) {
  const from = points.find(point => point.id === segment.from).map;
  const to = points.find(point => point.id === segment.to).map;
  return [[from.x, from.y], ...segment.points, [to.x, to.y]].map(([x, y], i) => `${i ? 'L' : 'M'}${svgPosition(x, y).join(' ')}`).join(' ');
}
function mapMarkup(completed, active, drawRoute = false, miniature = false) {
  const f = mapConfig.frame;
  const finished = completed === points.length;
  const routes = routeSegments.map(segment => {
    const index = points.findIndex(p => p.id === segment.to);
    if (!finished && index > active) return '';
    return `<path class="route-segment${drawRoute && index === active ? ' route-segment--new' : ''}" data-route="${segment.from}-${segment.to}" pathLength="1" d="${routePath(segment)}"/>`;
  }).join('');
  const nodes = points.map((point, index) => {
    const status = index < completed ? 'visited' : index === active ? 'current' : 'upcoming';
    const [x, y] = svgPosition(point.map.x, point.map.y);
    return `<g class="map-node map-node--${status}" data-point="${point.id}" data-status="${status}"><title>${point.id}. ${escapeHTML(point.title)} — ${status === 'visited' ? 'пройдено' : status === 'current' ? 'текущая остановка' : 'впереди'}</title>${status === 'current' ? `<circle class="node-halo" cx="${x}" cy="${y}" r="42"/>` : ''}<circle class="node-disc" cx="${x}" cy="${y}" r="27"/><text class="node-number" x="${x}" y="${y}">${point.id}</text>${status === 'visited' ? `<path class="node-tick" d="M${x + 16} ${y - 24} l5 5 10 -11"/>` : ''}</g>`;
  }).join('');
  return `<div class="map-panel${miniature ? ' map-panel--mini' : ''}">
    ${!miniature ? `<div class="map-toolbar"><span>${escapeHTML(site.mapLabel)}</span><button type="button" class="map-zoom" data-action="zoom" aria-pressed="false">Крупнее <span aria-hidden="true">＋</span></button></div>` : ''}
    <div class="map-viewport" style="--map-ratio:${f.height}/${f.width}" tabindex="0" aria-label="Карта маршрута">
      <div class="map-canvas" style="aspect-ratio:${f.height}/${f.width}">
        <img class="map-base" src="${escapeHTML(mapConfig.image)}" alt="Карта Исторического сквера" style="width:${mapConfig.width / f.height * 100}%;left:${(f.height + f.y) / f.height * 100}%;top:${-f.x / f.width * 100}%;" width="${mapConfig.width}" height="${mapConfig.height}">
        <svg class="map-overlay${drawRoute ? ' is-drawing' : ''}" viewBox="0 0 ${f.height} ${f.width}" role="img" aria-label="${points.length} остановок; пройдено ${completed}">${routes}${nodes}</svg>
      </div>
    </div>
    ${!miniature ? `<div class="map-legend"><span><i class="legend-visited"></i>Пройдено</span><span><i class="legend-current"></i>Сейчас</span><span><i class="legend-upcoming"></i>Впереди</span></div>` : ''}
  </div>`;
}
function screenTitle(text, className = '') {
  return `<h1 id="screen-title" class="${className}" tabindex="-1">${escapeHTML(text).replace(/\n/g, '<br>')}</h1>`;
}
function renderPoint(current) {
  const point = points[current.index];
  return `<section class="screen point-screen" aria-labelledby="screen-title">
    <div class="point-heading">${progressMarkup(current.index)}<p class="eyebrow">${escapeHTML(site.storyLabel)}</p>${screenTitle(point.title)}</div>
    <div class="point-visual">${artMarkup(point)}${mascotMarkup(point.mascot, 'point-mascot')}</div>
    <div class="point-story"><div class="poem-block"><p class="eyebrow">${escapeHTML(site.poemLabel)}</p><blockquote>${point.poem.map(line => `<p>${escapeHTML(line)}</p>`).join('')}</blockquote></div><div class="story-description"><p class="eyebrow">${escapeHTML(site.demoLabel)}</p>${paragraphs(point.description)}</div><div class="actions">${buttonMarkup(current.index === points.length - 1 ? 'Завершить прогулку' : 'Продолжить маршрут')}</div></div>
  </section>`;
}
const renderers = {
  welcome: () => `<section class="screen welcome-screen" aria-labelledby="screen-title"><div class="welcome-copy"><p class="eyebrow">${escapeHTML(site.welcomeEyebrow)}</p>${screenTitle(site.title, 'intro-title')}<p class="subtitle">${escapeHTML(site.subtitle)}</p></div><div class="welcome-visual"><span class="orbit-word" aria-hidden="true">Здорово, город! Ну, удивляй!</span>${mascotMarkup({ ...site.welcomeMascot, speech: site.welcomeSpeech }, 'welcome-mascot')}</div><div class="welcome-bottom"><div class="meta"><span>${points.length} точек</span><span>≈ ${escapeHTML(site.duration)}</span><span>Пешком</span></div><div class="actions">${buttonMarkup('Начать прогулку')}</div></div></section>`,
  map: current => {
    const point = points[current.index];
    const draw = current.index > 0;
    return `<section class="screen map-screen${draw ? ' map-screen--drawing' : ''}" aria-labelledby="screen-title"><div class="map-heading">${progressMarkup(current.index)}${screenTitle('Твоя прогулка', 'map-title')}</div>${mapMarkup(visited.size, current.index, draw)}<div class="next-stop"><p class="eyebrow">СЛЕДУЮЩАЯ ОСТАНОВКА</p><div class="stop-title"><span>${number(point.id)}</span><h2>${escapeHTML(point.title)}</h2></div><p class="walking-time">${current.index === 0 ? 'Здесь начинается маршрут' : `≈ ${points[current.index - 1].minutesToNext} мин пешком`}</p>${mascotMarkup(site.mapMascot)}${buttonMarkup('Я на месте')}<p class="map-hint">${escapeHTML(site.mapHint)}</p></div></section>`;
  },
  point: renderPoint,
  finish: () => `<section class="screen finish-screen" aria-labelledby="screen-title"><div class="finish-copy"><p class="eyebrow">МАРШРУТ ПРОЙДЕН</p><p class="finish-count">${visited.size} <span>/ ${points.length}</span></p>${screenTitle(site.finishTitle)}<p class="description">${escapeHTML(site.finishText)}</p></div><div class="finish-visual">${mascotMarkup(site.finishMascot)}${mapMarkup(visited.size, points.length - 1, false, true)}</div><div class="actions finish-actions">${buttonMarkup('Посмотреть нашу концепцию')}${buttonMarkup('Пройти ещё раз', 'restart', true)}</div></section>`,
  presentation: () => `<section class="screen presentation-screen" aria-labelledby="screen-title"><header class="presentation-heading">${buttonMarkup('Назад', 'back', true)}${screenTitle(site.presentationTitle)}</header><a class="secondary-button pdf-fallback" href="${escapeHTML(site.presentationPath)}" target="_blank" rel="noopener">Открыть оригинал PDF <span aria-hidden="true">↗</span></a><div class="presentation-content" aria-live="polite" aria-busy="true"><p class="presentation-status" role="status">Загружаем слайды…</p></div></section>`
};
async function bindPresentation(version) {
  const container = app.querySelector('.presentation-content');
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  const isCurrent = () => version === renderVersion && state === 'presentation' && container.isConnected;
  try {
    // Load only a small index. Native PDF embeds are not needed on phones.
    const response = await fetch(site.presentationSlides, { signal: controller.signal, cache: 'no-cache' });
    if (!response.ok) throw new Error('Slides unavailable');
    const manifest = await response.json();
    if (!Array.isArray(manifest.slides) || !manifest.slides.length ||
        !manifest.slides.every(slide => /^slide-\d+\.jpg$/.test(slide.image) && slide.width > 0 && slide.height > 0)) {
      throw new Error('Invalid slide index');
    }
    if (!isCurrent()) return;
    const folder = site.presentationSlides.slice(0, site.presentationSlides.lastIndexOf('/') + 1);
    const revision = encodeURIComponent(manifest.sourceSha256 || '');
    container.innerHTML = `<p class="presentation-hint">${manifest.slides.length} слайдов · листайте вниз. Нажмите на слайд, чтобы открыть крупнее.</p><ol class="presentation-slides">${manifest.slides.map((slide, index) => {
      const image = escapeHTML(`${folder}${slide.image}?v=${revision}`);
      const title = escapeHTML(slide.title || `Слайд ${index + 1}`);
      return `<li><figure class="presentation-slide"><a href="${image}" target="_blank" rel="noopener" aria-label="Открыть слайд ${index + 1} крупнее: ${title}"><img src="${image}" width="${slide.width}" height="${slide.height}" alt="${title}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async"><figcaption><span>Слайд ${index + 1} / ${manifest.slides.length}</span><span aria-hidden="true">Увеличить ↗</span></figcaption></a><p class="slide-error" hidden>Не удалось загрузить этот слайд. Оригинал доступен по ссылке PDF выше.</p></figure></li>`;
    }).join('')}</ol>`;
    container.querySelectorAll('.presentation-slide img').forEach(image => {
      const fallback = () => {
        image.hidden = true;
        image.closest('figure').querySelector('.slide-error').hidden = false;
      };
      image.addEventListener('error', fallback, { once: true });
      if (image.complete && !image.naturalWidth) fallback();
    });
  } catch {
    if (isCurrent()) container.innerHTML = `<div class="presentation-load-error"><p>Не удалось загрузить слайды. Можно попробовать ещё раз или открыть оригинал PDF по ссылке выше.</p>${buttonMarkup('Попробовать ещё раз', 'retry-presentation', true)}</div>`;
  } finally {
    window.clearTimeout(timeout);
    if (isCurrent()) container.setAttribute('aria-busy', 'false');
  }
}

function render(moveFocus = false) {
  const current = states[state];
  app.innerHTML = renderers[current.kind](current);
  app.dataset.state = state;
  app.dataset.view = current.kind;
  app.setAttribute('aria-busy', 'false');
  document.getElementById('footer-count').textContent = `всем привет от ии спеца <3`;
  bindOptionalImages();
  const version = ++renderVersion;
  if (current.kind === 'presentation') bindPresentation(version);
  if (moveFocus) {
    document.getElementById('screen-title').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}
function transitionTo(next) {
  if (!states[next] || transitioning) return;
  transitioning = true;
  app.setAttribute('aria-busy', 'true');
  app.querySelectorAll('button').forEach(button => { button.disabled = true; });
  app.querySelector('.screen').classList.add('is-leaving');
  window.setTimeout(() => {
    state = next;
    if (state === 'welcome') visited.clear();
    render(true);
    transitioning = false;
  }, reduceMotion.matches ? 0 : 180);
}
app.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button || transitioning) return;
  const action = button.dataset.action;
  if (action === 'zoom') {
    const viewport = app.querySelector('.map-viewport');
    const enlarged = viewport.classList.toggle('is-zoomed');
    button.setAttribute('aria-pressed', String(enlarged));
    button.innerHTML = enlarged ? 'Вся схема <span aria-hidden="true">−</span>' : 'Крупнее <span aria-hidden="true">＋</span>';
    if (enlarged) {
      const point = points[states[state].index];
      const [x, y] = svgPosition(point.map.x, point.map.y);
      viewport.scrollLeft = viewport.scrollWidth * x / mapConfig.frame.height - viewport.clientWidth / 2;
      viewport.scrollTop = viewport.scrollHeight * y / mapConfig.frame.width - viewport.clientHeight / 2;
    } else { viewport.scrollLeft = 0; viewport.scrollTop = 0; }
    return;
  }
  if (action === 'retry-presentation' && state === 'presentation') {
    const container = app.querySelector('.presentation-content');
    container.setAttribute('aria-busy', 'true');
    container.innerHTML = '<p class="presentation-status" role="status">Загружаем слайды…</p>';
    bindPresentation(++renderVersion);
    return;
  }
  if (action === 'restart') { transitionTo('welcome'); return; }
  if (action === 'back' && state === 'presentation') { transitionTo('finish'); return; }
  if (action !== 'next') return;
  const current = states[state];
  if (current.kind === 'point') visited.add(points[current.index].id);
  transitionTo(current.next);
});
document.title = `${site.title} — цифровая прогулка`;
document.querySelector('.brand-name').textContent = `${site.title.toUpperCase()} / ГИД`;
document.querySelector('.city').textContent = site.city.toUpperCase();
render();
