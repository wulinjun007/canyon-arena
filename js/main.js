/* 峡谷竞技场 · 共享逻辑：顶栏 / 进场 / 英雄详情弹窗 / 图片兜底 */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var IMG = DATA.IMG;

  /* ---------- 图片 URL ---------- */
  window.heroImg = function (id) { return IMG + '/heroimg/' + id + '/' + id + '.jpg'; };
  window.bigskin = function (id, n) { return IMG + '/skin/hero-info/' + id + '/' + id + '-bigskin-' + n + '.jpg'; };
  window.skillIcon = function (id, i) { return IMG + '/heroimg/' + id + '/' + id + ['00', '10', '20', '30'][i] + '.png'; };
  window.itemImg = function (id) { return IMG + '/itemimg/' + id + '.jpg'; };
  window.mingImg = function (id) { return IMG + '/mingwen/' + id + '.png'; };
  window.fallbackPic = function (img, ch) {
    img.onerror = null;
    var d = document.createElement('div');
    d.className = 'pic-fallback';
    d.textContent = ch || '竞';
    img.replaceWith(d);
  };

  /* ---------- 顶栏 ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { header && header.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) toggle.addEventListener('click', function () { nav.classList.toggle('open'); });

  /* ---------- 进场动画 ---------- */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach(function (el) {
    io ? io.observe(el) : el.classList.add('in');
  });

  /* ---------- 英雄详情弹窗 ---------- */
  var MING_COLOR = { '红': 'gold', '蓝': 'cyan', '绿': '' };
  function mingPreset(hero) {
    if (hero.type === '法师') return '法术输出';
    if (hero.type === '坦克' || hero.type === '辅助') return '坦克辅助';
    return '物理输出';
  }
  function skillLabel(i) { return ['被动', '一技能', '二技能', '三技能'][i]; }

  window.openHeroModal = function (id, push) {
    var hero = DATA.heroes.find(function (h) { return h.id === id; });
    if (!hero) return;
    var mask = document.getElementById('heroModal');
    if (!mask) { mask = buildModalShell(); }

    /* 封面 */
    var coverImg = mask.querySelector('.modal-cover img');
    coverImg.classList.remove('cover-fallback');
    coverImg.src = bigskin(hero.id, 1);
    coverImg.onerror = function () { /* 无大皮肤图（新英雄）：退化为头像虚化背景 */
      this.onerror = null; this.classList.add('cover-fallback');
      this.src = heroImg(hero.id);
    };
    mask.querySelector('.modal-title h3').textContent = hero.name;
    mask.querySelector('.modal-title .title-cn').textContent = hero.title;

    var tags = mask.querySelector('.modal-tags');
    tags.innerHTML = '';
    if (hero.isNew) tags.appendChild(chip('新英雄', 'gold'));
    tags.appendChild(chip(hero.type, 'gold'));
    if (hero.type2) tags.appendChild(chip(hero.type2, ''));
    tags.appendChild(chip(hero.lane, 'cyan'));
    tags.appendChild(chip('皮肤 × ' + hero.skins.length, ''));

    /* 皮肤画廊 */
    var main = mask.querySelector('.skin-main img');
    var cap = mask.querySelector('.skin-main figcaption');
    var thumbs = mask.querySelector('.skin-thumbs');
    thumbs.innerHTML = '';
    function setSkin(n) {
      main.onerror = function () { fallbackPic(this, hero.name[0]); };
      main.src = bigskin(hero.id, n);
      cap.textContent = hero.name + ' · ' + (hero.skins[n - 1] ? hero.skins[n - 1].name : '经典');
      thumbs.querySelectorAll('.skin-thumb').forEach(function (t) {
        t.classList.toggle('on', +t.dataset.n === n);
      });
    }
    hero.skins.slice(0, 13).forEach(function (s) {
      var b = document.createElement('button');
      b.className = 'skin-thumb'; b.dataset.n = s.n;
      b.setAttribute('aria-label', s.name);
      var im = document.createElement('img');
      im.loading = 'lazy'; im.alt = s.name; im.src = bigskin(hero.id, s.n);
      im.onerror = function () { b.remove(); };
      b.appendChild(im);
      b.addEventListener('click', function () { setSkin(s.n); });
      thumbs.appendChild(b);
    });
    setSkin(1);

    /* 技能图标 */
    var sk = mask.querySelector('.skills');
    sk.innerHTML = '';
    for (var i = 0; i < 4; i++) {
      (function (i) {
        var d = document.createElement('div'); d.className = 'skill';
        var pic = document.createElement('div'); pic.className = 'skill-pic';
        var im = document.createElement('img'); im.loading = 'lazy'; im.alt = skillLabel(i);
        im.onerror = function () { fallbackPic(this, '技'); };
        im.src = skillIcon(hero.id, i);
        pic.appendChild(im);
        var sp = document.createElement('span'); sp.textContent = skillLabel(i);
        d.appendChild(pic); d.appendChild(sp);
        sk.appendChild(d);
      })(i);
    }

    /* 出装 + 铭文 + 召唤师 */
    var bs = mask.querySelector('.loadout-block .build-strip');
    bs.innerHTML = '';
    DATA.buildItems.forEach(function (iid, idx) {
      var d = document.createElement('div'); d.className = 'build-slot';
      var pic = document.createElement('div'); pic.className = 'build-pic';
      var im = document.createElement('img'); im.loading = 'lazy'; im.alt = '装备' + (idx + 1);
      im.onerror = function () { fallbackPic(this, '装'); };
      im.src = itemImg(iid);
      pic.appendChild(im);
      var sp = document.createElement('span'); sp.textContent = '第' + (idx + 1) + '件';
      d.appendChild(pic); d.appendChild(sp);
      bs.appendChild(d);
    });

    var preset = DATA.mingPresets[mingPreset(hero)];
    var mm = mask.querySelector('.ming-mini');
    mm.innerHTML = '';
    preset.forEach(function (m) {
      var d = document.createElement('div'); d.className = 'm';
      var im = document.createElement('img'); im.loading = 'lazy'; im.alt = m.name;
      im.onerror = function () { fallbackPic(this, '铭'); };
      im.src = mingImg(m.id);
      var t = document.createElement('div');
      t.innerHTML = '<b>' + m.name + '</b><span>' + mingPreset(hero) + '铭文</span>';
      d.appendChild(im); d.appendChild(t);
      mm.appendChild(d);
    });

    var summ = mask.querySelector('.summ-note');
    var summMap = {
      '射手': '<b>闪现</b> 为核心；走位空间小的对局可换 <b>净化</b>。',
      '法师': '<b>闪现</b> 为主流；缺乏位移时 <b>疾跑</b> 提升容错。',
      '刺客': '<b>惩击</b> 打野必带；收割位可考虑 <b>斩杀</b>。',
      '坦克': '<b>闪现</b> 开团或 <b>弱化</b> 保排面，视阵容切换。',
      '辅助': '<b>干扰</b> / <b>弱化</b> 保护核心，游走节奏带 <b>疾跑</b>。',
      '战士': '<b>闪现</b> 通用；对线压制可换 <b>斩杀</b> 收割。'
    };
    summ.innerHTML = summMap[hero.type] || '<b>闪现</b> 通用；按阵容灵活切换。';

    mask.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (push !== false) history.replaceState(null, '', '#h-' + hero.id);
  };

  window.closeHeroModal = function () {
    var mask = document.getElementById('heroModal');
    if (mask) mask.classList.remove('open');
    document.body.style.overflow = '';
    history.replaceState(null, '', location.pathname + location.search);
  };

  function chip(text, cls) {
    var s = document.createElement('span');
    s.className = 'chip' + (cls ? ' ' + cls : '');
    s.textContent = text;
    return s;
  }

  function buildModalShell() {
    var mask = document.createElement('div');
    mask.id = 'heroModal';
    mask.className = 'modal-mask';
    mask.setAttribute('role', 'dialog');
    mask.setAttribute('aria-modal', 'true');
    mask.innerHTML =
      '<div class="modal">' +
      '  <div class="modal-cover"><img alt=""/><button class="modal-close" aria-label="关闭" onclick="closeHeroModal()">✕</button></div>' +
      '  <div class="modal-head">' +
      '    <div class="modal-title"><h3></h3><span class="title-cn"></span></div>' +
      '    <div class="modal-tags"></div>' +
      '  </div>' +
      '  <div class="modal-body">' +
      '    <section><div class="mblock-label">皮肤鉴赏</div>' +
      '      <figure class="skin-main"><img alt=""/><figcaption></figcaption></figure>' +
      '      <div class="skin-thumbs"></div></section>' +
      '    <section><div class="mblock-label">技能</div><div class="skills"></div></section>' +
      '    <section class="loadout">' +
      '      <div class="loadout-block"><div class="mblock-label">推荐出装 · 示例模板</div><div class="build-strip"></div></div>' +
      '      <div class="loadout-block"><div class="mblock-label">铭文推荐</div><div class="ming-mini"></div></div>' +
      '    </section>' +
      '    <section><div class="mblock-label">召唤师技能建议</div><p class="summ-note"></p></section>' +
      '  </div></div>';
    mask.addEventListener('click', function (e) { if (e.target === mask) closeHeroModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeHeroModal(); });
    document.body.appendChild(mask);
    return mask;
  }

  /* ---------- 年份 ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
