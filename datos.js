const CONFIG = {
  // Fecha en la que empezaron (para el contador "Juntos desde hace…")
  // Formato: 'AAAA-MM-DDTHH:MM:SS'. Déjalo en '' para ocultar el contador.
  juntosDesde: '2025-09-02T00:00:00'
};

/* ---------- 12 COSAS QUE HE HECHO (burbujas flotantes) ---------- */
const COSAS = [
  { titulo: 'Cosa #1',  texto: 'Hacer cartas, muy bien me conociste al principio haciendo muchas cartas, cada mes o cada día, todas esas cartas diciendote lo mucho que te amo, que te quiero y que no puedo vivir sin ti.', foto: 'imagenes/12cosas/1mes.jpeg' },
  { titulo: 'Cosa #2',  texto: 'Dibujos aleatorios, dibujandote a ti, queriendo colocar un poco más de color y detalle a esos trazos que hago cuando te dibujaba era como tocar el cielo con un lapiz.', foto: 'imagenes/12cosas/2mes.jpeg' },
  { titulo: 'Cosa #3',  texto: 'Las pocas cosas que he hecho por ti, esta entre ellos cantar, me gusta cantarte cosas, pero a veces pues la voz no me da o siento que no te podria gustar.', foto: 'imagenes/12cosas/3mes.jpeg' },
  { titulo: 'Cosa #4',  texto: 'Ayudarte con algunas tareas, siempre estoy dispuesto a ayudarte en lo que necesites, aunque no sepa como se hacen aprendo para ayudarte.', foto: 'imagenes/12cosas/4mes.jpeg' },
  { titulo: 'Cosa #5',  texto: 'Si no más recuerdo también baile creo que fue una o dos veces, jajaja, ni idea que me paso ese día, pero lo hice con gusto creo :).', foto: 'imagenes/12cosas/5mes.jpeg' },
  { titulo: 'Cosa #6',  texto: 'Aprendí a hacer ppts y diseñar cosas, para ti, no me agradan los colores, pero contigo tuve que cambiar ese trasfondo de oscuridad para colocarle un toque de color, bueno más bien un toquezon de color como lo eres tú.', foto: 'imagenes/12cosas/6mes.jpeg' },
  { titulo: 'Cosa #7',  texto: 'Como esta pagina, verás que no es la primera vez que te programo algo, diciendo cosas o entreteniendote para ver si te llegan a gustar.', foto: 'imagenes/12cosas/7mes.jpeg' },
  { titulo: 'Cosa #8',  texto: 'Tambien he hecho collage o mezcla de fotos tuyas que me gustan, y pues obvio me encanta verte a tí.', foto: 'imagenes/12cosas/8mes.jpeg' },
  { titulo: 'Cosa #9',  texto: 'Aportar con dinero a lo que necesites, para cuando lo necesites, no me importa que pueda ser, de que se puede se puede, aunque demore.', foto: 'imagenes/12cosas/9mes.jpeg' },
  { titulo: 'Cosa #10', texto: 'Tratarte con respeto y cariño todos los días como te lo puedes imaginar, por eso soy muy preocupado por si te sucede algo.', foto: 'imagenes/12cosas/10mes.jpeg' },
  { titulo: 'Cosa #11', texto: 'Y obvio te amo, que te he esperado y seguire esperando las veces que sea necesario para que seas tú.', foto: 'imagenes/12cosas/11mes.jpeg' },
  { titulo: 'Cosa #12', texto: 'Y las cosa que más querido hacer por ti, es estar contigo como más he deseado hacer.', foto: 'imagenes/12cosas/12mes.jpeg' }
];

/* ---------- 12 RAZONES DE AMARTE (lista con foto al lado) ---------- */
const RAZONES = [
  { titulo: 'Razón #1',  texto: 'Lo primero que conocí fue tu voz, tan suave y dulce en pocas palabras, tan mexicana.', foto: 'imagenes/razones/01.jpg' },
  { titulo: 'Razón #2',  texto: 'Tus ojos color café, que hasta de fondo de pantalla lo tuve por 2 meses, sin cambiarlo de lo mucho que me gustaron.', foto: 'imagenes/razones/02.png' },
  { titulo: 'Razón #3',  texto: 'Esa carita que siempre me hace sonreír y me gusta ver en cada foto que conservo.', foto: 'imagenes/razones/03.jpg' },
  { titulo: 'Razón #4',  texto: 'Querer hacerte sentir la chica más feliz del mundo y darle cada cosa que pueda hacerte feliz.', foto: 'imagenes/razones/04.jpg' },
  { titulo: 'Razón #5',  texto: 'Porque quiero casarme con mi novia, futura esposa.', foto: 'imagenes/razones/05.jpeg' },
  { titulo: 'Razón #6',  texto: 'Cada día aprendo más de ti y como puedo adaptarme a ti, así puedo comprender tu perspectiva de como es la vida.', foto: 'imagenes/razones/06.jpg' },
  { titulo: 'Razón #7',  texto: 'La razón de mi corazón, que eres mi bombón precioso que amo mucho.', foto: 'imagenes/razones/07.jpg' },
  { titulo: 'Razón #8',  texto: 'Tu forma de ser, tan especial y única, que me hace quererte más cada día.', foto: 'imagenes/razones/08.png' },
  { titulo: 'Razón #9',  texto: 'Esos detalles que haces y que me sorprenden constantemente, porque vienen de tí.', foto: 'imagenes/razones/09.jpg' },
  { titulo: 'Razón #10', texto: 'Tu manera de ver la vida, llena de positividad y alegría, que me inspira a ser mejor persona.', foto: 'imagenes/razones/10.jpeg' },
  { titulo: 'Razón #11', texto: 'Amo tu cuerpezote mi amorzote.', foto: 'imagenes/razones/11.jpg' },
  { titulo: 'Razón #12', texto: 'Saber como saldría un hijo nuestro, haber si sale con esos ojotes y carita que tienes tu mi bebé', foto: 'imagenes/razones/12.jpg' }
];

/* ---------- 12 METAS CONTIGO (tarjetas que se voltean) ----------
   "icono" es un emoji. Cada meta se puede marcar como cumplida en la web. */
const METAS = [
  { icono: '✈️', titulo: 'Meta #1',  texto: 'Viajar para conocerte y realizar las cosas que no hemos podido.' },
  { icono: '🏠', titulo: 'Meta #2',  texto: 'Lograr vivir juntos y tener nuestra propia casa construyendolo día a día.' },
  { icono: '🌎', titulo: 'Meta #3',  texto: 'Ver el mundo juntos y descubrir nuevas culturas, esos lugares que pensamos y planeamos ir algún día.' },
  { icono: '🎓', titulo: 'Meta #4',  texto: 'Ver tu finalización de la carrera y emocionarme al ver a mi novia lograr ese diploma.' },
  { icono: '🍽️', titulo: 'Meta #5',  texto: 'Comer juntos y disfrutar de las comidas que nos hacen felices, al igual que comer esas comidas que preparias.' },
  { icono: '🎶', titulo: 'Meta #6',  texto: 'Escuchar música juntos y disfrutar de los momentos en silencio.' },
  { icono: '📸', titulo: 'Meta #7',  texto: 'Poder tomarnos muchas fotos cuando estemos juntos y tener esos recuerdos guardados para siempre.' },
  { icono: '💏', titulo: 'Meta #8',  texto: 'En algún momento poder tener a nuestros bebecitos, chiquitos y bonitos como tú .' },
  { icono: '💍', titulo: 'Meta #9',  texto: 'Casarnos, vernos a los ojos, agarrados de las manos y decirnos "Si acepto".' },
  { icono: '🌅', titulo: 'Meta #10', texto: 'Ver el amanecer, anocher, atardecer juntos y sentirnos afortunados de estar juntos en ese momento.' },
  { icono: '🎡', titulo: 'Meta #11', texto: 'Disfrutar de nuevas experiencias juntos, diversiones y momentos .' },
  { icono: '♾️', titulo: 'Meta #12', texto: 'Ser feliz contigo infinitamente y ayudarte a resolver muchas cosas y enseñarte que todo tiene solucion por lo más dificil que sea.' }
];

const CARTAS = [
  { titulo: 'Carta #1',  fecha: '', texto: ``, foto: 'imagenes/12cartas/1.jpg' },
  { titulo: 'Carta #2',  fecha: '', texto: ``, foto: 'imagenes/12cartas/2.jpg' },
  { titulo: 'Carta #3',  fecha: '', texto: ``, foto: 'imagenes/12cartas/3.jpg' },
  { titulo: 'Carta #4',  fecha: '', texto: ``, foto: 'imagenes/12cartas/4.jpg' },
  { titulo: 'Carta #5',  fecha: '', texto: ``, foto: 'imagenes/12cartas/5.jpg' },
  { titulo: 'Carta #6',  fecha: '', texto: ``, foto: 'imagenes/12cartas/6.jpg' },
  { titulo: 'Carta #7',  fecha: '', texto: ``, foto: 'imagenes/12cartas/7.jpg' },
  { titulo: 'Carta #8',  fecha: '', texto: ``, foto: 'imagenes/12cartas/8.jpg' },
  { titulo: 'Carta #9',  fecha: '', texto: ``, foto: 'imagenes/12cartas/9.jpg' },
  { titulo: 'Carta #10', fecha: '', texto: ``, foto: 'imagenes/12cartas/10.jpg' },
  { titulo: 'Carta #11', fecha: '', texto: ``, foto: 'imagenes/12cartas/11.jpg' },
  { titulo: 'Carta #12', fecha: '', texto: ``, foto: 'imagenes/12cartas/12.jpg' },
  { titulo: 'Carta #13', fecha: '', texto: ``, foto: 'imagenes/12cartas/13.jpg' },
  { titulo: 'Carta #14', fecha: '', texto: ``, foto: 'imagenes/12cartas/14.jpg' },
  { titulo: 'Carta #15', fecha: '', texto: ``, foto: 'imagenes/12cartas/15.jpg' },
  { titulo: 'Carta #16', fecha: '', texto: ``, foto: 'imagenes/12cartas/16.jpg' },
  { titulo: 'Carta #17', fecha: '', texto: ``, foto: 'imagenes/12cartas/17.jpg' },
  { titulo: 'Carta #18', fecha: '', texto: ``, foto: 'imagenes/12cartas/18.jpg' },
  { titulo: 'Carta #19', fecha: '', texto: ``, foto: 'imagenes/12cartas/19.jpg' },
  { titulo: 'Carta #20', fecha: '', texto: ``, foto: 'imagenes/12cartas/20.jpg' },
  { titulo: 'Carta #21', fecha: '', texto: ``, foto: 'imagenes/12cartas/21.jpg' },
  { titulo: 'Carta #22', fecha: '', texto: ``, foto: 'imagenes/12cartas/22.jpg' },
  { titulo: 'Carta #23', fecha: '', texto: ``, foto: 'imagenes/12cartas/23.jpg' },
  { titulo: 'Carta #24', fecha: '', texto: ``, foto: 'imagenes/12cartas/24.jpg' },
  { titulo: 'Carta #25', fecha: '', texto: ``, foto: 'imagenes/12cartas/25.jpg' }
];
