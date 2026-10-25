
(function () {
  'use strict';

  const VOLUMEN = 0.5;
  const CLAVE = 'aniv_sonido';

  const PLAYLIST = [
    { titulo: 'Bruno Mars - Risk It All', archivo: 'musicas/cancion1.mp3' },
    { titulo: 'Manuel Medrano - Una y Otra Vez', archivo: 'musicas/cancion2.mp3' },
    { titulo: 'Kurt - La Mujer Perfecta', archivo: 'musicas/cancion3.mp3' },
    { titulo: 'iñigo quintero - Si No Estás', archivo: 'musicas/cancion4.mp3' },
    { titulo: 'Tom Odell - Another Love', archivo: 'musicas/cancion5.mp3' },
    { titulo: 'Vicente Fernández - Un Millón de Primaveras', archivo: 'musicas/cancion6.mp3' },
    { titulo: 'Ed Maverick - Fuentes De Ortiz', archivo: 'musicas/cancion7.mp3' },
    { titulo: 'Amapolas - Leo Rizzi', archivo: 'musicas/cancion8.mp3' },
    { titulo: 'Macaco - Coincidir', archivo: 'musicas/cancion9.mp3' },
    { titulo: 'Jósean Log - Chachachá', archivo: 'musicas/cancion10.mp3' },
    { titulo: 'LP - Lost On You', archivo: 'musicas/cancion11.mp3' },
    { titulo: 'Christian Nodal - Mi Antes y Después', archivo: 'musicas/cancion12.mp3' },
  ];
  const VOLUMEN_MUSICA = 0.3; // volumen inicial de la música (0 a 1)

  let activo = true;
  try { activo = localStorage.getItem(CLAVE) !== 'off'; } catch (e) {}

  let ctx = null, master = null, ruido = null;

  /* ---------- Motor de audio ---------- */
  function iniciar() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = VOLUMEN;
    master.connect(ctx.destination);
    // 1 segundo de ruido blanco, base para los sonidos de papel
    ruido = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = ruido.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  }

  function tono({ f = 440, f2 = null, t = 0.15, tipo = 'sine', v = 0.3, delay = 0 }) {
    const t0 = ctx.currentTime + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo;
    o.frequency.setValueAtTime(f, t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + t);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + t);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + t + 0.05);
  }

  function papel({ t = 0.2, f = 3000, f2 = null, q = 1, v = 0.3, delay = 0 }) {
    const t0 = ctx.currentTime + delay;
    const s = ctx.createBufferSource();
    s.buffer = ruido;
    const fl = ctx.createBiquadFilter();
    fl.type = 'bandpass';
    fl.Q.value = q;
    fl.frequency.setValueAtTime(f, t0);
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t0 + t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + t * 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + t);
    s.connect(fl); fl.connect(g); g.connect(master);
    s.start(t0, Math.random() * 0.5);
    s.stop(t0 + t + 0.05);
  }

  /* ---------- Biblioteca de sonidos ---------- */
  const SONIDOS = {
    // Burbuja: chirrido ascendente + "plop" (cada una suena distinta)
    burbuja() {
      const b = 380 + Math.random() * 260;
      tono({ f: b, f2: b * 2.3, t: 0.12, v: 0.35 });
      tono({ f: b * 1.5, f2: b * 3, t: 0.08, v: 0.15, delay: 0.06 });
      papel({ t: 0.05, f: 2600, q: 2, v: 0.1 });
    },
    // Sobre que se abre: roce de papel + golpecito
    sobre() {
      papel({ t: 0.18, f: 2500, f2: 5000, q: 0.8, v: 0.25 });
      papel({ t: 0.24, f: 3500, f2: 1800, q: 0.8, v: 0.22, delay: 0.12 });
      tono({ f: 140, f2: 70, t: 0.1, v: 0.2, delay: 0.02 });
    },
    // Sobre sellado: sonido apagado
    sellado() {
      tono({ f: 220, f2: 150, t: 0.14, tipo: 'triangle', v: 0.2 });
      tono({ f: 180, f2: 120, t: 0.14, tipo: 'triangle', v: 0.15, delay: 0.12 });
    },
    // Pasar de carta (papel)
    papel() { papel({ t: 0.2, f: 3000, f2: 4500, q: 0.9, v: 0.2 }); },
    // Tarjeta de meta que se voltea
    voltear() { papel({ t: 0.35, f: 400, f2: 3500, q: 1.2, v: 0.25 }); },
    // Meta cumplida
    cumplida() {
      tono({ f: 1318, t: 0.5, v: 0.22 });
      tono({ f: 1760, t: 0.6, v: 0.2, delay: 0.09 });
    },
    // Meta desmarcada
    desmarcar() { tono({ f: 700, f2: 450, t: 0.12, v: 0.15 }); },
    // Razón que llega al centro
    razon() {
      tono({ f: 880, t: 0.6, v: 0.12 });
      tono({ f: 1108, t: 0.6, v: 0.1, delay: 0.08 });
    },
    // Botones de inicio (tabs)
    tab() {
      tono({ f: 520, f2: 780, t: 0.14, v: 0.2 });
      tono({ f: 1040, t: 0.3, v: 0.08, delay: 0.08 });
    },
    // Clic suave
    clic() { tono({ f: 700, f2: 500, t: 0.05, v: 0.15 }); },
    // Cerrar ventana
    cerrar() { tono({ f: 500, f2: 300, t: 0.12, v: 0.15 }); },
    // Barra de amor llena
    fiesta() {
      [523, 659, 784, 1047, 1319].forEach((f, i) =>
        tono({ f, t: 0.55, tipo: 'triangle', v: 0.22, delay: i * 0.12 }));
      tono({ f: 1568, t: 0.9, v: 0.15, delay: 0.7 });
    }
  };

  function sonar(nombre) {
    if (!activo || !iniciar()) return;
    try { SONIDOS[nombre](); } catch (e) {}
  }

  /* ---------- Conexión con la página (por delegación de clics) ---------- */
  document.addEventListener('click', e => {
    const el = e.target;
    if (el.closest('#btnSonido, #btnMusica, #reproductor')) return;

    if (el.closest('.meta-ok')) {
      const card = el.closest('.meta');
      // se lee después de que la página actualice el estado
      setTimeout(() => sonar(card.classList.contains('cumplida') ? 'cumplida' : 'desmarcar'), 0);
    } else if (el.closest('.meta')) {
      sonar('voltear');
    } else if (el.closest('.burbuja')) {
      sonar('burbuja');
    } else if (el.closest('.sobre')) {
      sonar(el.closest('.sobre').classList.contains('sellada') ? 'sellado' : 'sobre');
    } else if (el.closest('.modal-nav button')) {
      const carta = document.querySelector('.modal-tarjeta.tipo-cartas');
      sonar(carta ? 'papel' : 'clic');
    } else if (el.closest('[data-cerrar]')) {
      sonar('cerrar');
    } else if (el.closest('.tab')) {
      sonar('tab');
    } else if (el.closest('.volver, .btn-foto, #modalVerFoto')) {
      sonar('clic');
    }
  }, true);

  // Razón que se enfoca al llegar al centro de la pantalla
  const listaRazones = document.getElementById('listaRazones');
  if (listaRazones && 'MutationObserver' in window) {
    let ultimo = 0;
    new MutationObserver(ms => {
      ms.forEach(m => {
        const era = (m.oldValue || '').includes('enfoque');
        const es = m.target.classList.contains('enfoque');
        if (!era && es && Date.now() - ultimo > 500) { ultimo = Date.now(); sonar('razon'); }
      });
    }).observe(listaRazones, { attributes: true, attributeFilter: ['class'], attributeOldValue: true, subtree: true });
  }

  // Lluvia de corazones (barra al 100%)
  const lluvia = document.getElementById('lluvia');
  if (lluvia && 'MutationObserver' in window) {
    let ultima = 0;
    new MutationObserver(() => {
      if (Date.now() - ultima > 6000) { ultima = Date.now(); sonar('fiesta'); }
    }).observe(lluvia, { childList: true });
  }

  /* ---------- Botón para silenciar / activar ---------- */
  const btn = document.createElement('button');
  btn.id = 'btnSonido';
  btn.type = 'button';
  Object.assign(btn.style, {
    position: 'fixed', right: '16px', bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
    width: '46px', height: '46px', borderRadius: '50%', zIndex: '150',
    border: '1px solid rgba(255,255,255,.35)', background: 'rgba(0,0,0,.55)',
    color: '#fff', fontSize: '20px', cursor: 'pointer', backdropFilter: 'blur(6px)'
  });
  function pintar() {
    btn.textContent = activo ? '🔊' : '🔇';
    btn.setAttribute('aria-label', activo ? 'Silenciar sonidos' : 'Activar sonidos');
  }
  btn.addEventListener('click', () => {
    activo = !activo;
    try { localStorage.setItem(CLAVE, activo ? 'on' : 'off'); } catch (e) {}
    pintar();
    if (activo) sonar('clic');
  });
  pintar();
  document.body.appendChild(btn);


  /* ============ REPRODUCTOR DE MÚSICA ============ */
  const lista = PLAYLIST.filter(c => c && c.archivo);
  if (lista.length) {
    const audio = new Audio();
    // No se descarga nada hasta que la persona toque la página.
    audio.preload = 'none';
    audio.loop = lista.length === 1;

    let i = 0, errores = 0, iniciada = false, quiere = true, vol = VOLUMEN_MUSICA;
    let primerFallo = null;
    try {
      quiere = localStorage.getItem('aniv_musica') !== 'off';
      const v = parseFloat(localStorage.getItem('aniv_musica_vol'));
      if (!isNaN(v)) vol = Math.min(1, Math.max(0, v));
      const k = parseInt(localStorage.getItem('aniv_musica_pista'), 10);
      if (k >= 0 && k < lista.length) i = k;
    } catch (e) {}
    audio.volume = vol;
    audio.muted = !activo;

    const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
    const urlDe = k => { try { return new URL(lista[k].archivo, document.baseURI).href; } catch (e) { return lista[k].archivo; } };

    /* ---------- Estilos de la barra ----------
       Pantalla ancha: barra centrada abajo.
       Celular: ocupa el ancho disponible, a la izquierda del botón 🔊. */
    const estilo = document.createElement('style');
    estilo.textContent =
      '#reproductor{position:fixed;left:50%;transform:translateX(-50%);' +
        'bottom:calc(16px + env(safe-area-inset-bottom,0px));width:min(460px,calc(100vw - 148px));' +
        'z-index:150;color:#fff;font-size:13px}' +
      '#musBarra{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:16px;' +
        'background:rgba(20,0,10,.88);border:1px solid rgba(255,255,255,.25);' +
        'backdrop-filter:blur(8px);box-shadow:0 8px 24px rgba(0,0,0,.45)}' +
      '#musTitulo{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left}' +
      '#musTitulo.err{white-space:normal;word-break:break-all;font-size:11px;line-height:1.3}' +
      '#reproductor .mus-b{flex:none;width:34px;height:34px;padding:0;border-radius:50%;cursor:pointer;' +
        'border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.12);color:#fff;font-size:14px}' +
      '#musVol{flex:none;width:80px;accent-color:#ff5252}' +
      '#musLista{display:none;margin-bottom:8px;max-height:min(50vh,340px);overflow-y:auto;padding:6px;' +
        'border-radius:16px;background:rgba(20,0,10,.92);border:1px solid rgba(255,255,255,.25);' +
        'backdrop-filter:blur(8px);box-shadow:0 8px 24px rgba(0,0,0,.45)}' +
      '#reproductor .mus-item{display:flex;gap:8px;width:100%;text-align:left;padding:8px 10px;border:0;' +
        'border-radius:10px;background:transparent;color:#fff;font-size:13px;cursor:pointer}' +
      '#reproductor .mus-item:hover{background:rgba(255,255,255,.1)}' +
      '#reproductor .mus-item.act{background:rgba(255,82,82,.28);font-weight:600}' +
      '#reproductor .mus-n{flex:none;width:24px;opacity:.7}' +
      '#reproductor .mus-t{flex:1;min-width:0}' +
      '@media (max-width:560px){#reproductor{left:12px;right:70px;width:auto;transform:none}#musVol{display:none}}';
    document.head.appendChild(estilo);

    /* ---------- Barra + lista ---------- */
    const panel = document.createElement('div');
    panel.id = 'reproductor';
    panel.innerHTML =
      '<div id="musLista" role="list"></div>' +
      '<div id="musBarra">' +
        '<button type="button" class="mus-b" id="musPrev" aria-label="Anterior">⏮</button>' +
        '<button type="button" class="mus-b" id="musPlay" aria-label="Reproducir o pausar">▶</button>' +
        '<button type="button" class="mus-b" id="musNext" aria-label="Siguiente">⏭</button>' +
        '<div id="musTitulo"></div>' +
        '<input type="range" id="musVol" min="0" max="1" step="0.05" aria-label="Volumen de la música">' +
        '<button type="button" class="mus-b" id="btnMusica" aria-label="Ver lista de canciones" aria-expanded="false">☰</button>' +
      '</div>';
    document.body.appendChild(panel);

    const $t = panel.querySelector('#musTitulo');
    const $play = panel.querySelector('#musPlay');
    const $vol = panel.querySelector('#musVol');
    const $lista = panel.querySelector('#musLista');
    const btnM = panel.querySelector('#btnMusica');
    $vol.value = vol;

    // Lista numerada: un botón por canción
    const items = lista.map((c, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'mus-item';
      const n = document.createElement('span');
      n.className = 'mus-n';
      n.textContent = (k + 1) + '.';
      const t = document.createElement('span');
      t.className = 'mus-t';
      t.textContent = c.titulo || ('Canción ' + (k + 1));
      b.appendChild(n);
      b.appendChild(t);
      b.addEventListener('click', () => {
        iniciada = true; quiere = true; guardar('aniv_musica', 'on');
        reiniciarErrores();
        if (k === i && audio.getAttribute('src')) {
          if (audio.paused) reproducir();   // la misma canción: solo continúa
        } else {
          cargar(k); reproducir();
        }
        abrirLista(false);
      });
      $lista.appendChild(b);
      return b;
    });

    function marcar() {
      items.forEach((b, k) => b.classList.toggle('act', k === i));
      const a = items[i];
      if (a && $lista.style.display === 'block') a.scrollIntoView({ block: 'nearest' });
    }
    function abrirLista(v) {
      $lista.style.display = v ? 'block' : 'none';
      btnM.setAttribute('aria-expanded', v ? 'true' : 'false');
      if (v) marcar();
    }

    // Si se pasa un texto (mensaje de error) se muestra completo, en varias líneas
    function titulo(txt) {
      $t.classList.toggle('err', !!txt);
      $t.textContent = txt || ('♪ ' + (lista[i].titulo || 'Canción ' + (i + 1)));
    }

    function cargar(n) {
      i = (n + lista.length) % lista.length;
      audio.src = lista[i].archivo;
      guardar('aniv_musica_pista', i);
      titulo();
      marcar();
    }
    function reproducir() { const p = audio.play(); if (p && p.catch) p.catch(() => {}); }
    function siguiente(d) { cargar(i + d); if (quiere) reproducir(); }
    function reiniciarErrores() { errores = 0; primerFallo = null; }

    audio.addEventListener('ended', () => siguiente(1));
    audio.addEventListener('playing', () => { reiniciarErrores(); });
    audio.addEventListener('play', () => { $play.textContent = '⏸'; });
    audio.addEventListener('pause', () => { $play.textContent = '▶'; });

    audio.addEventListener('error', () => {
      const e = audio.error;
      const motivos = {
        1: 'carga cancelada',
        2: 'error de red',
        3: 'archivo dañado o formato no válido',
        4: 'no existe (404) o formato no soportado'
      };
      const motivo = motivos[e && e.code] || 'error desconocido';
      const url = urlDe(i);
      console.warn('FALLÓ:', url, '| código:', e && e.code, '|', motivo);
      if (!primerFallo) primerFallo = { url, motivo };

      errores++;
      if (errores >= lista.length) {
        titulo('No se pudo cargar: ' + primerFallo.url + ' (' + primerFallo.motivo + ')');
        return;
      }
      siguiente(1);
    });

    // La música arranca con el primer toque en la página (regla de los navegadores)
    function arrancar(ev) {
      // Si el primer toque fue en el propio reproductor, lo manejan sus botones
      if (ev && ev.target && ev.target.closest && ev.target.closest('#reproductor')) return;
      if (iniciada) return;
      iniciada = true;
      document.removeEventListener('click', arrancar, true);
      document.removeEventListener('keydown', arrancar, true);
      if (!audio.getAttribute('src')) cargar(i);
      if (quiere) reproducir();
    }
    document.addEventListener('click', arrancar, true);
    document.addEventListener('keydown', arrancar, true);

    // Al abrir solo se muestra el título; el archivo no se pide hasta el primer toque
    titulo();
    marcar();
    $play.textContent = '▶';

    btnM.addEventListener('click', () => abrirLista($lista.style.display !== 'block'));
    // Tocar fuera del reproductor cierra la lista
    document.addEventListener('click', ev => {
      if ($lista.style.display === 'block' && !panel.contains(ev.target)) abrirLista(false);
    });

    $play.addEventListener('click', () => {
      iniciada = true;
      if (audio.paused) {
        quiere = true; guardar('aniv_musica', 'on');
        reiniciarErrores();
        if (!audio.getAttribute('src')) cargar(i);
        reproducir();
      } else {
        quiere = false; guardar('aniv_musica', 'off'); audio.pause();
      }
    });
    panel.querySelector('#musPrev').addEventListener('click', () => {
      iniciada = true; quiere = true; guardar('aniv_musica', 'on'); reiniciarErrores(); siguiente(-1);
    });
    panel.querySelector('#musNext').addEventListener('click', () => {
      iniciada = true; quiere = true; guardar('aniv_musica', 'on'); reiniciarErrores(); siguiente(1);
    });
    $vol.addEventListener('input', () => { audio.volume = parseFloat($vol.value); guardar('aniv_musica_vol', $vol.value); });

    // El botón 🔊/🔇 también silencia la música
    btn.addEventListener('click', () => { audio.muted = !activo; });
  }
})();
