'use strict';

// Historical IDs follow the user's scheme. Coordinates and route bends are percentages.
// TODO: fine-tune against final map — anchors match the numbered positions in the supplied SVG; verify historical placement on site.
// markerOffset moves only the number badge; x/y remain the object and route anchor.
const points = [
  {
    id: 1, title: 'Водонапорная башня', shortTitle: 'Водонапорная башня',
    chapterNumber: 1, chapter: 'НАЧАЛО ЕКАТЕРИНБУРГА', type: 'standard',
    description: 'Начнём с водонапорной башни. Она помогает увидеть в привычном городском пространстве следы заводского комплекса. На этой прогулке будем замечать не только здания, но и входы, стены, переходы и воду, которые связывали территорию воедино.',
    art: 'tower', theme: 'ВОДА / НАЧАЛО', x: 93.929, y: 78.332, labelX: 89.286, labelY: 71.908, markerOffset: [0, 0], minutes: 0, route: []
  },
  {
    id: 2, title: 'Ворота Екатеринбургского завода', shortTitle: 'Ворота',
    chapterNumber: 1, chapter: 'НАЧАЛО ЕКАТЕРИНБУРГА', type: 'gate', gateIndex: 1,
    description: 'На территории сохранилось несколько ворот. Они отмечают входы в комплекс и помогают представить его границы. По пути встретим ещё трое ворот — попробуйте заметить, что у них общего и чем они отличаются.',
    art: 'museum', theme: 'ВХОД / ГРАНИЦА', x: 98.214, y: 83.988, labelX: 89.286, labelY: 91.659, markerOffset: [-2.679, 1.438], minutes: 1, route: [[93.929, 81.496], [98.214, 81.496]]
  },
  {
    id: 3, title: 'Производственный корпус', shortTitle: 'Производственный корпус',
    chapterNumber: 2, chapter: 'ГОРОД-ЗАВОД', type: 'standard',
    description: 'Название этого здания возвращает нас к производственной жизни территории. Представьте комплекс не как отдельные памятники, а как связанное пространство работы. Посмотрите, как корпус расположен относительно соседних зданий и проходов.',
    art: 'tower', theme: 'ТРУД / МАСШТАБ', x: 80.982, y: 88.015, labelX: 80.804, labelY: 95.877, markerOffset: [0, 0], minutes: 2, route: [[97.321, 81.879], [87.768, 81.879], [85.714, 81.879], [80.982, 81.879]]
  },
  {
    id: 4, title: 'Здание кладовых', shortTitle: 'Здание кладовых',
    chapterNumber: 2, chapter: 'ГОРОД-ЗАВОД', type: 'standard',
    description: 'У заводского комплекса была и повседневная сторона: вещи нужно было хранить и перемещать. Название «кладовые» напоминает об этой работе. Найдите взглядом входы и попробуйте представить, как ими пользовались.',
    art: 'water', theme: 'ВЕЩИ / ПОРЯДОК', x: 58.214, y: 88.015, labelX: 58.036, labelY: 95.877, markerOffset: [0, 0], minutes: 1, route: [[80.982, 81.879], [58.214, 81.879]]
  },
  {
    id: 5, title: 'Дом чертежников', shortTitle: 'Дом чертежников',
    chapterNumber: 2, chapter: 'ГОРОД-ЗАВОД', type: 'standard',
    description: 'За любой постройкой стоит замысел. Дом чертежников предлагает взглянуть на завод через работу с линиями, размерами и планами. От чертежа на бумаге — к зданию и целому городскому пространству.',
    art: 'museum', theme: 'ЛИНИЯ / ЗАМЫСЕЛ', x: 54.821, y: 70.757, labelX: 50.446, labelY: 62.32, markerOffset: [0, 0], minutes: 2, route: [[58.214, 81.879], [60.893, 80.058], [60.893, 70.757]]
  },
  {
    id: 6, title: 'Ворота', shortTitle: 'Ворота', storyTitle: 'Ещё одни ворота',
    chapterNumber: 3, chapter: 'СЛЕДЫ ЗАВОДА', type: 'gate', gateIndex: 2, compact: true,
    description: 'Ты нашёл второй сохранившийся вход в комплекс. Сравни его с первыми воротами: похожи ли пропорции и детали?',
    art: 'tower', theme: 'ВХОД / НАХОДКА', x: 22.5, y: 87.536, labelX: 22.768, labelY: 95.877, markerOffset: [0, 0], minutes: 1, route: [[60.893, 70.757], [60.893, 80.058], [22.5, 80.058]]
  },
  {
    id: 7, title: 'Ворота', shortTitle: 'Ворота', storyTitle: 'Ещё одни ворота',
    chapterNumber: 3, chapter: 'СЛЕДЫ ЗАВОДА', type: 'gate', gateIndex: 3, compact: true,
    description: 'Третий вход найден. Вместе ворота показывают, что заводская территория была связана с городом сразу в нескольких местах.',
    art: 'water', theme: 'ВХОД / НАХОДКА', x: 75.089, y: 76.031, labelX: 74.107, labelY: 69.511, markerOffset: [0, 0], minutes: 1, route: [[22.5, 80.058], [75.089, 80.058]]
  },
  {
    id: 8, title: 'Стена главного корпуса', shortTitle: 'Стена главного корпуса',
    chapterNumber: 3, chapter: 'СЛЕДЫ ЗАВОДА', type: 'standard',
    description: 'Иногда о здании рассказывает то, что от него осталось. Посмотри на линию стены и попробуй мысленно продолжить её. Такой фрагмент помогает представить масштаб прежнего пространства.',
    hint: 'Перед тобой сохранившийся фрагмент значительно более крупного комплекса.',
    mascotText: 'Видишь старую кладку? Попробуй проследить, куда продолжается её линия.',
    art: 'tower', theme: 'ФРАГМЕНТ / ЦЕЛОЕ', x: 11.786, y: 69.415, labelX: 12.054, labelY: 76.222, markerOffset: [0, 0], minutes: 2, route: [[75.089, 80.058], [16.161, 80.058], [16.161, 69.415]]
  },
  {
    id: 9, title: 'Сушильный корпус', shortTitle: 'Сушильный корпус',
    chapterNumber: 3, chapter: 'СЛЕДЫ ЗАВОДА', type: 'standard',
    description: 'Ещё одно название, в котором сохранилась память о работе завода. Не будем угадывать детали производства: лучше рассмотрим само здание. Его форма и положение — часть общей истории комплекса.',
    art: 'museum', theme: 'РАБОТА / ПАМЯТЬ', x: 21.071, y: 61.745, labelX: 25.446, labelY: 55.609, markerOffset: [0, 0], minutes: 1, route: [[16.161, 69.415], [16.161, 68.456], [21.071, 68.456]]
  },
  {
    id: 10, title: 'Мост через реку Исеть', shortTitle: 'Мост через Исеть', storyTitle: 'Перейдём Исеть',
    chapterNumber: 4, chapter: 'ИСЕТЬ', type: 'bridge', compact: true,
    description: 'Продолжим маршрут на другой стороне реки.', actionLabel: 'Перейти',
    hint: 'Остановись на мосту и посмотри на оба берега: вода связывает все части этой истории.',
    art: 'water', theme: 'БЕРЕГ / ПЕРЕХОД', x: 17.768, y: 43.72, labelX: 13.393, labelY: 37.68, markerOffset: [0, 0], minutes: 2, route: [[21.071, 68.456], [16.161, 68.456], [17.054, 55.321], [17.054, 43.72]]
  },
  {
    id: 11, title: 'Гранитные устои косого моста через реку Исеть', shortTitle: 'Гранитные устои косого моста', storyTitle: 'Гранитные устои',
    chapterNumber: 4, chapter: 'ИСЕТЬ', type: 'standard',
    description: 'Устои — след прежнего перехода через реку. Без подсказки их легко принять за часть берега. Найди каменные фрагменты и попробуй представить линию моста между ними.',
    hintTitle: 'НАЙДИ ЭТО МЕСТО', hint: 'Посмотри на гранит у воды. Это остановка, где важнее заметить деталь, чем увидеть большое здание.',
    art: 'water', theme: 'КАМЕНЬ / ВОДА', x: 30.0, y: 29.434, labelX: 29.464, labelY: 37.392, markerOffset: [0, 0], minutes: 1, route: [[17.768, 41.227], [34.196, 41.227], [34.196, 35.187], [30.0, 35.187]]
  },
  {
    id: 12, title: 'Госпиталь Екатеринбургского завода, где состоялось первое театрализованное представление', shortTitle: 'Госпиталь Екатеринбургского завода', storyTitle: 'Как завод связан с театром?',
    chapterNumber: 5, chapter: 'ЗАВОД СТАНОВИТСЯ ГОРОДОМ', type: 'standard',
    description: 'На исторической схеме госпиталь Екатеринбургского завода отмечен как место первого театрализованного представления. Заводская территория оказывается пространством не только работы, но и человеческой жизни. Здесь история производства встречается с историей культуры.',
    storySequence: ['Завод', 'Люди', 'Культура', 'Город'],
    art: 'museum', theme: 'ЛЮДИ / КУЛЬТУРА', x: 23.214, y: 15.628, labelX: 23.214, labelY: 9.588, markerOffset: [0, 0], minutes: 2, route: [[30.0, 35.187], [22.232, 35.187], [22.232, 21.668], [23.214, 21.668]]
  },
  {
    id: 13, title: 'Остатки стен', shortTitle: 'Остатки стен',
    chapterNumber: 6, chapter: 'СКРЫТАЯ ИСТОРИЯ', type: 'find',
    prompt: 'Попробуй найти этот фрагмент',
    description: 'Ты заметил след постройки, которая когда-то была частью большого комплекса. Остатки стен помогают прочитать пространство иначе: не только увидеть то, что есть сейчас, но и задуматься о том, что исчезло.',
    hint: 'Ищи фрагмент кладки. Не нужно заходить за ограждения или сходить с доступной дорожки.',
    art: 'tower', theme: 'НАЙТИ / ЗАМЕТИТЬ', x: 46.786, y: 17.354, labelX: 46.875, labelY: 10.547, markerOffset: [0, 0], minutes: 2, route: [[23.214, 21.668], [46.786, 21.668]]
  },
  {
    id: 14, title: 'Грот', shortTitle: 'Грот',
    chapterNumber: 6, chapter: 'СКРЫТАЯ ИСТОРИЯ', type: 'standard',
    description: 'У этой остановки другой масштаб и другое настроение. Грот предлагает замедлиться и рассмотреть скрытые детали территории. Иногда самое интересное место не сразу попадает в поле зрения.',
    mascotText: 'Здесь не нужно спешить. Дай глазам время заметить детали.',
    art: 'grotto', theme: 'ТИШИНА / ГЛУБИНА', x: 71.161, y: 17.641, labelX: 70.982, labelY: 10.547, markerOffset: [0, 0], minutes: 1, route: [[46.786, 21.668], [71.161, 21.668]]
  },
  {
    id: 15, title: 'Ворота', shortTitle: 'Ворота', storyTitle: 'Все ворота найдены',
    chapterNumber: 6, chapter: 'СКРЫТАЯ ИСТОРИЯ', type: 'gate', gateIndex: 4, compact: true,
    description: 'Четвёртые ворота — коллекция собрана. Теперь отдельные входы складываются в образ целой заводской территории.',
    art: 'museum', theme: 'ВХОД / ОТКРЫТИЕ', x: 83.482, y: 19.559, labelX: 80.357, labelY: 13.423, markerOffset: [0, 0], minutes: 1, route: [[71.161, 21.668], [83.482, 21.668]]
  },
  {
    id: 16, title: 'Остатки древней плотины Исетского пруда с фрагментами в местах нахождения водосбросов', shortTitle: 'Остатки древней плотины', storyTitle: 'Остатки древней плотины',
    chapterNumber: 6, chapter: 'СКРЫТАЯ ИСТОРИЯ', type: 'final',
    description: 'Последняя историческая остановка возвращает нас к воде. На схеме отмечены остатки древней плотины Исетского пруда и фрагменты в местах водосбросов. Здесь отдельные находки складываются в общую историю: плотина, завод, город.',
    art: 'water', theme: 'НАЧАЛО / ПРОДОЛЖЕНИЕ', x: 93.571, y: 23.778, labelX: 90.625, labelY: 31.64, markerOffset: [0, 0], minutes: 2, route: [[83.482, 21.668], [87.768, 21.668], [87.768, 26.27], [93.571, 26.27]],
    finale: {
      sequence: ['1723', 'Плотина', 'Завод', 'Город', 'Екатеринбург', '2026'],
      text: 'Город меняется уже больше трёхсот лет. Теперь история Плотинки продолжается вместе с нами.'
    }
  }
].map(point => ({ image: '', imagePath: `./assets/points/${String(point.id).padStart(2, '0')}.jpg`, hint: '', mascotText: '', ...point }));

// The supplied SVG is preserved unchanged; the base extracts its plan without the static legend/numbers.
const mapConfig = {
  image: './assets/plotinka-map-base.svg',
  referencePath: './assets/plotinka-map-reference.svg',
  referenceReady: true,
  width: 1120,
  height: 1043
};
const mediaConfig = { mascot: '', mascotPath: './assets/mascot.png' };
const chapterCount = new Set(points.map(point => point.chapterNumber)).size;
const gateCount = points.filter(point => point.type === 'gate').length;
const modernIdeas = ['Сцена', 'Арт-пространства', 'Зоны отдыха', 'Творческие активности', 'Современное искусство', 'Новые общественные пространства'];

const states = {
  intro: { kind: 'intro', next: `point${points[0].id}` },
  modern: { kind: 'modern', next: 'finish' },
  finish: { kind: 'finish', next: 'intro' }
};
points.forEach((point, index) => {
  const following = index < points.length - 1 ? `route${points[index + 1].id}` : 'modern';
  states[`point${point.id}`] = { kind: 'point', index, next: point.type === 'final' ? `finale${point.id}` : following };
  if (index > 0) states[`route${point.id}`] = { kind: 'route', index, next: `point${point.id}` };
  if (point.type === 'final') states[`finale${point.id}`] = { kind: 'finale', index, next: following };
});

const app = document.getElementById('app');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let state = 'intro';
let transitioning = false;
const visited = new Set();
const foundGates = new Set();
const discoveries = new Set();

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
function number(value) { return String(value).padStart(2, '0'); }
function svgPosition(x, y) { return [x * mapConfig.width / 100, y * mapConfig.height / 100]; }
function routePath(index) {
  const point = points[index];
  const previous = points[index - 1];
  return [[previous.x, previous.y], ...point.route, [point.x, point.y]].map(([x, y], i) => `${i ? 'L' : 'M'}${svgPosition(x,y).join(' ')}`).join(' ');
}

function mapMarkup(completed, active, drawRoute = false) {
  const finished = completed === points.length;
  const location = completed > 0 ? points[completed - 1] : points[0];
  const unit = Math.min(mapConfig.width, mapConfig.height) / 620;
  const mapSummary = points.map((p, i) => `${p.id}. ${p.shortTitle}: ${i < completed ? 'пройдено' : i === active ? 'текущая цель' : 'впереди'}`).join('. ');
  const routes = points.slice(1).map((point, offset) => {
    const index = offset + 1;
    if (!finished && index > active) return '';
    return `<path class="route-segment${drawRoute && index === active ? ' route-segment--new' : !finished ? ' route-segment--past' : ''}" data-route="${points[index-1].id}-${point.id}" pathLength="1" d="${routePath(index)}" style="stroke-width:${5*unit}"/>`;
  }).join('');
  const nodes = points.map((point, index) => {
    const done = index < completed;
    const current = !done && index === active;
    const [anchorX,anchorY] = svgPosition(point.x, point.y);
    const [dx,dy] = point.markerOffset || [0,0];
    const [x,y] = svgPosition(point.x + dx, point.y + dy);
    const radius = (current ? 22 : 19) * unit;
    return `<g class="map-node ${done ? 'map-node--done' : current ? 'map-node--active' : 'map-node--upcoming'}" data-point="${point.id}" data-status="${done ? 'visited' : current ? 'current' : 'upcoming'}">
      <title>${point.id}. ${escapeHTML(point.title)}</title>
      ${dx || dy ? `<path class="marker-leader" d="M${anchorX} ${anchorY} L${x} ${y}"/><circle class="marker-anchor" cx="${anchorX}" cy="${anchorY}" r="${3*unit}"/>` : ''}
      ${current ? `<circle class="node-halo" cx="${x}" cy="${y}" r="${30*unit}"/>` : ''}
      <circle class="node-disc" cx="${x}" cy="${y}" r="${radius}"/>
      ${done ? `<path d="M${x-7*unit} ${y} l${5*unit} ${6*unit} ${11*unit} ${-12*unit}" fill="none" stroke="#26392d" stroke-width="${3*unit}" stroke-linecap="round" stroke-linejoin="round"/>` : `<text class="node-number" x="${x}" y="${y}" style="font-size:${19*unit}px">${point.id}</text>`}
    </g>`;
  }).join('');
  const [labelX,labelY] = svgPosition(location.labelX, location.labelY);
  const crop = mapConfig.crop;
  const imageStyle = crop ? `width:${mapConfig.sourceWidth/crop.width*100}%;height:${mapConfig.sourceHeight/crop.height*100}%;left:${-crop.x/crop.width*100}%;top:${-crop.y/crop.height*100}%;` : '';
  return `<div class="map-panel">
    <div class="map-toolbar"><span>${mapConfig.referenceReady ? 'ИСТОРИЧЕСКАЯ СХЕМА' : 'ВРЕМЕННАЯ СХЕМА'}</span><button type="button" class="map-zoom" data-action="zoom" aria-pressed="false">Крупнее <span aria-hidden="true">＋</span></button></div>
    <div class="map-frame map-viewport" style="--map-ratio:${mapConfig.width}/${mapConfig.height}" tabindex="0" aria-label="Карта маршрута; используйте кнопку Крупнее для увеличения">
      <div class="map-canvas" style="aspect-ratio:${mapConfig.width}/${mapConfig.height}">
        <img class="map-base" style="${imageStyle}" src="${mapConfig.image}" width="${mapConfig.sourceWidth || mapConfig.width}" height="${mapConfig.sourceHeight || mapConfig.height}" alt="${mapConfig.referenceReady ? 'Историческая схема ансамбля Екатеринбургского завода' : 'Временная условная схема территории'}">
        <svg class="map-svg map-overlay" viewBox="0 0 ${mapConfig.width} ${mapConfig.height}" role="img" aria-labelledby="map-title map-desc">
          <title id="map-title">${points.length} объектов маршрута</title><desc id="map-desc">${escapeHTML(mapSummary)}. Схема не предназначена для точной навигации.</desc>
          ${routes}${nodes}
          ${!finished ? `<g transform="translate(${labelX},${labelY})" aria-hidden="true"><rect class="you-label" x="${-53*unit}" y="${-11*unit}" width="${106*unit}" height="${24*unit}" rx="${12*unit}"/><text class="you-text" y="${5*unit}" style="font-size:${14*unit}px">Вы здесь</text></g>` : ''}
        </svg>
      </div>
    </div>
    <div class="map-legend"><span><i class="legend-visited"></i>Пройдено</span><span><i class="legend-current"></i>Цель</span><span><i class="legend-upcoming"></i>Впереди</span></div>
    <p class="map-disclaimer">${mapConfig.referenceReady ? 'По исторической схеме. Положение точек и путь приблизительные.' : 'Временное расположение объектов. Для привязки нужна историческая схема.'}</p>
  </div>`;
}

function progressMarkup(index) {
  return `<div class="route-progress"><div class="progress-label"><span>${number(index+1)} / ${number(points.length)}</span><span>Глава ${points[index].chapterNumber} / ${chapterCount}</span></div><div class="progress-track" role="progressbar" aria-label="Прогресс прогулки" aria-valuemin="0" aria-valuemax="${points.length}" aria-valuenow="${index+1}"><span style="width:${(index+1)/points.length*100}%"></span></div></div>`;
}
function gateMarkup() {
  if (!foundGates.size) return '';
  return `<aside class="gate-collection" aria-label="Ворота: ${foundGates.size} из ${gateCount} найдено"><div><strong>ВОРОТА</strong><span class="gate-dots" aria-hidden="true">${points.filter(p=>p.type==='gate').map(p=>`<i class="${foundGates.has(p.id)?'found':''}"></i>`).join('')}</span></div><span class="gate-total">${foundGates.size} / ${gateCount} найдено</span></aside>`;
}
function hintMarkup(point) {
  return point.hint ? `<aside class="story-hint"><p class="eyebrow">${escapeHTML(point.hintTitle || 'ОБРАТИ ВНИМАНИЕ')}</p><p>${escapeHTML(point.hint)}</p></aside>` : '';
}
function mascotMarkup(point) {
  if (!point.mascotText) return '';
  return `<aside class="mascot-note">${mediaConfig.mascot ? `<img hidden data-optional-image src="${escapeHTML(mediaConfig.mascot)}" alt="Маскот-рассказчик" width="56" height="56">` : ''}<p>${escapeHTML(point.mascotText)}</p></aside>`;
}
function artMarkup(point) {
  return `<div class="story-art story-art--${point.art}" role="img" aria-label="${point.image ? escapeHTML(point.title) : 'Визуальный эскиз: '+escapeHTML(point.shortTitle)}">
    <div class="art-topline" aria-hidden="true"><span>${escapeHTML(point.theme)}</span><span>ПЛОТИНКА</span></div>
    <span class="art-number" aria-hidden="true">${number(point.id)}</span><span class="art-caption" aria-hidden="true">ВИЗУАЛЬНЫЙ ЭСКИЗ</span>
    ${point.image ? `<img hidden class="story-image" data-optional-image src="${escapeHTML(point.image)}" alt="${escapeHTML(point.title)}">` : ''}
  </div>`;
}
function bindOptionalImages() {
  app.querySelectorAll('[data-optional-image]').forEach(image => {
    const show = () => { image.hidden = false; image.closest('.story-art')?.classList.add('has-photo'); };
    const fallback = () => { image.remove(); };
    image.addEventListener('load',show,{once:true});
    image.addEventListener('error',fallback,{once:true});
    if (image.complete) { if (image.naturalWidth) show(); else fallback(); }
  });
}
function buttonMarkup(label, note = '', action = 'next') {
  return `<div class="actions"><button class="primary-button" type="button" data-action="${action}"><span>${escapeHTML(label)}</span><span class="arrow" aria-hidden="true">↗</span></button>${note ? `<p class="action-note">${escapeHTML(note)}</p>` : ''}</div>`;
}
function screenMarkup(className, copy, visual, actions) {
  return `<section class="screen ${className}" aria-labelledby="screen-title"><div class="screen-copy">${copy}</div><div class="visual">${visual}</div>${actions}</section>`;
}
function chapterMarkup(point) {
  return `<p class="eyebrow chapter-eyebrow"><span>ГЛАВА ${point.chapterNumber} / ${chapterCount}</span>${escapeHTML(point.chapter)}</p>`;
}
function renderPoint(current) {
  const point = points[current.index];
  const finding = point.type === 'find' && !discoveries.has(point.id);
  const title = finding ? point.prompt : point.storyTitle || point.title;
  const story = finding ? '<p class="description">Посмотри вокруг. Когда заметишь остатки стены, открой историю этого места.</p>' : `<p class="description"${point.type==='find'?' role="status"':''}>${escapeHTML(point.description)}</p>`;
  const sequence = point.storySequence ? `<ol class="meaning-sequence">${point.storySequence.map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ol>` : '';
  const copy = `${chapterMarkup(point)}<p class="point-id">ОБЪЕКТ ${number(point.id)}</p><h1 id="screen-title" tabindex="-1">${escapeHTML(title)}</h1>${story}${!finding?sequence:''}${hintMarkup(point)}${!finding?mascotMarkup(point):''}${progressMarkup(current.index)}${gateMarkup()}`;
  const label = finding ? 'Нашёл' : point.actionLabel || (point.type === 'final' ? 'От истории — к сегодняшнему дню' : point.compact ? 'Продолжить' : 'Продолжить маршрут');
  return screenMarkup(`point-screen point-type-${point.type}${point.compact?' compact-point':''}${point.art==='grotto'?' hidden-history':''}`,copy,artMarkup(point),buttonMarkup(label,'',finding?'discover':'next'));
}

const renderers = {
  intro: () => screenMarkup('intro-screen', `<p class="eyebrow">ИСТОРИЧЕСКИЙ СКВЕР / ЕКБ</p><h1 id="screen-title" class="intro-title" tabindex="-1">Плотинка</h1><p class="subtitle">История города<br>прямо под твоими ногами</p><div class="meta"><span class="pill pill--accent"><span class="pill-dot" aria-hidden="true"></span>${points.length} объектов</span><span class="pill">≈ 30–40 минут</span></div>`,mapMarkup(0,0),buttonMarkup('Начать прогулку','Шесть глав. Одна история города.')),
  point: renderPoint,
  route: current => {
    const point = points[current.index];
    return screenMarkup('route-screen',`${chapterMarkup(point)}<p class="point-id">СЛЕДУЮЩАЯ ОСТАНОВКА / ${number(point.id)}</p><h1 id="screen-title" tabindex="-1">${escapeHTML(point.shortTitle)}</h1><div class="meta"><span class="pill pill--accent">${number(points[current.index-1].id)} → ${number(point.id)}</span><span class="pill">≈ ${point.minutes} мин пешком</span></div><p class="description">Следуйте по отмеченному маршруту.</p>${gateMarkup()}`,mapMarkup(visited.size,current.index,true),buttonMarkup('Я на месте','Схема прогулки. Ориентируйтесь на доступные дорожки.'));
  },
  finale: current => {
    const finale = points[current.index].finale;
    return screenMarkup('finale-screen',`<p class="eyebrow">ИСТОРИЯ ПРОДОЛЖАЕТСЯ</p><h1 id="screen-title" tabindex="-1">От плотины<br>до города</h1><p class="description">${escapeHTML(finale.text)}</p>`,`<ol class="history-sequence" aria-label="История города">${finale.sequence.map((word,index)=>`<li style="--step:${index}">${escapeHTML(word)}</li>`).join('')}</ol>`,buttonMarkup('Посмотреть Плотинку сегодня'));
  },
  modern: () => screenMarkup('modern-screen',`<p class="eyebrow">СЛЕДУЮЩАЯ ГЛАВА / СЕГОДНЯ</p><h1 id="screen-title" tabindex="-1">Современная Плотинка</h1><p class="description">Историческое место может стать пространством новых встреч и идей. Это демонстрация будущего раздела: ниже — направления, которые предстоит наполнить проектами.</p>`,`<div class="modern-ideas"><p class="eyebrow">ИДЕИ ДЛЯ ПРОДОЛЖЕНИЯ</p><ul>${modernIdeas.map((idea,i)=>`<li><span>${number(i+1)}</span>${idea}</li>`).join('')}</ul></div>`,buttonMarkup('Завершить прогулку')),
  finish: () => screenMarkup('finish-screen',`<p class="eyebrow">МАРШРУТ ПРОЙДЕН</p><h1 id="screen-title" class="finish-title" tabindex="-1">Прогулка<br>завершена</h1><div class="finish-count"><strong>${visited.size} / ${points.length}</strong><span>объектов</span></div><p class="description">Все точки маршрута пройдены. История Плотинки продолжается вместе с нами.</p>${gateMarkup()}`,mapMarkup(visited.size,points.length-1),buttonMarkup('Пройти ещё раз'))
};

function render(moveFocus = false) {
  const current = states[state];
  app.innerHTML = renderers[current.kind](current);
  app.dataset.state = state;
  app.setAttribute('aria-busy','false');
  document.getElementById('footer-count').textContent = `ДЕМО / ${number(points.length)} ОБЪЕКТОВ`;
  bindOptionalImages();
  if (moveFocus) {
    document.getElementById('screen-title').focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
  }
}
function resetWalk() { visited.clear(); foundGates.clear(); discoveries.clear(); }
function enterState(next) {
  state = next;
  const current = states[state];
  if (state === 'intro') resetWalk();
  if (current.kind === 'point' && points[current.index].type === 'gate') foundGates.add(points[current.index].id);
}
function transitionTo(next) {
  transitioning = true;
  app.setAttribute('aria-busy','true');
  app.querySelectorAll('button').forEach(button=>{button.disabled=true;});
  app.querySelector('.screen').classList.add('is-leaving');
  window.setTimeout(()=>{
    enterState(next);
    render(true);
    transitioning=false;
  },reduceMotion.matches?0:180);
}
app.addEventListener('click',event=>{
  const button=event.target.closest('[data-action]');
  if (!button || transitioning) return;
  const current=states[state];
  if (button.dataset.action==='zoom') {
    const viewport=app.querySelector('.map-viewport');
    const enlarged=viewport.classList.toggle('is-zoomed');
    button.setAttribute('aria-pressed',String(enlarged));
    button.innerHTML=enlarged?'Вся схема <span aria-hidden="true">−</span>':'Крупнее <span aria-hidden="true">＋</span>';
    if(enlarged) {
      const active=app.querySelector('.map-node--active') || app.querySelector('.map-node');
      const point=points.find(p=>String(p.id)===active?.dataset.point);
      if(point){viewport.scrollLeft=viewport.scrollWidth*point.x/100-viewport.clientWidth/2;viewport.scrollTop=viewport.scrollHeight*point.y/100-viewport.clientHeight/2;}
    } else { viewport.scrollLeft=0;viewport.scrollTop=0; }
    return;
  }
  if (button.dataset.action==='discover' && current.kind==='point') {
    discoveries.add(points[current.index].id);
    render(true);
    return;
  }
  if(current.kind==='point') {
    const point=points[current.index];
    if(point.type==='find'&&!discoveries.has(point.id))return;
    visited.add(point.id);
  }
  transitionTo(current.next);
});
render();
