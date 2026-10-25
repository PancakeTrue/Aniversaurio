/* ============================================================
   Utilidades
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Guardado en el navegador (si no está disponible, la web igual funciona)
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

const DATA = { cosas: COSAS, razones: RAZONES, metas: METAS, cartas: CARTAS };
const ETIQUETA = { cosas: 'Cosa', razones: 'Razón', metas: 'Meta', cartas: 'Carta' };
const pad = n => String(n).padStart(2, '0');

// Una carta sin texto ni foto está "sellada" y no cuenta para la barra
const disponible = (tipo, item) => tipo !== 'cartas' || !!(item.texto || item.foto);

/* ============================================================
   Progreso (barra de amor)
   ============================================================ */
const visto = new Set(LS.get('aniv_visto', []));
let finCelebrado = LS.get('aniv_fin', false);

const totalItems = () =>
  Object.keys(DATA).reduce((n, t) => n + DATA[t].filter(it => disponible(t, it)).length, 0);

const vistosDe = tipo =>
  DATA[tipo].filter((it, i) => disponible(tipo, it) && visto.has(tipo + '-' + i)).length;

function marcarVisto(tipo, i) {
  if (!disponible(tipo, DATA[tipo][i])) return;
  const id = tipo + '-' + i;
  if (visto.has(id)) return;
  visto.add(id);
  LS.set('aniv_visto', [...visto]);
  $$(`[data-id="${id}"]`).forEach(el => el.classList.add('visto'));
  actualizarBarra(true);
}

function actualizarBarra(permitirFiesta) {
  const total = totalItems();
  const v = Object.keys(DATA).reduce((n, t) => n + vistosDe(t), 0);
  const pct = total ? Math.round((v / total) * 100) : 0;

  $$('.love-fill').forEach(f => { f.style.width = pct + '%'; });
  $$('[data-love-texto]').forEach(t => { t.textContent = `${pct}% · ${v} de ${total}`; });
  $$('.love-bar').forEach(b => b.setAttribute('aria-valuenow', pct));

  $$('[data-badge]').forEach(b => {
    const t = b.dataset.badge;
    b.textContent = `${vistosDe(t)}/${DATA[t].filter(it => disponible(t, it)).length}`;
  });

  const hint = $('#loveHint');
  if (pct >= 100) {
    hint.textContent = '¡Llenaste la barra mi amor! ';
    if (permitirFiesta && !finCelebrado) {
      finCelebrado = true;
      LS.set('aniv_fin', true);
      lluviaCorazones();
    }
  } else if (pct >= 50) {
    hint.textContent = 'Ya vas por la mitad, sigue descubriendo…';
  } else {
    hint.textContent = 'Abre cada sección y descubre todo para llenarla.';
  }
}

// Burbujas de corazón que suben dentro de la barra
function burbujas() {
  $$('.love-fill').forEach(fill => {
    if (parseFloat(fill.style.width) <= 0) return;
    const cont = $('.love-bubbles', fill);
    if (cont.children.length > 14) return;
    const b = document.createElement('span');
    b.className = 'bub';
    b.textContent = '♥';
    b.style.setProperty('--x', (Math.random() * 88 + 2) + '%');
    b.style.setProperty('--s', (Math.random() * 10 + 9) + 'px');
    b.style.setProperty('--t', (Math.random() * 1.2 + 1.6) + 's');
    b.style.setProperty('--dx', (Math.random() * 30 - 15) + 'px');
    cont.appendChild(b);
    setTimeout(() => b.remove(), 3000);
  });
}
setInterval(burbujas, 380);

function lluviaCorazones() {
  const cont = $('#lluvia');
  const emojis = ['❤', '💖', '💕', '💗', '♥'];
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('span');
    s.textContent = emojis[i % emojis.length];
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = (Math.random() * 22 + 14) + 'px';
    s.style.animationDuration = (Math.random() * 3 + 3) + 's';
    s.style.animationDelay = (Math.random() * 1.5) + 's';
    s.style.color = ['#ff5252', '#ff1744', '#ff8a65', '#f4c97a'][i % 4];
    cont.appendChild(s);
    setTimeout(() => s.remove(), 8000);
  }
}

// Corazones del encabezado
(function corazonesHeader() {
  const cont = $('#corazonesHeader');
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    s.textContent = '♥';
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = (Math.random() * 18 + 10) + 'px';
    s.style.animationDuration = (Math.random() * 5 + 5) + 's';
    s.style.animationDelay = (Math.random() * 6) + 's';
    cont.appendChild(s);
  }
})();

/* ============================================================
   Navegación entre pantallas
   ============================================================ */
function mostrarPantalla(id) {
  $$('.pantalla').forEach(p => p.classList.remove('activa'));
  $('#' + id).classList.add('activa');
  document.body.dataset.tema = id;
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  if (id === 'razones') observarRazones();
}

/* ============================================================
   Fotos con espacio vacío si el archivo aún no existe
   ============================================================ */
function ponerFoto(contenedor, img, ruta) {
  contenedor.dataset.ruta = ruta || '';
  contenedor.classList.remove('sin-foto');
  img.onerror = () => contenedor.classList.add('sin-foto');
  img.onload = () => contenedor.classList.remove('sin-foto');
  if (ruta) img.src = ruta; else contenedor.classList.add('sin-foto');
}

/* ============================================================
   12 COSAS: burbujas flotantes
   ============================================================ */
function renderCosas() {
  const lista = $('#listaCosas');
  COSAS.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'burbuja';
    b.dataset.id = 'cosas-' + i;
    b.setAttribute('aria-label', c.titulo);
    b.style.setProperty('--d', (-Math.random() * 6).toFixed(2) + 's');
    b.style.setProperty('--t', (5 + Math.random() * 3).toFixed(2) + 's');
    b.style.setProperty('--dx', (Math.random() * 14 + 4).toFixed(0) + 'px');
    b.innerHTML = `<span class="num">${i + 1}</span><span class="corazoncito">♥</span>`;
    if (visto.has('cosas-' + i)) b.classList.add('visto');
    b.addEventListener('click', () => abrirModal('cosas', i));
    lista.appendChild(b);
  });
}

/* ============================================================
   12 RAZONES: lista con zoom al centro
   ============================================================ */
let obsRazones = null;

function renderRazones() {
  const lista = $('#listaRazones');
  RAZONES.forEach((r, i) => {
    const art = document.createElement('article');
    art.className = 'razon';
    art.dataset.id = 'razones-' + i;
    art.dataset.i = i;
    art.innerHTML = `
      <div class="razon-foto"><img alt="" loading="lazy"></div>
      <div class="razon-texto">
        <span class="razon-num">${pad(i + 1)}</span>
        <h3></h3>
        <p></p>
        <button class="btn-foto" type="button">Ver foto completa</button>
      </div>`;
    $('h3', art).textContent = r.titulo;
    $('p', art).textContent = r.texto;
    ponerFoto($('.razon-foto', art), $('img', art), r.foto);

    const btn = $('.btn-foto', art);
    if (r.foto) {
      btn.addEventListener('click', () => abrirModal('razones', i));
    } else {
      btn.remove();
    }
    lista.appendChild(art);
  });
}

function observarRazones() {
  if (obsRazones || !('IntersectionObserver' in window)) {
    if (!('IntersectionObserver' in window)) $$('.razon').forEach(r => r.classList.add('aparece', 'enfoque'));
    return;
  }
  // 1) aparecer al entrar en pantalla
  const obsAparecer = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) e.target.classList.add('aparece'); });
  }, { threshold: 0.15 });

  // 2) enfocar (zoom + brillo) cuando cruza el centro
  obsRazones = new IntersectionObserver(es => {
    es.forEach(e => {
      e.target.classList.toggle('enfoque', e.isIntersecting);
      if (e.isIntersecting) marcarVisto('razones', Number(e.target.dataset.i));
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

  $$('.razon').forEach(r => { obsAparecer.observe(r); obsRazones.observe(r); });
}

/* ============================================================
   12 METAS: tarjetas que se voltean
   ============================================================ */
const metasOk = new Set(LS.get('aniv_metas_ok', []));

function actualizarContadorMetas() {
  $('#contadorMetas').textContent = `${metasOk.size} de ${METAS.length} cumplidas`;
}

function renderMetas() {
  const lista = $('#listaMetas');
  METAS.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'meta';
    card.dataset.id = 'metas-' + i;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.innerHTML = `
      <div class="meta-inner">
        <div class="meta-cara frente">
          <span class="meta-icono">${m.icono || '⭐'}</span>
          <span class="meta-num">Meta ${pad(i + 1)}</span>
        </div>
        <div class="meta-cara dorso">
          <h3></h3>
          <p></p>
          <button class="meta-ok" type="button"></button>
        </div>
      </div>`;
    $('h3', card).textContent = m.titulo;
    $('p', card).textContent = m.texto;

    const ok = $('.meta-ok', card);
    const pintarOk = () => {
      const hecho = metasOk.has(i);
      card.classList.toggle('cumplida', hecho);
      ok.textContent = hecho ? '✓ Cumplida' : 'Marcar cumplida';
    };
    pintarOk();

    const voltear = () => {
      card.classList.toggle('volteada');
      marcarVisto('metas', i);
    };
    card.addEventListener('click', voltear);
    card.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === card) { e.preventDefault(); voltear(); }
    });
    ok.addEventListener('click', e => {
      e.stopPropagation();
      metasOk.has(i) ? metasOk.delete(i) : metasOk.add(i);
      LS.set('aniv_metas_ok', [...metasOk]);
      pintarOk();
      actualizarContadorMetas();
    });

    if (visto.has('metas-' + i)) card.classList.add('visto');
    lista.appendChild(card);
  });
  actualizarContadorMetas();
}

/* ============================================================
   CARTAS: sobres
   ============================================================ */
function renderCartas() {
  const lista = $('#listaCartas');
  CARTAS.forEach((c, i) => {
    const s = document.createElement('button');
    const hay = disponible('cartas', c);
    s.className = 'sobre ' + (hay ? 'disponible' : 'sellada');
    s.dataset.id = 'cartas-' + i;
    s.setAttribute('aria-label', c.titulo + (hay ? '' : ' (sellada)'));
    s.innerHTML = `<span class="sello">${hay ? '♥' : '…'}</span><span class="etiqueta">${pad(i + 1)}</span>`;
    if (visto.has('cartas-' + i)) s.classList.add('visto');
    s.addEventListener('click', () => abrirModal('cartas', i));
    lista.appendChild(s);
  });
}

/* ============================================================
   Ventana (cosas y cartas)
   ============================================================ */
const modal = $('#modal');
let actual = null; // { tipo, i }

// Botón "Ver foto completa / Ajustar foto" dentro de la ventana (estilos en línea)
let fotoCompleta = false;
const btnVerFoto = document.createElement('button');
btnVerFoto.type = 'button';
btnVerFoto.id = 'modalVerFoto';
Object.assign(btnVerFoto.style, {
  margin: '14px auto 0', padding: '9px 18px', borderRadius: '20px',
  border: '1px solid #f4c97a', background: 'transparent', color: '#f4c97a',
  cursor: 'pointer', fontSize: '.85em', fontFamily: 'inherit'
});
$('#modalFoto').after(btnVerFoto);
btnVerFoto.addEventListener('click', () => ajustarFoto(!fotoCompleta));

function ajustarFoto(completa) {
  fotoCompleta = completa;
  const foto = $('#modalFoto'), img = $('#modalImg');
  foto.style.aspectRatio = completa ? 'auto' : '';
  foto.style.minHeight = completa ? '200px' : '';
  foto.style.background = completa ? '#1a0510' : '';
  img.style.height = completa ? 'auto' : '';
  img.style.maxHeight = completa ? '70vh' : '';
  img.style.objectFit = completa ? 'contain' : '';
  btnVerFoto.textContent = completa ? 'Ajustar foto' : 'Ver foto completa';
}

function abrirModal(tipo, i, completa) {
  const lista = DATA[tipo];
  const it = lista[i];
  actual = { tipo, i };

  const tarjeta = $('.modal-tarjeta', modal);
  tarjeta.className = 'modal-tarjeta tipo-' + tipo;
  // reinicia la animación de la carta
  void tarjeta.offsetWidth;

  $('#modalEtiqueta').textContent = `${ETIQUETA[tipo]} ${i + 1} de ${lista.length}`;
  $('#modalTitulo').textContent = it.titulo;
  $('#modalFecha').textContent = it.fecha || '';
  $('#modalFecha').style.display = it.fecha ? '' : 'none';

  const hay = disponible(tipo, it);
  $('#modalTexto').textContent = hay
    ? (it.texto || '')
    : 'Esta carta todavía se está escribiendo. Vuelve pronto 💌';

  const foto = $('#modalFoto');
  if (tipo === 'cartas' && !it.foto) {
    foto.classList.add('oculta');
  } else {
    foto.classList.remove('oculta');
    ponerFoto(foto, $('#modalImg'), it.foto);
  }
  ajustarFoto(tipo === 'cosas' && !!completa);
  btnVerFoto.style.display = (tipo !== 'cosas' || !it.foto) ? 'none' : '';

  modal.classList.add('abierto');
  modal.setAttribute('aria-hidden', 'false');
  marcarVisto(tipo, i);
}

function cerrarModal() {
  modal.classList.remove('abierto');
  modal.setAttribute('aria-hidden', 'true');
  actual = null;
}

function moverModal(d) {
  if (!actual) return;
  const n = DATA[actual.tipo].length;
  abrirModal(actual.tipo, (actual.i + d + n) % n, fotoCompleta);
}

modal.addEventListener('click', e => { if (e.target.closest('[data-cerrar]')) cerrarModal(); });
$('#modalPrev').addEventListener('click', () => moverModal(-1));
$('#modalNext').addEventListener('click', () => moverModal(1));
document.addEventListener('keydown', e => {
  if (!actual) return;
  if (e.key === 'Escape') cerrarModal();
  if (e.key === 'ArrowLeft') moverModal(-1);
  if (e.key === 'ArrowRight') moverModal(1);
});

/* ============================================================
   Edad y tiempo de vida (inicio)
   ============================================================ */
function calcularDatos(fechaNacimiento, idVida, idEdad) {
  const nacimiento = new Date(fechaNacimiento);
  const ahora = new Date();
  const diferenciaMs = ahora - nacimiento;

  const segundosTotales = Math.floor(diferenciaMs / 1000);
  const minutosTotales = Math.floor(segundosTotales / 60);
  const horasTotales = Math.floor(minutosTotales / 60);
  const diasTotales = Math.floor(horasTotales / 24);
  const semanas = Math.floor(diasTotales / 7);
  const meses = Math.floor(diasTotales / 30.44);
  const años = Math.floor(diasTotales / 365.25);

  const horas = horasTotales % 24;
  const minutos = minutosTotales % 60;
  const segundos = segundosTotales % 60;

  document.getElementById(idVida).textContent =
    `Días de vida: ${diasTotales.toLocaleString()} (${horas}:${pad(minutos)}:${pad(segundos)})`;
  document.getElementById(idEdad).textContent =
    `Edad: ${años} años · ${meses} meses · ${semanas} semanas`;
}

function contadorJuntos() {
  const el = $('#juntos');
  if (!CONFIG.juntosDesde) { el.style.display = 'none'; return; }
  const dias = Math.floor((new Date() - new Date(CONFIG.juntosDesde)) / 86400000);
  el.textContent = dias >= 0 ? `Juntos desde hace ${dias.toLocaleString()} días` : '';
}

function tick() {
  calcularDatos('2005-07-01T09:00:00', 'vidaElla', 'edadElla');
  calcularDatos('2001-09-06T10:00:00', 'vidaEl', 'edadEl');
  contadorJuntos();
}
tick();
setInterval(tick, 1000);

/* ============================================================
   Inicio
   ============================================================ */
renderCosas();
renderRazones();
renderMetas();
renderCartas();
actualizarBarra(false);
