// ---------------------------------------------------------
// Collection page: category tabs, filters and sorting.
//
// Everything is rendered by Astro; this script only shows/hides
// and reorders the cards. The current state lives in the URL
// (?category=outlaw&finish=distressed&details=skull&sort=name)
// so any filtered view can be bookmarked or shared.
// ---------------------------------------------------------
const shop = document.querySelector('[data-shop]');

if (shop) {
  const grid = shop.querySelector('[data-grid]');
  const items = [...grid.querySelectorAll('.shop__item')];
  const tabs = [...shop.querySelectorAll('.shop__tab')];
  const checkboxes = [...shop.querySelectorAll('.filter-option input')];
  const sortSelect = shop.querySelector('select[name="sort"]');
  const chips = shop.querySelector('[data-chips]');
  const empty = shop.querySelector('[data-empty]');
  const blurb = shop.querySelector('.shop__blurb');
  const panel = shop.querySelector('.shop__filters');
  const openButton = shop.querySelector('[data-filters-open]');
  const activeBadge = shop.querySelector('[data-active-count]');

  // --- State <-> URL ---------------------------------------
  const readState = () => {
    const params = new URLSearchParams(location.search);
    const list = (key) => (params.get(key) || '').split(',').filter(Boolean);
    return {
      category: params.get('category') || '',
      finish: list('finish'),
      details: list('details'),
      sort: params.get('sort') || '',
    };
  };

  const writeState = (state) => {
    const params = new URLSearchParams();
    if (state.category) params.set('category', state.category);
    if (state.finish.length) params.set('finish', state.finish.join(','));
    if (state.details.length) params.set('details', state.details.join(','));
    if (state.sort) params.set('sort', state.sort);
    const query = params.toString();
    history.replaceState(null, '', query ? `?${query}` : location.pathname);
  };

  let state = readState();

  // --- Matching --------------------------------------------
  // Within a group it's "any of" (skull OR python);
  // between groups it's "and" (outlaw AND distressed).
  const matches = (item, s, ignore) => {
    const d = item.dataset;
    if (s.category && d.category !== s.category) return false;
    if (ignore !== 'finish' && s.finish.length && !s.finish.includes(d.finish)) return false;
    if (ignore !== 'details' && s.details.length) {
      const itemDetails = d.details.split(' ');
      if (!s.details.some((x) => itemDetails.includes(x))) return false;
    }
    return true;
  };

  // --- Render ----------------------------------------------
  const render = () => {
    // Tabs
    tabs.forEach((tab) => {
      const active = tab.dataset.category === state.category;
      tab.toggleAttribute('aria-current', active);
      if (active) tab.setAttribute('aria-current', 'page');
    });
    const activeTab = tabs.find((t) => t.dataset.category === state.category);
    blurb.textContent = activeTab?.dataset.blurb || blurb.dataset.blurbDefault;

    // Checkboxes
    checkboxes.forEach((box) => {
      box.checked = state[box.name].includes(box.value);
    });
    sortSelect.value = state.sort;

    // Show / hide cards, with a short fade for ones that come back
    let shown = 0;
    items.forEach((item) => {
      const visible = matches(item, state);
      if (visible && item.hidden) {
        item.classList.remove('is-entering');
        void item.offsetWidth;            // restart the animation
        item.classList.add('is-entering');
      }
      item.hidden = !visible;
      if (visible) shown++;
    });

    // Sort by moving the elements into the new order
    const sorted = [...items].sort((a, b) => {
      if (state.sort === 'name') return a.dataset.name.localeCompare(b.dataset.name);
      if (state.sort === 'name-desc') return b.dataset.name.localeCompare(a.dataset.name);
      return a.dataset.number.localeCompare(b.dataset.number);
    });
    sorted.forEach((item) => grid.append(item));

    // Counts next to each option: how many you'd get if you ticked it
    shop.querySelectorAll('[data-count-for]').forEach((el) => {
      const [group, value] = el.dataset.countFor.split(':');
      const n = items.filter((item) => {
        if (!matches(item, state, group)) return false;
        return group === 'finish'
          ? item.dataset.finish === value
          : item.dataset.details.split(' ').includes(value);
      }).length;
      el.textContent = n;
      el.closest('.filter-option').classList.toggle('is-empty', n === 0);
    });

    shop.querySelectorAll('[data-result-count]').forEach((el) => (el.textContent = shown));
    empty.hidden = shown > 0;

    // Active filter chips
    const active = [
      ...state.finish.map((v) => ['finish', v]),
      ...state.details.map((v) => ['details', v]),
    ];
    chips.innerHTML = '';
    active.forEach(([group, value]) => {
      const label = checkboxes.find((b) => b.name === group && b.value === value)
        ?.closest('.filter-option').querySelector('.filter-option__label').textContent;
      const li = document.createElement('li');
      li.innerHTML = `<button type="button" class="shop__chip">${label} <span aria-hidden="true">&times;</span></button>`;
      li.querySelector('button').setAttribute('aria-label', `Remove filter: ${label}`);
      li.querySelector('button').addEventListener('click', () => {
        state[group] = state[group].filter((v) => v !== value);
        update();
      });
      chips.append(li);
    });
    activeBadge.hidden = active.length === 0;
    activeBadge.textContent = active.length;
  };

  const update = () => {
    writeState(state);
    render();
  };

  // --- Events ----------------------------------------------
  tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      state.category = tab.dataset.category;
      update();
    });
  });

  checkboxes.forEach((box) => {
    box.addEventListener('change', () => {
      const group = state[box.name];
      state[box.name] = box.checked ? [...group, box.value] : group.filter((v) => v !== box.value);
      update();
    });
  });

  sortSelect.addEventListener('change', () => {
    state.sort = sortSelect.value;
    update();
  });

  shop.querySelectorAll('[data-clear]').forEach((button) => {
    button.addEventListener('click', () => {
      state = { ...state, finish: [], details: [] };
      update();
    });
  });

  // --- Mobile filter panel ---------------------------------
  const openPanel = () => {
    panel.classList.add('is-open');
    shop.classList.add('filters-open');
    openButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closePanel = () => {
    panel.classList.remove('is-open');
    shop.classList.remove('filters-open');
    openButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  openButton.addEventListener('click', openPanel);
  shop.querySelectorAll('[data-filters-close]').forEach((el) => el.addEventListener('click', closePanel));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePanel();
  });

  render();
}
