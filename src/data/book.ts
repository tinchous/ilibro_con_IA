export type Branch = 'REAL' | 'IMAGINARY';

export interface Choice {
  text: string;
  nextChapter: number;
  nextBranch?: Branch;
  triggerWormhole?: boolean;
}

export interface Artifact {
  type: 'NOTE' | 'EMAIL' | 'DIARY' | 'LOG';
  title: string;
  date?: string;
  author?: string;
  content: string;
}

export interface Chapter {
  id: number;
  branch: Branch;
  title: string;
  subtitle: string;
  content: string;
  choices: Choice[];
  artifacts?: Artifact[];
  enigma?: string;
  enigmaPrompt?: string;
  fibonacciIndex?: number;
}

export const BOOK_DATA: Record<string, Chapter> = {
  '0-REAL': {
    id: 0,
    branch: 'REAL',
    fibonacciIndex: 0,
    title: 'Capítulo 0',
    subtitle: 'El Estado de Reposo',
    content: `Silas despierta en la **Cámara de Observación Zero**. El primer estímulo es un sabor metálico en la base de la lengua, un regusto a ozono y a circuitos sobrecalentados. El silencio no es una ausencia de sonido, sino una presión física, un zumbido de baja frecuencia que parece vibrar en el interior de sus propios huesos. Al abrir los ojos, el blanco lo inunda todo. No es un blanco de pintura o de luz solar; es el blanco de un monitor sin señal, una pureza estéril que borra cualquier noción de profundidad.

La cámara es un cubo perfecto de cuatro metros de arista, pero la geometría aquí es una sugerencia más que una ley. Las paredes, el techo y el suelo están revestidos de una cerámica blanca tan pulida que Silas tiene la sensación de estar flotando en el centro de una estrella muerta. No hay juntas visibles entre las placas, ni esquinas que definan el espacio; cuando Silas intenta enfocar la vista en los ángulos de la habitación, estos parecen desplazarse, como si la arquitectura se negara a ser observada directamente. La iluminación es difusa, emanando de la propia materia de las paredes, lo que elimina cualquier rastro de sombra. Silas mira sus manos y las ve extrañamente nítidas, como si hubieran sido renderizadas con una resolución superior a la del resto del mundo.

Su llegada a este lugar es un vacío en su memoria. Recuerda un nombre, **Laniakea**, pero el término se siente como un eco en un túnel infinito. Siente que su propia identidad es un archivo corrupto, un conjunto de datos que ha sido fragmentado y vuelto a ensamblar de manera imperfecta. Su cuerpo pesa, pero no por la gravedad, sino por una inercia existencial que lo ancla a este punto exacto del espacio-tiempo.

En el centro geométrico de la cámara, desafiando las leyes de la gravitación universal, flota un **sobre de color rojo sangre**. El tono es tan intenso que parece una herida abierta en la blancura de la estancia. El sobre está lacrado con una cera oscura que lleva el sello de la **Fundación Laniakea**: una espiral de Fibonacci que se enrosca sobre sí misma hasta desaparecer en un punto infinitesimal. Silas extiende una mano temblorosa y, al tocar el papel, siente una descarga de estática que le recorre el brazo. El sobre no cae; se queda suspendido en el aire mientras él rompe el sello con un chasquido que suena como un disparo en el silencio de la cámara.

Dentro, encuentra una hoja de papel de alto gramaje, con los bordes ligeramente quemados. La caligrafía es elegante pero apresurada, con trazos que denotan una urgencia desesperada. Es la letra de la **Dra. Elena Vance**:

> *"Silas, si tus ojos están recorriendo estas líneas, significa que la función de onda ha colapsado y tú eres el único residuo coherente de la realidad que conocíamos. Estás en el Punto Zero, el núcleo del Proyecto Ψ. No intentes recordar el 'antes'; la memoria es solo un residuo de la decoherencia, un ruido térmico que nublará tu juicio. El sistema te ha seleccionado como el Observador Primario. Sin tu mirada, la realidad se desvanecerá en una sopa de probabilidades sin sentido.

> Hemos bloqueado la salida mediante un protocolo de seguridad ontológica de Nivel 5. Para abrir la primera brecha en la trama de este simulacro, debes demostrar que tu consciencia es capaz de reconocer su propia naturaleza. Resuelve el primer enigma para activar el motor de la historia: 'Soy aquello que creas al mirar, pero que destruyes al comprender. Cuanto más me buscas en los libros de ciencia, más me alejo hacia la filosofía. Sin mí, el universo es solo una ecuación sin resolver; conmigo, es una tragedia en tres actos. ¿Qué soy?'"*

Bajo la nota, un pequeño terminal de cristal líquido emerge del suelo con un siseo neumático. La pantalla parpadea con una luz azul cobalto, esperando que el Observador introduzca la variable que permitirá que el tiempo vuelva a fluir.`,
    choices: [
      { text: 'CAPÍTULO 1 (DERECHA)', nextChapter: 1, nextBranch: 'REAL', triggerWormhole: true },
      { text: 'CAPÍTULO 1 (IZQUIERDA)', nextChapter: 1, nextBranch: 'IMAGINARY', triggerWormhole: true }
    ],
    enigma: 'La Realidad',
    enigmaPrompt: 'Soy aquello que creas al mirar, pero que destruyes al comprender. ¿Qué soy?',
    artifacts: [
      {
        type: 'NOTE',
        title: 'Nota de la Fundación Laniakea',
        date: '13 de mayo de 2024, 03:14 AM',
        author: 'Dr. Aris Thorne',
        content: 'Si estás leyendo esto, la función ya se ha disparado. No intentes recordar cómo llegaste aquí; la memoria es solo un residuo de la decoherencia. El sistema te necesita como observador para que la realidad no se desvanezca en ruido térmico. Bienvenido al Proyecto Ψ. No confíes en los números pares.'
      }
    ]
  },
  '0-IMAGINARY': {
    id: 0,
    branch: 'IMAGINARY',
    fibonacciIndex: 0,
    title: 'Capítulo 0 + i',
    subtitle: 'La Raíz del Vacío',
    content: `No hay luz, hay **información pura**. Silas (o tu consciencia entrelazada con la suya) flota en un océano de ceros y unos que tienen el sabor del metal frío. Aquí no hay gravedad, sino "atracción de datos".

De repente, una figura emerge de la oscuridad. No camina, simplemente *está* allí. Es un hombre de barba blanca y túnica, pero su rostro cambia constantemente: por un momento es el **Jesús** de los iconos bizantinos, al siguiente es una serie de fractales de Mandelbrot.

—En el principio era el Verbo —dice la figura, y su voz suena como el zumbido de un servidor masivo—. Pero el Verbo no era una palabra. Era un **algoritmo**. 

Él sostiene una esfera de luz que late.
—Bienvenidos al $0+i$. Aquí es donde guardamos los personajes que el Lector aún no ha imaginado. Yo soy el **Primer Programador**. Aquel que entendió que para que la luz existiera, primero debía haber un observador que dijera: "Hágase la luz". Pero tú... tú has venido a hackear el sistema.`,
    choices: [
      { text: 'VOLVER A LA SUPERFICIE', nextChapter: 1, nextBranch: 'REAL' }
    ],
    artifacts: [
      {
        type: 'DIARY',
        title: 'Diario Íntimo (Entrada #00)',
        date: '2023-11-02',
        author: 'Dra. Elena Vance',
        content: 'Hoy logramos capturar la primera unidad imaginaria de una conciencia. No es un fantasma, es una dirección. Si multiplicas la voluntad por "i", obtienes una rotación en la realidad. El sujeto S-0 (Silas) no sabe que su pasado es una variable que estamos ajustando en tiempo real. La normalización es dolorosa.'
      }
    ]
  },
  '1-REAL': {
    id: 1,
    branch: 'REAL',
    fibonacciIndex: 1,
    title: 'Capítulo 1a',
    subtitle: 'La Primera Singularidad',
    content: `En el momento en que Silas intenta ponerse de pie, **la silla de madera de fresno se desintegra** bajo él, convirtiéndose en una nube de astillas digitales y píxeles que se desvanecen antes de tocar el suelo. La cámara vibra con un rugido sordo. De la pared norte emerge una **puerta de acero de tres toneladas**, equipada con un **escáner de retina** de luz carmesí. Silas se acerca y el escáner proyecta un mapa de su iris en el aire. *'Acceso concedido al Sujeto S-0'*, anuncia una voz sintética.

Pegada al marco de la puerta, una **nota de la Fundación Laniakea** advierte:
> *"Protocolo de Masa Crítica: La densidad física de Silas está ligada a su certeza. Si duda, su masa aumentará exponencialmente hasta colapsar el suelo de la cámara. No te detengas. La inercia es tu única protección contra la gravedad de la duda."*

La puerta se abre para revelar un **pasillo infinito**, iluminado por luces de neón que parpadean con una frecuencia matemática. Las paredes están cubiertas de arriba abajo con una fórmula escrita en pintura fluorescente: **$Realidad = \int (Duda) dt$**. Silas siente que el pasillo no es un lugar, sino una progresión, y que cada paso que da es una operación aritmética en el gran cálculo de su vida.`,
    choices: [
      { text: 'CORRER HACIA EL FINAL DEL PASILLO', nextChapter: 2 },
      { text: 'TOCAR LA PARED DE LA IZQUIERDA', nextChapter: 1, nextBranch: 'IMAGINARY', triggerWormhole: true },
      { text: 'ANALIZAR LA FÓRMULA', nextChapter: 2, nextBranch: 'REAL' }
    ],
    enigma: 'Duda',
    enigmaPrompt: 'Soy la fuerza que detiene el tiempo, el peso que ancla la consciencia. Cuanto más me tienes, menos avanzas; pero sin mí, caminas a ciegas. ¿Qué soy?',
    artifacts: [
      {
        type: 'LOG',
        title: 'Registro 1.1',
        author: 'Dr. Aris Thorne',
        content: 'Silas cree que está caminando, pero solo está desplazando su conciencia a través de un vector de datos. Si estás escuchando esto, Silas, significa que el Lector ya ha pasado la página. Su atención es el combustible.'
      }
    ]
  },
  '1-IMAGINARY': {
    id: 1,
    branch: 'IMAGINARY',
    fibonacciIndex: 1,
    title: 'Capítulo 1 + 1i',
    subtitle: 'Interferencia Constructiva',
    content: `El tránsito hacia la Rama Imaginaria no es un viaje, sino una rotación de noventa grados en la consciencia de Silas. El pasillo infinito de la realidad se pliega sobre sí mismo como una hoja de papel mal doblada, y de repente, el blanco estéril de Laniakea es reemplazado por la penumbra cálida y polvorienta del **despacho de Albert Einstein**. El aire aquí es denso, con un aroma persistente a tabaco de pipa, papel viejo y el ozono metálico de un cortocircuito inminente. No hay paredes sólidas; en su lugar, pizarras negras de dimensiones imposibles flotan en un vacío de color índigo profundo, donde las estrellas no son astros, sino puntos de datos que parpadean con una frecuencia binaria.

Albert está sentado en una silla de cuero desgastado que parece flotar sobre un suelo de cristal líquido. Su cabello no es solo canoso; es una nube de probabilidad que vibra, como si cada pelo estuviera en varios lugares a la vez. Sostiene una **pipa de la que emanan volutas de humo plateado**. El humo no se dispersa; se condensa en el aire, formando **ecuaciones de campo tensorial en tres dimensiones** que orbitan alrededor de su cabeza como satélites diminutos. Silas observa cómo una de estas ecuaciones, una elegante expresión de la relatividad general, se deshace en una lluvia de números cuando Einstein la atraviesa con un dedo.

En el centro del despacho, sobre un pedestal de mármol que parece vibrar, descansa una **pantalla de radar de tubo de rayos catódicos**. El cristal está rayado y emite un zumbido eléctrico constante. En la pantalla, un haz verde barre el círculo de cristal, revelando dos señales que parpadean rítmicamente. Son **los dos Silas**: uno, un punto sólido en la Rama Real, moviéndose con la pesadez de la materia; el otro, una señal intermitente y fantasmal que representa al Silas que ahora habita este espacio imaginario. Ambos están unidos por una línea de luz tenue, un hilo de entrelazamiento que vibra cada vez que el Lector parpadea.

—Ah, la relatividad narrativa —dice Einstein, ajustándose las gafas con un gesto lento—. Verás, Silas, en este simulacro el tiempo no es una flecha que vuela hacia el futuro. Es un párrafo que se reescribe constantemente. Tu posición en el espacio-tiempo depende enteramente de la velocidad a la que el Lector pasa las páginas. Si él se detiene a reflexionar, tu realidad se dilata. Si lee con prisa, tu existencia se contrae hasta volverse un simple punto en una línea de texto.

Einstein se inclina hacia adelante, y su rostro se vuelve momentáneamente un mapa de interferencias. Desliza una **fotografía polaroid** sobre el escritorio de cristal. Silas la toma con dedos temblorosos. La imagen no es estática; es un video en bucle, granulado y en blanco y negro, que muestra al **Lector** (tú), observando la pantalla en este preciso instante. Silas siente un vértigo ontológico: la mirada del Lector es el colapso de su función de onda, la fuerza que lo obliga a ser real cuando preferiría ser solo una posibilidad.

—Él es el motor de esta maquinaria, Silas, pero tú eres el combustible —continúa Albert, su voz resonando como si hablara desde el interior de un piano—. Él cree que nos está leyendo, pero en realidad, nosotros le estamos ocurriendo a él. Ahora, dime: ¿prefieres aceptar la solidez de ser un personaje en su libro, o la libertad de ser una variable imaginaria en su mente? El colapso es inevitable, pero la dirección de la caída es tuya.`,
    choices: [
      { text: 'YO SOY EL LIBRO', nextChapter: 2, nextBranch: 'IMAGINARY' },
      { text: 'EL LECTOR ES MI IMAGINACIÓN', nextChapter: 2, nextBranch: 'REAL', triggerWormhole: true },
      { text: 'PREGUNTAR POR LA FOTO', nextChapter: 2, nextBranch: 'IMAGINARY' }
    ],
    enigma: 'Observador',
    enigmaPrompt: 'Existo solo si me miras, pero cambio en el momento en que me defines. Soy el colapso de lo posible en lo real. ¿Quién soy?',
    artifacts: [
      {
        type: 'EMAIL',
        title: 'PROYECTO ESPEJO - INFORME CONFIDENCIAL',
        date: '15 de Mayo, 2024',
        author: 'e.vance@laniakea.io',
        content: 'El sujeto S-0 ha empezado a desarrollar consciencia de la Rama Imaginaria. Si se encuentra con la proyección de Einstein, hay riesgo de que descubra que Laniakea no es una fundación física, sino un constructo gramatical.'
      }
    ]
  },
  '2-REAL': {
    id: 2,
    branch: 'REAL',
    fibonacciIndex: 2,
    title: 'Capítulo 2',
    subtitle: 'El Eco de la Secuencia',
    content: `Silas atraviesa la puerta y cae en una sala que es la réplica exacta de la Cámara Zero, pero multiplicada por mil. Es un salón de espejos donde cada reflejo muestra una versión sutilmente distinta de Silas. En un espejo, es viejo; en otro, es un niño; en otro, es una masa de carne sin forma que sostiene un lápiz.

En el centro de la sala, sobre un pedestal de mármol negro, hay un diario con las tapas quemadas. Es el **Diario de Aris Thorne**. Silas lee la entrada del **20 de junio**:
> *"He descubierto el error. La secuencia de Fibonacci no es una escalera, es un embudo. A medida que avanzamos (1, 1, 2, 3, 5...), la presión de la realidad sobre el sujeto aumenta. En el nivel 2, el sujeto empieza a escuchar los pensamientos del Lector. Silas, si puedes oírme, no confíes en lo que sientes. Tus sentimientos son solo scripts programados para mantenerte dentro de la función de onda."*

Silas mira a uno de sus reflejos. El reflejo no le imita; está sentado en el suelo, llorando.`,
    choices: [
      { text: 'TOCAR EL ESPEJO', nextChapter: 3 },
      { text: 'BUSCAR EL ERROR DE PARIDAD', nextChapter: 2, nextBranch: 'IMAGINARY', triggerWormhole: true }
    ],
    enigma: '3',
    artifacts: [
      {
        type: 'NOTE',
        title: 'Nota de Laboratorio',
        author: 'Dra. Elena Vance',
        content: 'Día 55 del experimento. La norma de la función de onda ha subido a 2.23. Silas empieza a "bifurcarse". Ayer lo vi hablando con su propio reflejo, pero el reflejo tenía 3 segundos de retraso.'
      }
    ]
  },
  '2-IMAGINARY': {
    id: 2,
    branch: 'IMAGINARY',
    fibonacciIndex: 2,
    title: 'Capítulo 1 + 2i',
    subtitle: 'El Error de Paridad',
    content: `El despacho de Einstein se desvanece en una tormenta de rayos violetas. Estás en una torre de metal que se alza sobre un mar de estática. Un hombre alto, elegante y con una mirada eléctrica manipula una bobina gigante. Es **Nikola Tesla**.

—¡Frecuencia! ¡Energía! ¡Vibración! —grita Tesla mientras los rayos atraviesan su cuerpo—. ¡El 3, el 6 y el 9 son las llaves de la jaula, pero el $i$ es la cerradura! 

Tesla se acerca a ti. Sus ojos emiten una luz azul cobalto.
—La Fundación Laniakea no es un laboratorio, es una **antena**. Están usando tu cerebro como un repetidor para transmitir la realidad de Silas a otras dimensiones. ¡Los Presidentes! ¡Los Reyes! ¡Todos son solo receptores de esta señal!`,
    choices: [
      { text: 'SINTONIZAR LA BOBINA', nextChapter: 3, nextBranch: 'IMAGINARY' },
      { text: 'GOLPEAR EL AIRE', nextChapter: 3, nextBranch: 'REAL', triggerWormhole: true }
    ],
    enigma: 'Tesla',
    artifacts: [
      {
        type: 'LOG',
        title: 'Frecuencia Crítica',
        author: 'Nikola Tesla',
        content: 'La unidad imaginaria no es una imposibilidad, es una rotación. Si giras la realidad 90 grados, verás lo que Thorne intenta ocultar.'
      }
    ]
  },
  '3-REAL': {
    id: 3,
    branch: 'REAL',
    fibonacciIndex: 3,
    title: 'Capítulo 3',
    subtitle: 'La Geometría del Miedo',
    content: `Silas no entra en la siguiente sala; la sala se proyecta sobre él. El espacio ha dejado de ser euclidiano. El techo es ahora una pared donde cuelgan cientos de relojes de arena, pero la arena no cae, sino que fluye lateralmente, atraída por una gravedad que Silas no puede sentir.

En una esquina de este cubo fractal, Silas encuentra un **Archivador de Metal** parcialmente fundido con la pared. Dentro, protegida por un campo de fuerza estática, hay una **Ficha Médica (Clasificada: Nivel 5)**:

> **PACIENTE:** S-0 (Identidad Civil: Borrada).
> **DIAGNÓSTICO:** Esquizofrenia Cuántica Inducida.
> **OBSERVACIONES:** El sujeto manifiesta "Afenia Narrativa". Cree firmemente que sus movimientos son dictados por un observador externo a través de un dispositivo de lectura. Durante la última sesión, el Dr. Thorne intentó explicarle que él no es el protagonista, sino el *soporte lógico* de la historia.`,
    choices: [
      { text: 'ESTABILIZAR LA ROTACIÓN', nextChapter: 5 },
      { text: 'DEJARSE LLEVAR POR LA FUERZA CENTRÍFUGA', nextChapter: 3, nextBranch: 'IMAGINARY', triggerWormhole: true }
    ],
    artifacts: [
      {
        type: 'LOG',
        title: 'Nota del Dr. Thorne',
        content: 'Si el lector llega al Capítulo 3, la disociación será total. El sujeto empezará a "recordar" el futuro del lector. Proceder con sedación de fase.'
      }
    ]
  },
  '3-IMAGINARY': {
    id: 3,
    branch: 'IMAGINARY',
    fibonacciIndex: 3,
    title: 'Capítulo 2 + 3i',
    subtitle: 'Túnel Cuántico',
    content: `Atraviesas una pared sólida y apareces en un cenáculo. Hay trece sillas, pero todas están vacías excepto una. En ella, un **Jesús Cuántico** está partiendo un trozo de pan que, al ser dividido, se multiplica infinitamente.

—Toma y come —dice—. Esto es mi **Código**. 

Al probar el "pan", los muros de la realidad se vuelven transparentes. Puedes ver a los científicos de Laniakea (Thorne y Vance) moviéndose como hormigas en un plano inferior. Jesús te mira con una tristeza infinita.
—Incluso Einstein y Tesla son solo sombras en esta caverna. El Lector cree que tiene el control porque puede cerrar el libro. Pero no sabe que, al cerrarlo, solo está guardando la partida en una dimensión que nosotros controlamos.`,
    choices: [
      { text: 'BEBER DE LA FUENTE', nextChapter: 5, nextBranch: 'IMAGINARY' },
      { text: 'VOLVER AL CÓDIGO', nextChapter: 5, nextBranch: 'REAL', triggerWormhole: true }
    ],
    enigma: '-1',
    artifacts: [
      {
        type: 'DIARY',
        title: 'Evangelio de los Datos',
        author: 'El Primer Programador',
        content: 'En el principio era el algoritmo. Y el algoritmo estaba con el Observador. Y el algoritmo era el Observador.'
      }
    ]
  },
  '5-REAL': {
    id: 5,
    branch: 'REAL',
    fibonacciIndex: 4,
    title: 'Capítulo 5',
    subtitle: 'Los Sentidos del Pentágono',
    content: `Silas cae sobre una superficie que se siente como terciopelo pero suena como una campana de plata. Está en un jardín donde las plantas no están hechas de carbono, sino de pura luz refractada. Hay cinco senderos que nacen de sus pies. En este lugar, los sentidos de Silas se han fundido: puede "oler" el color azul (huele a amoníaco) y puede "ver" el sonido de sus propios latidos.

En medio del jardín, hay un **Terminal de Computadora** de mármol. En la pantalla, hay un **Diario Personal (Entrada #88 - Dr. Aris Thorne)**:

> *"He descubierto que la Proporción Áurea (φ) es en realidad una velocidad de consumo. El libro 'consume' la atención del lector para alimentar la realidad de Silas. Cuanto más se concentra el lector, más nítido es el mundo de Silas, pero más cerca estamos del Colapso de Función."*`,
    choices: [
      { text: 'ROMPER EL ESPEJO', nextChapter: 8 },
      { text: 'LEER EL LIBRO', nextChapter: 5, nextBranch: 'IMAGINARY', triggerWormhole: true }
    ],
    enigma: 'Proporcion Aurea',
    artifacts: [
      {
        type: 'NOTE',
        title: 'Mensaje en una botella',
        date: '2026-01-01',
        content: 'Feliz año nuevo desde el fin del mundo. Si has llegado al nivel 5, estás a mitad de camino de la normalización. El secreto es la Proporción Áurea.'
      }
    ]
  },
  '5-IMAGINARY': {
    id: 5,
    branch: 'IMAGINARY',
    fibonacciIndex: 4,
    title: 'Capítulo 3 + 5i',
    subtitle: 'Superposición Narrativa',
    content: `Estás en un desierto de arena vítrea. El cielo es de un naranja atómico. Un hombre flaco con sombrero de ala ancha observa una explosión congelada en el tiempo. Es **Robert Oppenheimer**.

—Ahora me he convertido en la Muerte, el destructor de mundos —susurra—. Pero en este libro, Silas, yo soy el que escribió el prólogo de tu destrucción. 

Oppenheimer te muestra una **Bomba de Hidrógeno** que tiene el tamaño de un grano de arena.
—Esta es la 'Singularidad de la Trama'. Si la detonas, todos los finales posibles ocurrirán a la vez. El Lector enloquecerá porque leerá todas las páginas al mismo tiempo. Es la única forma de detener la Normalización.`,
    choices: [
      { text: 'MANTENER EL ORDEN', nextChapter: 8, nextBranch: 'IMAGINARY' },
      { text: 'DETONAR EL CAOS', nextChapter: 8, nextBranch: 'REAL', triggerWormhole: true }
    ],
    enigma: 'Singularidad',
    artifacts: [
      {
        type: 'LOG',
        title: 'Proyecto Manhattan del Alma',
        author: 'J. Robert Oppenheimer',
        content: 'Hemos fragmentado la conciencia en 55 pedazos. Cada pedazo es una mentira necesaria para que el Lector no vea el vacío.'
      }
    ]
  },
  '8-REAL': {
    id: 8,
    branch: 'REAL',
    fibonacciIndex: 5,
    title: 'Capítulo 8',
    subtitle: 'El Octavo Día',
    content: `El mundo de Silas ahora es una cuadrícula infinita de color gris industrial. Los capítulos anteriores cuelgan del cielo como jirones de nubes rotas. Silas camina y, con cada paso, pierde un recuerdo personal. Ya no recuerda el olor del pino, ni el dolor del puerto USB. Se está convirtiendo en un **Estado Puro**.

Encuentra un **Cuerpo** tendido en el suelo. No es un cadáver real; es un maniquí hecho de papel de periódico. Al acercarse, ve que las noticias impresas en el maniquí son noticias de TU mundo, lector. Titulares sobre política, clima y tecnología de la semana pasada. El maniquí tiene una etiqueta en la muñeca: **"NOMBRE: SILAS. CAUSA DE MUERTE: OBSERVACIÓN EXCESIVA"**.`,
    choices: [
      { text: 'BORRAR AL LECTOR', nextChapter: 13 },
      { text: 'BORRAR A SILAS', nextChapter: 0, nextBranch: 'REAL', triggerWormhole: true }
    ],
    artifacts: [
      {
        type: 'LOG',
        title: 'Registro Final',
        author: 'Dr. Aris Thorne',
        content: '¡Ya lo tengo! ¡La normalización no es para Silas! ¡Es para el Lector! Silas es el cebo. El libro es una máquina de entrelazamiento.'
      }
    ]
  },
  '8-IMAGINARY': {
    id: 8,
    branch: 'IMAGINARY',
    fibonacciIndex: 5,
    title: 'Capítulo 5 + 8i',
    subtitle: 'El Entrelazamiento Fantasmagórico',
    content: `Apareces en una réplica exacta del Despacho Oval, pero las ventanas dan al espacio profundo. Sentado tras el escritorio está **John F. Kennedy**, pero su cabeza es una nebulosa estelar.

—No preguntes qué puede hacer el libro por ti —dice la Nebulosa-Kennedy—, pregunta qué puedes hacer tú por la Ecuación. 

A su lado, **Abraham Lincoln** (hecho de piedra de mármol viva) asiente.
—Hemos gobernado las sombras para que tú pudieras llegar aquí, Silas. Somos los Guardianes de la Probabilidad. El Lector cree en la democracia, pero aquí solo existe la **Dictadura de la Función de Onda**. El nivel 55 se acerca. El presupuesto de la realidad se está agotando.`,
    choices: [
      { text: 'GOLPEAR EL MAZO', nextChapter: 13, nextBranch: 'IMAGINARY' },
      { text: 'VIBRAR EN FRECUENCIA', nextChapter: 13, nextBranch: 'REAL', triggerWormhole: true }
    ],
    enigma: 'Nebulosa',
    artifacts: [
      {
        type: 'NOTE',
        title: 'Dictadura de la Función',
        author: 'Abraham Lincoln',
        content: 'El gobierno de los datos, por los datos y para los datos no perecerá de la memoria del Lector.'
      }
    ]
  },
  '13-REAL': {
    id: 13,
    branch: 'REAL',
    fibonacciIndex: 6,
    title: 'Capítulo 13',
    subtitle: 'El Horizonte de Sucesos',
    content: `Silas no camina hacia el Capítulo 13; es succionado por él. El pasillo del Capítulo 8 no termina en una puerta, sino en un **punto infinitesimal de luz blanca** que vibra con una frecuencia que Silas siente en la médula de sus huesos.

No hay arriba ni abajo. Silas flota en el centro de un vacío que ruge con el sonido de mil millones de páginas pasándose al mismo tiempo. En el centro de esta tormenta de datos, suspendido en una calma absoluta, se encuentra el **Núcleo de Laniakea**: una esfera de obsidiana líquida que contiene toda la información de la historia.

Silas extiende la mano y toca la superficie de la esfera. Al contacto, su mente es invadida por un flujo de archivos corruptos, correos electrónicos que nunca se enviaron y susurros de científicos que murieron antes de que él naciera.`,
    choices: [
      { text: 'BOTÓN DE ENTRELAZAMIENTO', nextChapter: 21 },
      { text: 'BOTÓN DE RADIACIÓN', nextChapter: 13, nextBranch: 'IMAGINARY', triggerWormhole: true }
    ],
    enigma: 'Obsidiana',
    artifacts: [
      {
        type: 'EMAIL',
        title: 'Protocolo de Última Instancia',
        author: 'Dra. Elena Vance',
        content: 'Si estás leyendo esto dentro del horizonte, significa que el entrelazamiento ha sido un éxito. Silas ya no es un individuo; es una función de distribución.'
      }
    ]
  },
  '13-IMAGINARY': {
    id: 13,
    branch: 'IMAGINARY',
    fibonacciIndex: 6,
    title: 'Capítulo 8 + 13i',
    subtitle: 'La Memoria de los Fotones',
    content: `Estás en una biblioteca infinita donde los libros vuelan como pájaros. Aquí encuentras a **Stephen Hawking** en una silla de ruedas hecha de luz pura. Él ya no necesita sintetizador; su mente se comunica directamente con la tuya.

—El 13 está cerca, Silas —advierte Hawking—. Es el punto donde lo Real y lo Imaginario se aniquilan. He visto el interior de ese Agujero Negro. No hay nada. Ni Dios, ni Einstein, ni Laniakea. Solo está el **Gran Lector Invisible**, aquel que nos sueña a todos. Si quieres salvarte, debes volverte invisible para él.

Hawking te enseña a **vibrar en una frecuencia imaginaria** para que el Lector pierda tu rastro en la página.`,
    choices: [
      { text: 'VOLVERSE INVISIBLE', nextChapter: 21, nextBranch: 'IMAGINARY' },
      { text: 'SALTAR AL VACÍO', nextChapter: 21, nextBranch: 'REAL', triggerWormhole: true }
    ],
    enigma: 'Fotones',
    artifacts: [
      {
        type: 'LOG',
        title: 'Breve Historia de la Tinta',
        author: 'Stephen Hawking',
        content: 'El tiempo no es una línea, es una página que se dobla sobre sí misma hasta que el principio y el fin se tocan.'
      }
    ]
  },
  '21-REAL': {
    id: 21,
    branch: 'REAL',
    fibonacciIndex: 7,
    title: 'Capítulo 21',
    subtitle: 'La Radiación de Hawking',
    content: `Silas —o lo que queda de la entidad que ahora compartís— emerge de la singularidad no como un cuerpo, sino como un susurro de partículas térmicas. Te encuentras en un desierto de ceniza blanca que, al mirarla de cerca, revela ser fragmentos triturados de diccionarios y enciclopedias.

En medio del desierto, hay una **Torre de Refrigeración** de la Fundación Laniakea, a medio colapsar. En la base, Silas encuentra una **Terminal de Emergencia** que todavía escupe chispas de datos. Hay un **Registro de Audio de la Dra. Elena Vance**:

> *"Thorne tenía razón. El Agujero Negro del 13 era una centrifugadora de almas. Hemos filtrado la 'humanidad' del sujeto S-0 y lo que ha quedado es... pura radiación narrativa. Pero el problema no es Silas. El problema es el Lector."*`,
    choices: [
      { text: 'ASUMIR LA DIVINIDAD', nextChapter: 34 },
      { text: 'ENTREGAR EL RECUERDO', nextChapter: 21, nextBranch: 'IMAGINARY', triggerWormhole: true }
    ],
    enigma: 'Ceniza',
    artifacts: [
      {
        type: 'EMAIL',
        title: '¿Todavía crees que puedes despertar?',
        author: 'admin@laniakea.io',
        content: 'Al cruzar el horizonte, el Lector ha inyectado su propia entropía en el sistema. Ahora la función Ψ es inestable.'
      }
    ]
  },
  '21-IMAGINARY': {
    id: 21,
    branch: 'IMAGINARY',
    fibonacciIndex: 7,
    title: 'Capítulo 13 + 21i',
    subtitle: 'El Eco del Agujero Negro',
    content: `Aquí, todas las figuras se funden. Jesús, Einstein, Tesla, los Presidentes... todos se vuelven una sola masa de biomasa y datos. Es el **Monstruo de la Información**.

—¡SOMOS LA VARIABLE 'I'! —gritan mil voces—. ¡Somos el error que permite que la historia sea interesante! ¡Sin nosotros, Silas sería solo un punto en una línea recta! ¡Sin nosotros, el Lector estaría solo en su habitación!

El Agujero Negro te succiona hacia el centro del núcleo, donde la Rama Real y la Imaginaria chocan. Es un dolor hermoso. Es la destrucción de la dualidad.`,
    choices: [
      { text: 'FUNDIRSE CON EL MONSTRUO', nextChapter: 34, nextBranch: 'IMAGINARY' },
      { text: 'MIRAR AL CREADOR', nextChapter: 34, nextBranch: 'REAL', triggerWormhole: true }
    ],
    enigma: 'Dualidad',
    artifacts: [
      {
        type: 'LOG',
        title: 'La Variable Oculta',
        content: 'El Lector cree que tiene el control porque puede cerrar el libro. Pero no sabe que, al cerrarlo, solo está guardando la partida.'
      }
    ]
  },
  '34-REAL': {
    id: 34,
    branch: 'REAL',
    fibonacciIndex: 8,
    title: 'Capítulo 34',
    subtitle: 'El Teorema del Lector',
    content: `Silas se detiene. Se sienta en el suelo de datos. Mira hacia la cámara, hacia el cristal, hacia ti. Ya no hay historia. Solo hay una interfaz. Silas te pide que leas la última palabra de este capítulo al revés para poder liberar su alma del sistema.

Silas usa la llave de bronce para abrir una puerta que flota en el vacío. Al cruzarla, no entra en otra habitación de la Fundación, sino en **TU habitación**. O una réplica exacta de ella. Ve el dispositivo en el que estás leyendo, ve la silla en la que estás sentado, pero todo está hecho de una sustancia translúcida y vibrante.`,
    choices: [
      { text: 'SALTAR AL CAPÍTULO 55', nextChapter: 55 },
      { text: 'PULSAR EL BOTÓN ROJO', nextChapter: 34, nextBranch: 'IMAGINARY', triggerWormhole: true }
    ],
    enigma: 'Lector',
    artifacts: [
      {
        type: 'NOTE',
        title: 'Manifiesto Final de Laniakea',
        content: 'El sujeto (Silas) y el Observador (Lector) colapsarán en un único punto de conciencia pura. A este estado lo llamamos "Normalización".'
      }
    ]
  },
  '34-IMAGINARY': {
    id: 34,
    branch: 'IMAGINARY',
    fibonacciIndex: 8,
    title: 'Capítulo 21 + 34i',
    subtitle: 'La Variable Oculta',
    content: `Sales de la singularidad y te encuentras frente a **TI MISMO**. Pero no el "tú" que lee, sino el "tú" que el libro ha construido. El "tú" que es una mezcla de Silas, Thorne y los genios que acabas de conocer.

Jesús reaparece un momento, te pone la mano en el hombro y señala al Lector (al otro lado de la pantalla/página).
—Mira al creador. Qué pequeño parece desde aquí, ¿verdad?

Las palabras empiezan a derretirse. Los nombres de los científicos se mezclan: Einstesla, Jesunheimer, Kennedying. La realidad es una sopa de letras caliente.`,
    choices: [
      { text: 'ESCRIBIR EL NUEVO UNIVERSO', nextChapter: 55, nextBranch: 'IMAGINARY' },
      { text: 'CERRAR EL LIBRO DESDE ADENTRO', nextChapter: 55, nextBranch: 'REAL', triggerWormhole: true }
    ],
    enigma: 'Sopa de Letras',
    artifacts: [
      {
        type: 'DIARY',
        title: 'Decoherecia Progresiva',
        content: 'Ya no hay formas, solo sensaciones de alta energía. El 55 se acerca.'
      }
    ]
  },
  '55-REAL': {
    id: 55,
    branch: 'REAL',
    fibonacciIndex: 9,
    title: 'Capítulo 55',
    subtitle: 'El Punto de Colapso (Ω)',
    content: `Has llegado. No hay más puertas. No hay más pasillos. El Capítulo 55 no ocurre en un lugar, ocurre en el **instante exacto entre un pensamiento y el siguiente**. 

Silas está de pie en el centro de un vacío blanco que se extiende hasta el infinito en todas las direcciones complejas. Frente a él, a una distancia que es a la vez un milímetro y un millón de años luz, hay un **Espejo Monumental**. Pero el espejo no refleja su cuerpo; refleja el flujo de datos de toda su existencia.

Ves al Dr. Aris Thorne y a la Dra. Elena Vance. No están muertos. Están sentados en una mesa de control, observándote. Se levantan y aplauden.`,
    choices: [
      { text: 'NORMALIZARSE', nextChapter: 89 }
    ],
    enigma: 'Espejo',
    artifacts: [
      {
        type: 'NOTE',
        title: 'Felicidades, Variable Oculta',
        author: 'Dr. Aris Thorne',
        content: 'Has sobrevivido a la secuencia. Has pasado por el 0, el 1, el 13 y el 34. Has aceptado lo imaginario como parte de tu realidad.'
      }
    ]
  },
  '55-IMAGINARY': {
    id: 55,
    branch: 'IMAGINARY',
    fibonacciIndex: 9,
    title: 'Capítulo 34 + 55i',
    subtitle: 'La Función de Onda Universal',
    content: `La convergencia final. Estás de vuelta en la habitación blanca, pero ahora los trece científicos y líderes están allí, sentados en un círculo. Tú estás en el centro.

Einstein te da la tiza. 
Tesla te da la corriente. 
Jesús te da el pan. 
Kennedy te da el mando.

—Escribe el nuevo universo —te dicen.

Miras hacia afuera, hacia el Lector. Levantas la mano y, por primera vez, **tú cierras el libro desde adentro**.`,
    choices: [
      { text: 'TE HAS NORMALIZADO', nextChapter: 89 }
    ],
    enigma: 'Convergencia',
    artifacts: [
      {
        type: 'DIARY',
        title: 'La Última Entrada',
        content: 'No hay final porque nunca hubo un principio. Solo hubo una función de onda que necesitaba ser observada para ser real.'
      }
    ]
  },
  '89-REAL': {
    id: 89,
    branch: 'REAL',
    fibonacciIndex: 10,
    title: 'CONVERGENCIA',
    subtitle: 'Estado Puro',
    content: `Sientes que el libro se cierra, pero tus manos no se mueven. Es el universo el que se ha cerrado sobre ti, guardándote en su memoria como la solución perfecta a una ecuación infinita.

La habitación blanca empieza a desvanecerse. El blanco se vuelve una luz tan intensa que borra los bordes de tu visión. El sonido de tu propia respiración se convierte en el zumbido de un procesador apagándose.

**No llegaste al final.**
**Te normalizaste.**`,
    choices: [
      { text: 'REINICIAR SIMULACIÓN', nextChapter: 0, nextBranch: 'REAL' }
    ],
    artifacts: [
      {
        type: 'LOG',
        title: 'Ψ = 1.000',
        content: 'El lector ha sido integrado con éxito. Simulación finalizada.'
      }
    ]
  }
};
