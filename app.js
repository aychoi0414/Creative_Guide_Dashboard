(function () {
  'use strict';

  const DATA = window.GUIDE_DATA;
  const STORAGE_KEY = 'creative-guide-cart-v1';
  const TYPE_LABEL = { text: '텍스트', image: '이미지', video: '동영상', logo: '로고', html5: 'HTML5', etc: '기타' };
  // 묶음 선택 단위 (로고는 이미지 묶음, HTML5·기타는 기타 묶음)
  const GROUPS = [
    { id: 'text', label: '텍스트', types: ['text'] },
    { id: 'image', label: '이미지', types: ['image', 'logo'] },
    { id: 'video', label: '동영상', types: ['video'] },
    { id: 'etc', label: '기타', types: ['html5', 'etc'] }
  ];
  const STATUS_LABEL ={ ok: '확인', partial: '일부 확인', missing: '미확인 · PDF 확인 필요' };

  // ---------- 데이터 색인 ----------
  // 키 = 매체id/상품id/항목id
  const index = new Map();
  DATA.media.forEach(m => m.products.forEach(p => p.items.forEach(it => {
    index.set(`${m.id}/${p.id}/${it.id}`, { media: m, product: p, item: it });
  })));

  // ---------- 장바구니 (브라우저에만 저장) ----------
  let cart = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    saved.forEach(k => { if (index.has(k)) cart.add(k); });
  } catch (e) { /* 저장소를 못 쓰면 빈 장바구니로 시작 */ }
  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...cart])); } catch (e) { /* 무시 */ }
  }

  let currentMediaId = DATA.media[0].id;
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  $('checkedAt').textContent = `매체별 공식 가이드 기준 · 최종 확인일 ${DATA.checkedAt} · 담은 항목만 엑셀(또는 구글 시트)로 받을 수 있어요`;
  let query = '';

  const ICON = {
    text: '<path d="M4 6h16M4 12h10M4 18h7"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    video: '<rect x="3" y="5" width="14" height="14" rx="3"/><path d="m17 10 4-2v8l-4-2"/>',
    etc: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>'
  };
  function renderStats() {
    const all = [...cart].map(k => index.get(k).item.type);
    $('stats').innerHTML = GROUPS.map(g => {
      const n = all.filter(t => g.types.includes(t)).length;
      const products = new Set([...cart].filter(k => g.types.includes(index.get(k).item.type)).map(k => k.split('/').slice(0, 2).join('/'))).size;
      return `<div class="stat ${g.id}">
        <div class="ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON[g.id]}</svg></div>
        <div><div class="label">${g.label}</div><div class="num">${n}</div>
        <div class="sub">${n ? `${products}개 상품에서 담음` : '아직 없음'}</div></div></div>`;
    }).join('');
  }
  $('search').addEventListener('input', e => { query = e.target.value.trim().toLowerCase(); renderContent(); });
  const matches = it => !query || `${it.name} ${it.spec}`.toLowerCase().includes(query);

  // ---------- 화면 그리기 ----------
  function renderMediaList() {
    const confirmed = DATA.media.filter(m => m.status !== 'missing');
    const missing = DATA.media.filter(m => m.status === 'missing');
    const btn = m => {
      const n = [...cart].filter(k => k.startsWith(m.id + '/')).length;
      return `<button data-media="${m.id}" class="${m.id === currentMediaId ? 'active' : ''}">
        <span style="display:flex;gap:8px;align-items:center"><span class="dot ${m.status}"></span>${esc(m.name)}</span>
        ${n ? `<small>${n}</small>` : ''}</button>`;
    };
    $('mediaList').innerHTML =
      `<div class="group-label">가이드 확인됨</div>${confirmed.map(btn).join('')}` +
      `<div class="group-label">미확인 (PDF로 추가 예정)</div>${missing.map(btn).join('')}`;
  }

  function renderContent() {
    const m = DATA.media.find(x => x.id === currentMediaId);
    let html = `<div class="media-head"><h2>${esc(m.name)}</h2>
      <span class="badge ${m.status}">${STATUS_LABEL[m.status]}</span>
      ${m.checkedAt ? `<span class="note">확인일 ${m.checkedAt}</span>` : ''}</div>`;
    if (m.note) html += `<p class="note">※ ${esc(m.note)}</p>`;

    if (!m.products.length) {
      html += `<div class="empty">아직 확인된 공식 규격이 없습니다.<br>드라이브의 PDF를 확인한 뒤 <b>guide-data.js</b>에 추가하면 여기에 나타납니다.</div>`;
    }
    let shown = 0;
    m.products.forEach(p => {
      if (!p.items.some(matches)) return;
      shown++;
      const keys = p.items.map(it => `${m.id}/${p.id}/${it.id}`);
      const allIn = keys.every(k => cart.has(k));
      html += `<section class="product">
        <div class="product-head">
          <div><h3>${esc(p.name)}</h3>
            <a href="${esc(p.source.url)}" target="_blank" rel="noopener">출처: ${esc(p.source.label)} ↗</a></div>
          <button class="btn" data-toggle-product="${m.id}/${p.id}">${allIn ? '전체 빼기' : '전체 담기'}</button>
        </div>
        <table><thead><tr><th></th><th>유형</th><th>항목</th><th>규격</th></tr></thead>
        ${GROUPS.map(g => {
          const items = p.items.filter(it => g.types.includes(it.type) && matches(it));
          if (!items.length) return '';
          const gKeys = items.map(it => `${m.id}/${p.id}/${it.id}`);
          const n = gKeys.filter(k => cart.has(k)).length;
          const state = n === 0 ? '' : n === gKeys.length ? 'checked' : 'data-partial="1"';
          return `<tbody class="type-group">
            <tr class="group-row"><td class="check"><input type="checkbox" data-group="${m.id}/${p.id}/${g.id}" ${state} aria-label="${g.label} 묶음 담기"></td>
              <td colspan="3"><b>${g.label}</b> <span class="note">${items.length}개 항목 · ${n ? `${n}개 담음` : '체크하면 묶음으로 담기'}</span></td></tr>
            ${items.map(it => {
              const k = `${m.id}/${p.id}/${it.id}`;
              return `<tr class="${cart.has(k) ? 'in-cart' : ''}">
                <td class="check"><input type="checkbox" data-key="${k}" ${cart.has(k) ? 'checked' : ''} aria-label="${esc(it.name)} 담기"></td>
                <td class="type"><span class="type-tag ${it.type}">${TYPE_LABEL[it.type]}</span></td>
                <td class="name"><div class="name-wrap">${thumbHtml(k, it)}<span>${esc(it.name)}</span></div></td>
                <td class="spec">${esc(it.spec)}</td></tr>`;
            }).join('')}</tbody>`;
        }).join('')}
        </table></section>`;
    });
    if (m.products.length && !shown) html += `<div class="empty">‘${esc(query)}’ 검색 결과가 없습니다.</div>`;
    $('content').innerHTML = html;
    // 일부만 담긴 묶음은 '−' 표시
    $('content').querySelectorAll('[data-partial]').forEach(el => { el.indeterminate = true; });
  }

  function renderCart() {
    $('cartCount').textContent = cart.size;
    if (!cart.size) {
      $('cartBody').innerHTML = `<p class="note" style="padding:16px 0">왼쪽에서 필요한 항목을 체크해 담아 주세요.</p>`;
    } else {
      const groups = new Map();
      [...cart].forEach(k => {
        const { media, product } = index.get(k);
        const g = `${media.name} · ${product.name}`;
        if (!groups.has(g)) groups.set(g, []);
        groups.get(g).push(k);
      });
      $('cartBody').innerHTML = [...groups].map(([title, keys]) => `
        <div class="cart-group"><div class="cart-group-title">${esc(title)}</div>
        ${keys.map(k => { const { item } = index.get(k); return `
          <div class="cart-item"><span>${esc(item.name)} <small class="type-tag ${item.type}">${TYPE_LABEL[item.type]}</small></span>
          <button data-remove="${k}" title="빼기">×</button></div>`; }).join('')}
        </div>`).join('');
    }
    $('exportExcel').disabled = $('exportSheets').disabled = !cart.size;
  }

  function renderAll() { renderMediaList(); renderContent(); renderCart(); renderStats(); saveCart(); }

  // ---------- 이벤트 ----------
  $('mediaList').addEventListener('click', e => {
    const b = e.target.closest('[data-media]');
    if (b) { currentMediaId = b.dataset.media; renderAll(); }
  });
  $('content').addEventListener('change', e => {
    const k = e.target.dataset.key;
    const grp = e.target.dataset.group;
    if (k) {
      e.target.checked ? cart.add(k) : cart.delete(k);
    } else if (grp) {
      const [mId, pId, gId] = grp.split('/');
      const types = GROUPS.find(g => g.id === gId).types;
      const keys = [...index.entries()]
        .filter(([key, v]) => key.startsWith(`${mId}/${pId}/`) && types.includes(v.item.type))
        .map(([key]) => key);
      const allIn = keys.every(x => cart.has(x));
      keys.forEach(x => allIn ? cart.delete(x) : cart.add(x));
    } else return;
    renderAll();
  });
  $('content').addEventListener('click', e => {
    const b = e.target.closest('[data-toggle-product]');
    if (!b) return;
    const keys = [...index.keys()].filter(k => k.startsWith(b.dataset.toggleProduct + '/'));
    const allIn = keys.every(k => cart.has(k));
    keys.forEach(k => allIn ? cart.delete(k) : cart.add(k));
    renderAll();
  });
  $('cartBody').addEventListener('click', e => {
    const b = e.target.closest('[data-remove]');
    if (b) { cart.delete(b.dataset.remove); renderAll(); }
  });
  $('clearCart').addEventListener('click', () => { cart.clear(); renderAll(); });
  $('exportExcel').addEventListener('click', () => exportWorkbook());
  $('exportSheets').addEventListener('click', async () => {
    const drive = window.open('https://drive.google.com/drive/my-drive', '_blank', 'noopener');
    await exportWorkbook();
    $('sheetsModal').classList.add('show');
    if (!drive) $('sheetsModal').querySelector('ol li').innerHTML =
      '<a href="https://drive.google.com/drive/my-drive" target="_blank" rel="noopener">구글 드라이브</a>를 열고 내려받은 <b>.xlsx 파일</b>을 끌어다 놓기';
  });
  $('closeModal').addEventListener('click', () => $('sheetsModal').classList.remove('show'));

  // ---------- 참고 그림 (비율 미리보기) ----------
  // 항목 이름의 비율(예: 1.91:1, 9:16) 또는 규격의 크기(예: 1200×628)로 비율 상자를 그린다.
  // 실제 수치를 바꾸지 않고, 원문에 적힌 비율·크기만 그대로 그림으로 옮긴다.
  function shapesOf(it) {
    if (!['image', 'video', 'logo'].includes(it.type)) return [];
    const ratios = [...it.name.matchAll(/(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)/g)]
      .map(r => ({ w: +r[1], h: +r[2], label: `${r[1]}:${r[2]}` }));
    const dims = [...it.spec.matchAll(/(\d{2,4})×(\d{2,4})/g)].map(d => ({ w: +d[1], h: +d[2], label: `${d[1]}×${d[2]}` }));
    if (ratios.length) {
      // 비율과 같은 첫 크기를 찾아 함께 표기
      return ratios.map(r => {
        const d = dims.find(x => Math.abs(x.w / x.h - r.w / r.h) < 0.02);
        return { ...r, size: d ? d.label : '' };
      });
    }
    const uniq = [];
    dims.forEach(d => { if (!uniq.some(u => Math.abs(u.w / u.h - d.w / d.h) < 0.02)) uniq.push({ ...d, size: d.label, label: '' }); });
    return uniq.slice(0, 4);
  }

  function boxSvg(shape, box, opts = {}) {
    const s = Math.min(box / shape.w, box / shape.h);
    const w = shape.w * s, h = shape.h * s, x = (box - w) / 2, y = (box - h) / 2;
    let inner = '';
    if (opts.safe) {
      const z = opts.safe; // 상단·하단·좌우 비율(%)
      inner += `<rect x="${x}" y="${y}" width="${w}" height="${h * z.top / 100}" fill="#e47fa8" opacity=".28"/>
        <rect x="${x}" y="${y + h * (1 - z.bottom / 100)}" width="${w}" height="${h * z.bottom / 100}" fill="#e47fa8" opacity=".28"/>
        <rect x="${x}" y="${y}" width="${w * z.side / 100}" height="${h}" fill="#e47fa8" opacity=".28"/>
        <rect x="${x + w * (1 - z.side / 100)}" y="${y}" width="${w * z.side / 100}" height="${h}" fill="#e47fa8" opacity=".28"/>`;
      if (opts.big) {
        inner += `<text x="${x + w / 2}" y="${y + h * z.top / 200 + 4}" text-anchor="middle" font-size="11" fill="#b23a6c">상단 ${z.top}%</text>
          <text x="${x + w / 2}" y="${y + h * (1 - z.bottom / 200) + 4}" text-anchor="middle" font-size="11" fill="#b23a6c">하단 ${z.bottom}%</text>`;
      }
    }
    const fs = opts.big ? 14 : 8;
    const label = opts.big ? [shape.label, shape.size].filter(Boolean).join(' · ') : (shape.label || shape.size);
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${opts.big ? 8 : 3}" fill="#efecff" stroke="#7b6cf6" stroke-width="${opts.big ? 2 : 1.2}"/>
      ${inner}
      ${opts.video ? `<path d="M${box / 2 - (opts.big ? 9 : 4)} ${box / 2 - (opts.big ? 11 : 5)} l${opts.big ? 22 : 10} ${opts.big ? 11 : 5} l-${opts.big ? 22 : 10} ${opts.big ? 11 : 5}z" fill="#7b6cf6" opacity=".55"/>` : ''}
      ${opts.big || !opts.video ? `<text x="${box / 2}" y="${opts.big ? (opts.video ? box / 2 + 34 : box / 2 + 5) : box / 2 + 3}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="#5b4ed6">${esc(label)}</text>` : ''}`;
  }

  function thumbHtml(key, it) {
    const shapes = shapesOf(it);
    const hasRef = !!it.refImage;
    if (!shapes.length && !hasRef) return '';
    const sh = shapes[0];
    const svg = sh
      ? `<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">${boxSvg(sh, 40, { video: it.type === 'video', safe: it.safeZone })}</svg>`
      : `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7b6cf6" stroke-width="1.8"><rect x="4" y="5" width="16" height="14" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="m20 16-4-4-8 7"/></svg>`;
    return `<button class="thumb" data-preview="${key}" title="참고 그림 크게 보기">${svg}${shapes.length > 1 ? `<i>+${shapes.length - 1}</i>` : ''}${hasRef ? '<em>참고</em>' : ''}</button>`;
  }

  function openPreview(key) {
    const { media, product, item } = index.get(key);
    const shapes = shapesOf(item);
    const size = shapes.length > 2 ? 150 : 200;
    $('previewTitle').textContent = `${media.name} · ${product.name} · ${item.name}`;
    $('previewSpec').textContent = item.spec;
    $('previewShapes').innerHTML = shapes.map(s =>
      `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${boxSvg(s, size, { big: true, video: item.type === 'video', safe: item.safeZone })}</svg>`).join('');
    $('previewSafe').hidden = !item.safeZone;
    if (item.safeZone) $('previewSafe').textContent =
      `분홍 영역 = 세이프 존 (상단 ${item.safeZone.top}% · 하단 ${item.safeZone.bottom}% · 좌우 각 ${item.safeZone.side}%): 텍스트·로고·주요 요소를 두지 않습니다.`;
    $('previewRef').innerHTML = item.refImage
      ? `<img src="${esc(item.refImage)}" alt="${esc(item.name)} 참고 이미지">${item.refNote ? `<p class="note">${esc(item.refNote)}</p>` : ''}`
      : `<p class="note">등록된 참고 이미지가 없습니다. 이미지를 <b>images</b> 폴더에 넣고 guide-data.js 항목에 <code>refImage: 'images/파일명.png'</code>를 적으면 여기에 보입니다.</p>`;
    $('previewModal').classList.add('show');
  }
  $('content').addEventListener('click', e => {
    const b = e.target.closest('[data-preview]');
    if (b) openPreview(b.dataset.preview);
  });
  $('closePreview').addEventListener('click', () => $('previewModal').classList.remove('show'));
  $('previewModal').addEventListener('click', e => { if (e.target.id === 'previewModal') $('previewModal').classList.remove('show'); });

  // ---------- 엑셀 만들기 ----------
  const COLOR = {
    headerBg: 'FF595959', headerFont: 'FFFFFFFF', yellow: 'FFFFFF00',
    product: 'FF1F5FAD', border: 'FFBFBFBF', titleBg: 'FFF2F2F2', overBg: 'FFFFC7CE', overFont: 'FF9C0006'
  };
  const thin = { style: 'thin', color: { argb: COLOR.border } };
  const BORDER = { top: thin, left: thin, bottom: thin, right: thin };
  const CENTER = { vertical: 'middle', horizontal: 'center', wrapText: true };

  function styleRow(row, from, to, extra) {
    for (let c = from; c <= to; c++) {
      const cell = row.getCell(c);
      cell.border = BORDER;
      cell.alignment = cell.alignment || CENTER;
      if (extra) Object.assign(cell, extra);
    }
  }

  // 길이 계산 수식 (엑셀·구글 시트 공통)
  //  byte: 전각(한글 등) 1자 = 2byte, 그 외 1byte  /  자: 글자 수
  function lengthFormula(ref, unit) {
    if (unit === 'byte') {
      return `IF(${ref}="",0,LEN(${ref})+SUMPRODUCT(--(UNICODE(MID(${ref},ROW(INDIRECT("1:"&LEN(${ref}))),1))>255)))`;
    }
    return `LEN(${ref})`;
  }

  function selectedByProduct() {
    // 화면 순서대로 정렬: 매체 → 상품 → 항목
    const out = [];
    DATA.media.forEach(m => m.products.forEach(p => {
      const items = p.items.filter(it => cart.has(`${m.id}/${p.id}/${it.id}`));
      if (items.length) out.push({ media: m, product: p, items });
    }));
    return out;
  }

  function buildTextSheet(wb, groups, addUrlRow) {
    const ws = wb.addWorksheet('디스크립션', { views: [{ showGridLines: false }] });
    ws.columns = [
      { key: 'product', width: 18 }, { key: 'type', width: 22 }, { key: 'no', width: 7 },
      { key: 'limit', width: 11 }, { key: 'desc', width: 70 }, { key: 'len', width: 11 }
    ];
    let r = 1;
    const mediaSeen = new Set();

    groups.forEach(({ media, product, items }) => {
      const textItems = items.filter(it => it.type === 'text');
      if (!textItems.length) return;

      // 매체 제목 줄
      if (!mediaSeen.has(media.id)) {
        if (mediaSeen.size) r++;
        mediaSeen.add(media.id);
        const t = ws.getRow(r);
        t.getCell(1).value = `■ ${media.name}`;
        t.getCell(1).font = { bold: true, size: 13 };
        r++;
      }

      // 머리글 (이미지 양식)
      const unitLabel = textItems.every(it => it.unit === 'byte') ? 'Byte' : '글자 수';
      const head = ws.getRow(r);
      head.values = ['상품', 'Type', 'No.', unitLabel, '디스크립션', unitLabel];
      head.height = 20;
      styleRow(head, 1, 6, {
        font: { bold: true, color: { argb: COLOR.headerFont } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.headerBg } }
      });
      head.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.yellow } };
      head.getCell(6).font = { bold: true, color: { argb: 'FF000000' } };
      r++;

      const productStart = r;
      textItems.forEach(it => {
        const typeStart = r;
        const count = Math.max(1, it.count || 1);
        const limitText = it.limit == null ? '미확인' : `${it.limit}${it.unit === 'byte' ? 'byte' : '자'}`;
        for (let n = 1; n <= count; n++) {
          const row = ws.getRow(r);
          row.getCell(2).value = it.name;
          row.getCell(3).value = n;
          row.getCell(4).value = limitText;
          row.getCell(6).value = { formula: lengthFormula(`E${r}`, it.unit) };
          styleRow(row, 1, 6);
          row.getCell(2).font = { bold: true };
          row.getCell(5).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
          r++;
        }
        if (count > 1) ws.mergeCells(typeStart, 2, r - 1, 2);
        // 제한 초과 시 빨간색
        if (it.limit != null) {
          ws.addConditionalFormatting({
            ref: `F${typeStart}:F${r - 1}`,
            rules: [{
              type: 'expression', formulae: [`$F${typeStart}>${it.limit}`],
              style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: COLOR.overBg } }, font: { color: { argb: COLOR.overFont }, bold: true } }
            }]
          });
        }
      });

      if (addUrlRow) {
        const row = ws.getRow(r);
        row.values = [null, '최종 URL', '-', '-', null, '-'];
        styleRow(row, 1, 6);
        row.getCell(2).font = { bold: true };
        row.getCell(5).alignment = { vertical: 'middle', horizontal: 'left' };
        r++;
      }

      const pc = ws.getCell(productStart, 1);
      pc.value = product.name;
      if (r - 1 > productStart) ws.mergeCells(productStart, 1, r - 1, 1);
      pc.font = { color: { argb: COLOR.product } };
      pc.alignment = CENTER;

      // 출처 줄
      const src = ws.getRow(r);
      src.getCell(1).value = { text: `출처: ${product.source.label} (확인일 ${media.checkedAt || '-'})`, hyperlink: product.source.url };
      src.getCell(1).font = { size: 9, color: { argb: 'FF808080' }, underline: true };
      r += 2;
    });

    const note = ws.getRow(r);
    note.getCell(1).value = 'Byte = 한글 등 전각 1자를 2byte로 계산 · 제한을 넘으면 길이 칸이 빨간색으로 바뀝니다.';
    note.getCell(1).font = { size: 9, color: { argb: 'FF808080' } };
    return ws;
  }

  function buildSpecSheet(wb, groups) {
    const ws = wb.addWorksheet('이미지·영상 규격', { views: [{ state: 'frozen', ySplit: 1, showGridLines: false }] });
    ws.columns = [
      { header: '매체', width: 14 }, { header: '상품', width: 20 }, { header: '유형', width: 9 },
      { header: '항목', width: 26 }, { header: '규격', width: 70 }, { header: '소재 파일명', width: 24 },
      { header: '확인', width: 7 }, { header: '출처', width: 30 }, { header: '확인일', width: 12 }
    ];
    styleRow(ws.getRow(1), 1, 9, {
      font: { bold: true, color: { argb: COLOR.headerFont } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.headerBg } }
    });
    [6, 7].forEach(c => {
      const cell = ws.getRow(1).getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.yellow } };
      cell.font = { bold: true, color: { argb: 'FF000000' } };
    });

    let r = 2;
    groups.forEach(({ media, product, items }) => {
      items.filter(it => it.type !== 'text').forEach(it => {
        const row = ws.getRow(r);
        row.values = [media.name, product.name, TYPE_LABEL[it.type], it.name, it.spec, '', '',
          { text: product.source.label, hyperlink: product.source.url }, media.checkedAt || ''];
        styleRow(row, 1, 9);
        row.getCell(5).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        row.getCell(4).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        row.getCell(8).font = { color: { argb: 'FF1F5FAD' }, underline: true };
        r++;
      });
    });
    if (r > 2) {
      ws.dataValidations.add(`G2:G${r - 1}`, { type: 'list', allowBlank: true, formulae: ['"O,X"'] });
      ws.autoFilter = { from: 'A1', to: `I${r - 1}` };
    }
    return ws;
  }

  async function exportWorkbook() {
    if (!window.ExcelJS) { alert('엑셀 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.'); return; }
    const groups = selectedByProduct();
    const hasText = groups.some(g => g.items.some(it => it.type === 'text'));
    const hasSpec = groups.some(g => g.items.some(it => it.type !== 'text'));

    const wb = new ExcelJS.Workbook();
    wb.creator = '소재 가이드 담기';
    wb.calcProperties.fullCalcOnLoad = true;
    if (hasText) buildTextSheet(wb, groups, $('optUrl').checked);
    if (hasSpec) buildSpecSheet(wb, groups);

    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `소재가이드_${stamp}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // 확인용으로 외부에서 호출할 수 있게 노출
  window.__guideApp = { buildTextSheet, buildSpecSheet, selectedByProduct, cart, renderAll };

  renderAll();
})();
