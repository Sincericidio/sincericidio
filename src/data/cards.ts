import { GameCard } from '../types';

export const INITIAL_CARDS: GameCard[] = [
  // ==========================================
  // CATEGORÍA: PICANTE / HOT (+18)
  // ==========================================
  {
    id: 'pic-1',
    category: 'picante',
    question: 'Si estuvieras obligado/a a tener una aventura de una noche con alguien de este grupo, ¿a quién elegirías y por qué razón?',
    intensity: 'nuclear',
    punishment: 'Bebe 3 tragos grandes y no digas nada.',
    tag: 'Fantasías',
    target: 'individual'
  },
  {
    id: 'pic-2',
    category: 'picante',
    question: '¿Cuál es la fantasía más inconfesable o fetiche raro que jamás te has atrevido a admitir en voz alta?',
    intensity: 'nuclear',
    punishment: 'Bebe 2 tragos o enseña tu última foto enviada.',
    tag: 'Secretos',
    target: 'individual'
  },
  {
    id: 'pic-3',
    category: 'picante',
    question: '¿Alguna vez has tenido un sueño erótico con la pareja o el/la ex de alguien presente? Di quién sin dar rodeos.',
    intensity: 'nuclear',
    punishment: 'Bebe 3 tragos y haz 15 sentadillas.',
    tag: 'Pecados',
    target: 'individual'
  },
  {
    id: 'pic-4',
    category: 'picante',
    question: '¿Cuál ha sido el lugar más arriesgado o prohibido donde has tenido relaciones íntimas?',
    intensity: 'picante',
    punishment: 'Bebe 2 tragos.',
    tag: 'Anécdotas',
    target: 'individual'
  },
  {
    id: 'pic-5',
    category: 'picante',
    question: 'Puntúa del 1 al 10 tu nivel de compatibilidad en la cama con tu última pareja y explica por qué no fue un 10.',
    intensity: 'picante',
    punishment: 'Bebe 2 tragos dobles.',
    tag: 'Ex-Parejas',
    target: 'individual'
  },
  {
    id: 'pic-6',
    category: 'picante',
    question: '¿Qué es lo peor que te ha pasado o has hecho durante un momento íntimo que te haya dado vergüenza ajena?',
    intensity: 'medio',
    punishment: 'Bebe 1 trago.',
    tag: 'Momentos Tierra Trágame',
    target: 'individual'
  },
  {
    id: 'pic-7',
    category: 'picante',
    question: '¿Has fingido alguna vez un orgasmo de manera exagerada para que el momento acabara rápido? Cuenta los detalles.',
    intensity: 'picante',
    punishment: 'Bebe 2 tragos.',
    tag: 'Sinceridad Total',
    target: 'individual'
  },
  {
    id: 'pic-8',
    category: 'picante',
    question: '¿Qué persona famosa o conocida te atrae físicamente aunque te dé vergüenza admitirlo ante todo el mundo?',
    intensity: 'suave',
    punishment: 'Bebe 1 trago.',
    tag: 'Crush Oculto',
    target: 'individual'
  },
  {
    id: 'pic-9',
    category: 'picante',
    question: 'Mira fijamente a los ojos a la persona a tu izquierda y confiesa algo que te parezca muy atractivo de su cuerpo o personalidad.',
    intensity: 'picante',
    punishment: 'Bebe 2 tragos los dos.',
    tag: 'Tensión Sexual',
    target: 'left-player'
  },
  {
    id: 'pic-10',
    category: 'picante',
    question: '¿Cuál es el mensaje de texto más subido de tono o foto que tienes en tu móvil ahora mismo? Describe el contexto.',
    intensity: 'nuclear',
    punishment: 'Enseña la miniatura o bebe 3 tragos.',
    tag: 'Galería Secreta',
    target: 'individual'
  },

  // ==========================================
  // CATEGORÍA: CONFESIONES OSCURAS
  // ==========================================
  {
    id: 'conf-1',
    category: 'confesiones',
    question: '¿Qué mentira le has dicho a alguien de esta sala que aún sigue creyendo como verdad absoluta?',
    intensity: 'nuclear',
    punishment: 'Bebe 3 tragos y pide perdón al afectado/a.',
    tag: 'Mentiras',
    target: 'individual'
  },
  {
    id: 'conf-2',
    category: 'confesiones',
    question: '¿Alguna vez has revisado a escondidas el móvil, mensajes o redes sociales de tu pareja o de un amigo/a?',
    intensity: 'picante',
    punishment: 'Bebe 2 tragos y deja tu móvil desbloqueado 1 minuto en la mesa.',
    tag: 'Toxicidad',
    target: 'individual'
  },
  {
    id: 'conf-3',
    category: 'confesiones',
    question: '¿Qué opinión sincera tienes sobre la pareja actual (o última) de alguien de este grupo que nunca te has atrevido a decir?',
    intensity: 'nuclear',
    punishment: 'Bebe 3 tragos bien servidos.',
    tag: 'Bomba',
    target: 'individual'
  },
  {
    id: 'conf-4',
    category: 'confesiones',
    question: '¿Cuál es la cosa más ilegal o inmoral que has hecho en tu vida y de la que nunca te han pillado?',
    intensity: 'nuclear',
    punishment: 'Bebe 2 tragos y cuéntala sin detalles legales.',
    tag: 'Delitos Menores',
    target: 'individual'
  },
  {
    id: 'conf-5',
    category: 'confesiones',
    question: '¿Has fingido estar enfermo/a o en un drama familiar para no asistir al plan o cumpleaños de alguien que conoces?',
    intensity: 'medio',
    punishment: 'Bebe 1 trago.',
    tag: 'Excusas',
    target: 'individual'
  },
  {
    id: 'conf-6',
    category: 'confesiones',
    question: '¿Alguna vez has sentido envidia profunda de los logros, físico o dinero de un amigo cercano? ¿De quién y cuándo?',
    intensity: 'picante',
    punishment: 'Bebe 2 tragos.',
    tag: 'Ego',
    target: 'individual'
  },
  {
    id: 'conf-7',
    category: 'confesiones',
    question: '¿Qué es lo más asqueroso o poco higiénico que haces a solas en tu casa cuando nadie te puede ver?',
    intensity: 'medio',
    punishment: 'Bebe 1 trago.',
    tag: 'Costumbres Ocultas',
    target: 'individual'
  },
  {
    id: 'conf-8',
    category: 'confesiones',
    question: '¿Has hablado mal a las espaldas de alguien presente en esta habitación durante el último año? Sé sincero/a.',
    intensity: 'nuclear',
    punishment: 'Bebe 3 tragos.',
    tag: 'Traición',
    target: 'individual'
  },
  {
    id: 'conf-9',
    category: 'confesiones',
    question: 'Si el mundo se acabara mañana y solo pudieras salvar a 2 personas de esta sala, ¿a quiénes dejarías fuera?',
    intensity: 'nuclear',
    punishment: 'Bebe 3 tragos y abraza a los descartados.',
    tag: 'Dilema Letal',
    target: 'individual'
  },

  // ==========================================
  // CATEGORÍA: MODO FIESTA & RETOS
  // ==========================================
  {
    id: 'fie-1',
    category: 'fiesta',
    question: 'Elige a un jugador. Deberá leer en voz alta tus últimas 3 búsquedas en Google o Instagram, o ambos beben 2 tragos.',
    intensity: 'picante',
    punishment: 'Ambos beben 2 tragos.',
    tag: 'Historial',
    target: 'individual'
  },
  {
    id: 'fie-2',
    category: 'fiesta',
    question: 'Manda un mensaje de audio de 5 segundos a tu ex o a tu último contacto de WhatsApp diciendo "Aún pienso en eso...", o bebe 3 tragos.',
    intensity: 'nuclear',
    punishment: 'Bebe 3 tragos de golpe.',
    tag: 'Ruleta Rusa',
    target: 'individual'
  },
  {
    id: 'fie-3',
    category: 'fiesta',
    question: 'Imita la forma de hablar y caminar de la persona enfrente tuya hasta que el grupo adivine quién es.',
    intensity: 'medio',
    punishment: 'Si no lo haces, bebe 2 tragos.',
    tag: 'Show Time',
    target: 'individual'
  },
  {
    id: 'fie-4',
    category: 'fiesta',
    question: 'Todos señalan al mismo tiempo a la persona que peor aguanta las copas de este grupo. La persona más señalada bebe 2 tragos.',
    intensity: 'medio',
    punishment: 'El más votado bebe.',
    tag: 'Democracia',
    target: 'group'
  },
  {
    id: 'fie-5',
    category: 'fiesta',
    question: 'Llamada rápida: llama a un amigo fuera de la fiesta y dile que te vas a casar en Las Vegas el mes que viene. Mantén la mentira 30 segundos.',
    intensity: 'picante',
    punishment: 'Bebe 2 tragos.',
    tag: 'Broma Telefónica',
    target: 'individual'
  },
  {
    id: 'fie-6',
    category: 'fiesta',
    question: 'Trago en cascada: tú empiezas a beber y nadie a tu derecha puede parar hasta que tú bajes el vaso.',
    intensity: 'picante',
    punishment: 'El que pare antes bebe penalización.',
    tag: 'Cascada',
    target: 'group'
  },
  {
    id: 'fie-7',
    category: 'fiesta',
    question: 'Intercambia tu bebida con la persona que tengas a tu derecha durante las siguientes 2 rondas.',
    intensity: 'suave',
    punishment: 'Bebe un trago de cada vaso.',
    tag: 'Trueque',
    target: 'right-player'
  },
  {
    id: 'fie-8',
    category: 'fiesta',
    question: 'Confiesa tu anécdota de fiesta más vergonzosa donde perdiste el control por completo o terminaste en el lugar equivocado.',
    intensity: 'medio',
    punishment: 'Bebe 2 tragos.',
    tag: 'Resaca Moral',
    target: 'individual'
  },

  // ==========================================
  // CATEGORÍA: ¿QUIÉN ES MÁS PROBABLE QUE...? (VOTACIONES)
  // ==========================================
  {
    id: 'vot-1',
    category: 'votacion',
    question: '¿Quién es más probable que termine en la cárcel por una estupidez en una noche de fiesta?',
    intensity: 'medio',
    punishment: 'El más votado explica su hipotético crimen y bebe 2 tragos.',
    tag: 'Fichado',
    target: 'group'
  },
  {
    id: 'vot-2',
    category: 'votacion',
    question: '¿Quién es más probable que vuelva con su ex tóxico/a por cuarta vez?',
    intensity: 'picante',
    punishment: 'El más votado bebe 2 tragos y se le confisca el teléfono 5 minutos.',
    tag: 'Recaída',
    target: 'group'
  },
  {
    id: 'vot-3',
    category: 'votacion',
    question: '¿Quién es más probable que tenga una doble vida secreta o una cuenta falsa en redes para espiar a la gente?',
    intensity: 'medio',
    punishment: 'El más votado debe confesar si tiene alguna cuenta secundaria.',
    tag: 'FBI',
    target: 'group'
  },
  {
    id: 'vot-4',
    category: 'votacion',
    question: '¿Quién es más probable que se case por dinero antes que por amor verdadero?',
    intensity: 'picante',
    punishment: 'El más votado bebe 1 trago y dice su cifra mínima.',
    tag: 'Interés',
    target: 'group'
  },
  {
    id: 'vot-5',
    category: 'votacion',
    question: '¿Quién es más probable que olvide el cumpleaños de su mejor amigo o el aniversario de pareja?',
    intensity: 'suave',
    punishment: 'El más votado bebe 1 trago.',
    tag: 'Despistado',
    target: 'group'
  },
  {
    id: 'vot-6',
    category: 'votacion',
    question: '¿Quién es más probable que acabe siendo una celebridad de OnlyFans o reality show?',
    intensity: 'picante',
    punishment: 'El más votado posa para una foto del grupo.',
    tag: 'Fama',
    target: 'group'
  },
  {
    id: 'vot-7',
    category: 'votacion',
    question: '¿Quién tiene peor gusto a la hora de elegir a sus parejas sentimentales?',
    intensity: 'picante',
    punishment: 'El más votado bebe 2 tragos.',
    tag: 'Ojo Clínico',
    target: 'group'
  },

  // ==========================================
  // CATEGORÍA: AMISTAD & PSICOLOGÍA
  // ==========================================
  {
    id: 'ami-1',
    category: 'amistad',
    question: 'Di con total sinceridad la primera impresión que tuviste de cada persona de esta mesa y cómo ha cambiado hoy.',
    intensity: 'medio',
    punishment: 'Bebe 2 tragos si prefieres callar.',
    tag: 'Primeras Impresiones',
    target: 'group'
  },
  {
    id: 'ami-2',
    category: 'amistad',
    question: 'Si tuvieras que confiarle las llaves de tu casa y tu tarjeta de crédito a una sola persona de aquí, ¿quién sería y quién NUNCA?',
    intensity: 'picante',
    punishment: 'Bebe 2 tragos.',
    tag: 'Confianza',
    target: 'individual'
  },
  {
    id: 'ami-3',
    category: 'amistad',
    question: '¿Qué rasgo de tu personalidad crees que es el más insoportable para tus amigos cercanos?',
    intensity: 'suave',
    punishment: 'Los demás pueden opinar o bebes 1 trago.',
    tag: 'Autocrítica',
    target: 'individual'
  },
  {
    id: 'ami-4',
    category: 'amistad',
    question: '¿Alguna vez te has sentido excluido o en segundo plano en este grupo de amigos? Explica cuándo y qué sentiste.',
    intensity: 'picante',
    punishment: 'Bebe 2 tragos y recibe un abrazo colectivo.',
    tag: 'Corazón Abierto',
    target: 'individual'
  },
  {
    id: 'ami-5',
    category: 'amistad',
    question: 'Menciona un favor que hiciste por compromiso y que en realidad odiaste hacer.',
    intensity: 'medio',
    punishment: 'Bebe 1 trago.',
    tag: 'Compromisos',
    target: 'individual'
  },

  // ==========================================
  // CATEGORÍA: SECRETOS & TRAPOS SUCIOS
  // ==========================================
  {
    id: 'sec-1',
    category: 'secretos',
    question: '¿Cuál es la mentira más gorda que le has dicho a tus padres y que aún no han descubierto?',
    intensity: 'medio',
    punishment: 'Bebe 2 tragos.',
    tag: 'Pecados Familiares',
    target: 'individual'
  },
  {
    id: 'sec-2',
    category: 'secretos',
    question: '¿Alguna vez has roto algo de valor en casa ajena y lo has escondido o culpado a la mascota/otra persona?',
    intensity: 'suave',
    punishment: 'Bebe 1 trago.',
    tag: 'Sabotaje',
    target: 'individual'
  },
  {
    id: 'sec-3',
    category: 'secretos',
    question: '¿Cuál es la compra más estúpida, cara y vergonzosa que has hecho en tu vida?',
    intensity: 'suave',
    punishment: 'Bebe 1 trago.',
    tag: 'Finanzas',
    target: 'individual'
  },
  {
    id: 'sec-4',
    category: 'secretos',
    question: '¿Alguna vez te has enamorado o sentido obsesión secreta por el hermano/a o el padre/madre de un amigo?',
    intensity: 'nuclear',
    punishment: 'Bebe 3 tragos.',
    tag: 'Tabú',
    target: 'individual'
  },
  {
    id: 'sec-5',
    category: 'secretos',
    question: '¿Qué es lo que más te avergüenza de tu historial de internet o de tu lista de reproducción musical?',
    intensity: 'medio',
    punishment: 'Pon una de esas canciones ahora o bebe 2 tragos.',
    tag: 'Placer Culpable',
    target: 'individual'
  },
  {
    id: 'sec-6',
    category: 'secretos',
    question: '¿Qué secreto sabe solo una persona en este mundo sobre ti? Puedes contarlo ahora o pagar penitencia.',
    intensity: 'nuclear',
    punishment: 'Bebe 3 tragos.',
    tag: 'Bóveda',
    target: 'individual'
  }
];

export const CATEGORIES_CONFIG = [
  {
    id: 'picante' as const,
    label: 'Picante (+18)',
    emoji: '🌶️',
    color: 'from-rose-500 to-red-600',
    bgBadge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    description: 'Fantasías, fetiches, sábanas y confesiones sin censura.'
  },
  {
    id: 'confesiones' as const,
    label: 'Confesiones',
    emoji: '💣',
    color: 'from-amber-500 to-orange-600',
    bgBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Mentiras destapadas, traiciones y verdades que duelen.'
  },
  {
    id: 'fiesta' as const,
    label: 'Fiesta & Shots',
    emoji: '🍻',
    color: 'from-purple-500 to-indigo-600',
    bgBadge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    description: 'Tragos, retos absurdos, llamadas y risas descontroladas.'
  },
  {
    id: 'votacion' as const,
    label: '¿Quién es más...?',
    emoji: '👥',
    color: 'from-sky-500 to-blue-600',
    bgBadge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    description: 'Democracia brutal. Todo el grupo vota y juzga a la víctima.'
  },
  {
    id: 'amistad' as const,
    label: 'Amistad & Egos',
    emoji: '💬',
    color: 'from-emerald-500 to-teal-600',
    bgBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Primeras impresiones, envidias, favores y conexiones reales.'
  },
  {
    id: 'secretos' as const,
    label: 'Trapos Sucios',
    emoji: '🤫',
    color: 'from-fuchsia-500 to-pink-600',
    bgBadge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
    description: 'Secretos de familia, compras ridículas y placeres culposos.'
  },
  {
    id: 'personalizadas' as const,
    label: 'Mazo Propio',
    emoji: '✨',
    color: 'from-yellow-400 to-amber-500',
    bgBadge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    description: 'Preguntas creadas por ti y tus amigos en esta sesión.'
  }
];

export const DEFAULT_PLAYERS = [
  { id: 'p1', name: 'Alex', avatar: '😎', color: 'from-rose-500 to-pink-500', sincerityPoints: 0, drinksTaken: 0, skipsUsed: 0 },
  { id: 'p2', name: 'Laura', avatar: '🦊', color: 'from-purple-500 to-indigo-500', sincerityPoints: 0, drinksTaken: 0, skipsUsed: 0 },
  { id: 'p3', name: 'Dani', avatar: '🔥', color: 'from-amber-500 to-red-500', sincerityPoints: 0, drinksTaken: 0, skipsUsed: 0 },
  { id: 'p4', name: 'Sofia', avatar: '🍸', color: 'from-emerald-500 to-teal-500', sincerityPoints: 0, drinksTaken: 0, skipsUsed: 0 }
];
