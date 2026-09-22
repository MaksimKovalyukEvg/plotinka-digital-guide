'use strict';

// Content and schematic map positions live together. Add a point here to extend the walk.
const points = [
  {
    id: 1,
    title: 'Городская плотина',
    shortTitle: 'Плотина',
    description: 'Здесь вода встречается с городом. Плотина — одна из главных точек Плотинки и удобное место, чтобы начать знакомство с Историческим сквером. Остановитесь на минуту, прислушайтесь к воде и посмотрите, как вокруг неё устроено пространство.',
    image: '',
    art: 'water',
    theme: 'ГОРОД / ВОДА',
    x: 300, y: 190,
    labelX: 77, labelY: 164,
    labelAnchor: 'start',
    minutes: 0,
    route: ''
  },
  {
    id: 2,
    title: 'Водонапорная башня',
    shortTitle: 'Башня',
    description: 'Продолжим прогулку у водонапорной башни. Само её название напоминает о практической стороне городской жизни — о воде и инфраструктуре. Посмотрите на силуэт, материалы и детали: привычное сооружение становится отдельной историей места.',
    image: '',
    art: 'tower',
    theme: 'ГОРОД / ДЕТАЛИ',
    x: 435, y: 335,
    labelX: 474, labelY: 341,
    labelAnchor: 'start',
    minutes: 2,
    route: 'M300 190 H376 Q395 190 395 211 V287 Q395 305 413 305 H417 Q435 305 435 323 V335'
  },
  {
    id: 3,
    title: 'Музей архитектуры и дизайна',
    shortTitle: 'Музей архитектуры\nи дизайна',
    description: 'Финальная остановка — у Музея архитектуры и дизайна. Здесь можно подумать о том, как складывается облик города: из зданий, материалов и решений людей. Посмотрите вокруг и выберите деталь Плотинки, которую вам хочется запомнить.',
    image: '',
    art: 'museum',
    theme: 'ГОРОД / ФОРМА',
    x: 410, y: 485,
    labelX: 410, labelY: 537,
    labelAnchor: 'middle',
    minutes: 3,
    route: 'M435 335 V393 Q435 410 419 410 H394 Q377 410 377 427 V451 Q377 468 393 468 H395 Q410 468 410 485'
  }
];

const states = { intro: { kind: 'intro', next: 'point1' }, finish: { kind: 'finish', next: 'intro' } };
points.forEach((point, index) => {
  states[`point${point.id}`] = { kind: 'point', index, next: index < points.length - 1 ? `route${points[index + 1].id}` : 'finish' };
  if (index > 0) states[`route${point.id}`] = { kind: 'route', index, next: `point${point.id}` };
});

const app = document.getElementById('app');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let state = 'intro';
let transitioning = false;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function number(value) { return String(value).padStart(2, '0'); }

function mapMarkup(completed, active, drawRoute = false) {
  const finished = completed === points.length;
  const location = completed > 0 ? points[completed - 1] : points[0];
  const mapSummary = points.map((p, i) => `${p.title}: ${i < completed ? 'пройдено' : i === active ? 'следующая остановка' : 'впереди'}`).join('. ');
  const routes = points.slice(1).map((point, offset) => {
    const index = offset + 1;
    if (!finished && index > active) return '';
    const isNew = drawRoute && index === active;
    return `<path class="route-segment${isNew ? ' route-segment--new' : ''}" data-route="${index}-${index + 1}" pathLength="1" d="${point.route}"/>`;
  }).join('');
  const nodes = points.map((point, index) => {
    const done = index < completed;
    const isActive = !done && index === active;
    const lines = point.shortTitle.split('\n');
    return `<g class="map-node ${done ? 'map-node--done' : isActive ? 'map-node--active' : ''}" data-point="${point.id}">
      <text class="landmark-label" x="${point.labelX}" y="${point.labelY}" text-anchor="${point.labelAnchor}">${lines.map((line, i) => `<tspan x="${point.labelX}" dy="${i ? '23' : '0'}">${escapeHTML(line)}</tspan>`).join('')}</text>
      ${isActive ? `<circle class="node-halo" cx="${point.x}" cy="${point.y}" r="37"/>` : ''}
      <circle class="node-disc" cx="${point.x}" cy="${point.y}" r="24"/>
      ${done ? `<path d="M${point.x - 9} ${point.y} l6 7 13-14" fill="none" stroke="#26392d" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>` : `<text class="node-number" x="${point.x}" y="${point.y}">${point.id}</text>`}
    </g>`;
  }).join('');
  return `<div class="map-frame">
    <span class="map-caption">ИСТОРИЧЕСКИЙ СКВЕР</span>
    <span class="map-compass" aria-hidden="true"><b>↑</b>С</span>
    <svg class="map-svg" viewBox="0 0 620 620" role="img" aria-labelledby="map-title map-desc">
      <title id="map-title">Схема прогулки по Плотинке</title>
      <desc id="map-desc">Условная карта, не предназначенная для навигации. ${escapeHTML(mapSummary)}.</desc>
      <rect width="620" height="620" fill="#e6eadc"/>
      <path d="M153-5H447L416 113Q409 140 386 159L339 189L310 241L294 339L307 404L280 470L262 625H176L192 461L217 393L205 334L228 227L246 183L225 151L175 124Z" fill="#b4d8df"/>
      <path d="M275 234L256 334L268 399L244 466L223 620" fill="none" stroke="#98c7d0" stroke-width="2"/>
      <text class="map-water-label" transform="translate(245 380) rotate(-81)">ИСЕТЬ</text>
      <g fill="#d5dfc8">
        <rect x="22" y="242" width="132" height="143" rx="34"/>
        <rect x="27" y="429" width="120" height="135" rx="29"/>
        <rect x="469" y="92" width="122" height="143" rx="34"/>
        <rect x="484" y="405" width="107" height="138" rx="29"/>
        <rect x="330" y="252" width="42" height="98" rx="19"/>
      </g>
      <g fill="none" stroke="#f9faf2" stroke-width="19" stroke-linecap="round" stroke-linejoin="round">
        <path d="M0 190H376Q395 190 395 211V287Q395 305 413 305H417Q435 305 435 323V393Q435 410 419 410H394Q377 410 377 427V451Q377 468 393 468H395Q410 468 410 485V620"/>
        <path d="M65 620V414Q65 400 80 400H190M87 400V209M435 335H620M435 115V0M377 410H335"/>
      </g>
      <g fill="#b7c7a5" opacity=".7">
        <circle cx="39" cy="292" r="10"/><circle cx="129" cy="332" r="12"/><circle cx="118" cy="268" r="8"/>
        <circle cx="120" cy="486" r="11"/><circle cx="42" cy="530" r="9"/>
        <circle cx="513" cy="150" r="10"/><circle cx="568" cy="198" r="12"/><circle cx="533" cy="449" r="12"/>
      </g>
      <g fill="#c1c9b9" stroke="#aab6a0" stroke-width="1.5">
        <rect x="125" y="119" width="67" height="20" rx="4"/>
        <rect x="441" y="261" width="39" height="43" rx="7"/>
        <rect x="454" y="471" width="80" height="37" rx="6"/>
      </g>
      <path d="M211 178H354M211 202H354" fill="none" stroke="#829684" stroke-width="4"/>
      ${routes}
      ${!finished ? `<g transform="translate(${location.x},${location.y + 49})"><rect class="you-label" x="-62" y="-13" width="124" height="28" rx="14"/><text class="you-text" y="6">Вы здесь</text></g>` : ''}
      ${nodes}
    </svg>
    <div class="map-note"><span>Концептуальная схема</span><span>${finished ? 'МАРШРУТ ПРОЙДЕН' : 'БЕЗ МАСШТАБА'}</span></div>
  </div>`;
}

function progressMarkup(index) {
  return `<div class="story-progress" role="img" aria-label="Остановка ${index + 1} из ${points.length}">${points.map((_, i) => `<span class="${i <= index ? 'filled' : ''}"></span>`).join('')}</div>`;
}

function artMarkup(point) {
  if (point.image) return `<div class="story-art"><img class="story-image" src="${escapeHTML(point.image)}" alt="${escapeHTML(point.title)}"></div>`;
  return `<div class="story-art story-art--${point.art}" role="img" aria-label="Визуальный эскиз для остановки ${escapeHTML(point.title)}. Временный placeholder вместо фотографии.">
    <div class="art-topline" aria-hidden="true"><span>${point.theme}</span><span>ПЛОТИНКА</span></div>
    <span class="art-number" aria-hidden="true">${number(point.id)}</span>
    <span class="art-caption" aria-hidden="true">ВИЗУАЛЬНЫЙ ЭСКИЗ</span>
  </div>`;
}

function buttonMarkup(label, note = '') {
  return `<div class="actions"><button class="primary-button" type="button" data-action="next"><span>${label}</span><span class="arrow" aria-hidden="true">↗</span></button>${note ? `<p class="action-note">${note}</p>` : ''}</div>`;
}

function render(moveFocus = false) {
  const current = states[state];
  let markup;
  if (current.kind === 'intro') {
    markup = `<section class="screen intro-screen" aria-labelledby="screen-title">
      <div class="screen-copy"><p class="eyebrow">ИСТОРИЧЕСКИЙ СКВЕР / ЕКБ</p><h1 id="screen-title" class="intro-title" tabindex="-1">Плотинка</h1><p class="subtitle">Цифровая прогулка<br>по истории города</p><div class="meta"><span class="pill pill--accent"><span class="pill-dot" aria-hidden="true"></span>${points.length} точки</span><span class="pill">≈ 10 минут</span></div></div>
      <div class="visual">${mapMarkup(0, 0)}</div>
      ${buttonMarkup('Начать прогулку', 'Откройте город — история за историей.')}
    </section>`;
  } else if (current.kind === 'point') {
    const point = points[current.index];
    markup = `<section class="screen point-screen" aria-labelledby="screen-title">
      <div class="screen-copy"><p class="eyebrow point-counter"><b>${number(current.index + 1)}</b><span class="rule" aria-hidden="true"></span><span>${number(points.length)} / ИСТОРИЯ МЕСТА</span></p><h1 id="screen-title" tabindex="-1">${escapeHTML(point.title)}</h1><p class="description">${escapeHTML(point.description)}</p>${progressMarkup(current.index)}</div>
      <div class="visual">${artMarkup(point)}</div>
      ${buttonMarkup(current.index === points.length - 1 ? 'Завершить прогулку' : 'Продолжить маршрут')}
    </section>`;
  } else if (current.kind === 'route') {
    const point = points[current.index];
    markup = `<section class="screen route-screen" aria-labelledby="screen-title">
      <div class="screen-copy"><p class="eyebrow">СЛЕДУЮЩАЯ ОСТАНОВКА</p><h1 id="screen-title" tabindex="-1">${escapeHTML(point.title)}</h1><div class="meta"><span class="pill pill--accent">${number(current.index)} → ${number(current.index + 1)}</span><span class="pill">≈ ${point.minutes} минуты пешком</span></div><p class="description">Следуйте по отмеченному маршруту.</p></div>
      <div class="visual">${mapMarkup(current.index, current.index, true)}</div>
      ${buttonMarkup('Я на месте', 'Демонстрационный маршрут. Переходите в своём темпе.')}
    </section>`;
  } else {
    markup = `<section class="screen finish-screen" aria-labelledby="screen-title">
      <div class="screen-copy"><p class="eyebrow">МАРШРУТ ПРОЙДЕН</p><h1 id="screen-title" class="finish-title" tabindex="-1">Прогулка<br>завершена</h1><div class="finish-count"><strong>${points.length} / ${points.length}</strong><span>точки</span></div><p class="description">Вы познакомились с несколькими историями Плотинки. Теперь это место — немного ближе.</p></div>
      <div class="visual">${mapMarkup(points.length, points.length - 1)}</div>
      ${buttonMarkup('Пройти ещё раз')}
    </section>`;
  }
  app.innerHTML = markup;
  app.dataset.state = state;
  app.setAttribute('aria-busy', 'false');
  if (moveFocus) {
    document.getElementById('screen-title').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

app.addEventListener('click', event => {
  const button = event.target.closest('[data-action="next"]');
  if (!button || transitioning) return;
  transitioning = true;
  button.disabled = true;
  app.setAttribute('aria-busy', 'true');
  app.querySelector('.screen').classList.add('is-leaving');
  window.setTimeout(() => {
    state = states[state].next;
    render(true);
    transitioning = false;
  }, reduceMotion.matches ? 0 : 220);
});

render();
