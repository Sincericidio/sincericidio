'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import confetti from 'canvas-confetti';
import { ShieldAlert, Trophy, CheckCircle2, XCircle, Users, Sparkles, Scale, Eye, RefreshCw } from 'lucide-react';

// ==========================================
// 📚 BASE DE DATOS COMPLETA DE CONTENIDO (5 MODALIDADES)
// ==========================================
const GAME_DATABASE: Record<string, {
  topics: string[];
  missions: string[];
  banquillo_questions: { question: string; options: string[] }[];
  banquillo_accusations: string[];
}> = {
  amigos: {
    topics: [
      'Contad anécdotas de vuestros peores trabajos o jefes insoportables.',
      '¿Cuál ha sido la compra más inútil en la que habéis tirado dinero?',
      '¿Qué teoría de conspiración loca creéis que podría ser 100% real?',
      'Contad vuestra mayor metedura de pata en una fiesta o evento.'
    ],
    missions: [
      'Consigue que alguien se toque la cabeza o el pelo.',
      'Haz que alguien te dé la razón diciendo "Totalmente", "Tal cual" o "Literal".',
      'Haz que un amigo mencione una comida o bebida específica.',
      'Convence al grupo de un rumor falso y ridículo sobre un famoso.',
      'Consigue que alguien te choque los cinco o te dé la mano.',
      'Haz que alguien hable de viajes o de mudarse al extranjero.',
      'Consigue que todo el grupo se quede en silencio total durante al menos 3 segundos.'
    ],
    banquillo_accusations: [
      '¿Quién de esta sala tardaría menos en vender a sus amigos por 1 millón de euros?',
      '¿Quién finge mejor que le caen bien todos cuando en realidad no es así?',
      '¿Quién sobreviviría menos tiempo en un apocalipsis zombie?',
      '¿Quién es más probable que termine en la cárcel por una tontería?'
    ],
    banquillo_questions: [
      {
        question: 'Si tuvieras que eliminar una de estas 4 cosas de tu vida para siempre, ¿cuál sería?',
        options: ['Las redes sociales', 'El alcohol / salir de fiesta', 'Tu grupo de amigos actual', 'Tu teléfono móvil']
      },
      {
        question: '¿Qué defecto toleras MENOS en una persona?',
        options: ['Que sea tacaña', 'Que sea impuntual', 'Que hable a espaldas', 'Que sea prepotente']
      }
    ]
  },
  picante: {
    topics: [
      '¿Qué es lo más tóxico que habéis hecho por celos o por amor?',
      '¿Cuál ha sido vuestra peor cita o experiencia romántica vergonzosa?',
      '¿Qué secreto inconfesable sabéis que nunca podréis admitir en público?'
    ],
    missions: [
      'Haz que alguien admita si saldría con el ex de algún amigo.',
      'Consigue que alguien hable de aplicaciones de citas (Tinder, Bumble, etc.).',
      'Haz que alguien confiese cuál fue su primer crush de la infancia.',
      'Consigue que alguien se ponga visiblemente nervioso con una pregunta.'
    ],
    banquillo_accusations: [
      '¿Quién es más probable que sea infiel y nunca lo confiese?',
      '¿Quién de la sala tiene el historial amoroso más caótico?',
      '¿Quién volvería con su ex tóxico/a esta misma noche si le escribiera?'
    ],
    banquillo_questions: [
      {
        question: '¿Qué es lo primero en lo que te fijas al ligar con alguien?',
        options: ['La cara y sonrisa', 'El físico y cuerpo', 'El sentido del humor', 'La forma de vestir / estilo']
      }
    ]
  },
  familiar: {
    topics: [
      '¿Cuál es el recuerdo de vacaciones familiares más divertido o caótico?',
      '¿Qué comida tradicional odiáis que a todo el mundo le encanta?',
      'Contad anécdotas de la infancia de las que todavía os avergonzáis.'
    ],
    missions: [
      'Consigue que alguien mencione a los abuelos o a un primo.',
      'Haz que alguien cuente un chiste malo y se ría solo.',
      'Consigue que alguien recuerde una serie o película de los 90/2000.'
    ],
    banquillo_accusations: [
      '¿Quién de la familia tardaría menos en perderse en un centro comercial?',
      '¿Quién es el más dramático/a cuando le da un resfriado común?',
      '¿Quién es el más consentido o mimado de la casa?'
    ],
    banquillo_questions: [
      {
        question: '¿Cuál era tu castigo más temido de pequeño/a?',
        options: ['Sin paga semanal', 'Sin salir con amigos', 'Sin consola / móvil', 'La bronca de 2 horas']
      }
    ]
  },
  previa: {
    topics: [
      '¿Cuál ha sido la noche de fiesta más legendaria que habéis vivido?',
      '¿Cuál es la peor resaca de vuestra vida y qué la provocó?'
    ],
    missions: [
      'Consigue que todo el grupo haga un brindis antes de 2 minutos.',
      'Haz que alguien empiece a cantar una canción conocida a coro.',
      'Consigue que alguien proponga salir a otra fiesta o discoteca.'
    ],
    banquillo_accusations: [
      '¿Quién es el primero en desaparecer en una noche de fiesta sin avisar?',
      '¿Quién es más probable que termine bailando encima de un altavoz o barra?',
      '¿Quién pierde siempre el abrigo, la cartera o las llaves de noche?'
    ],
    banquillo_questions: [
      {
        question: '¿Cuál es tu bebida / copa prohibida que nunca más volverás a probar?',
        options: ['Tequila / Jäger', 'Ginebra barata', 'Vodka con refresco', 'Cerveza caliente']
      }
    ]
  },
  parejas: {
    topics: [
      '¿Cuál fue la primera impresión real que tuviste de tu pareja?',
      '¿Qué manía absurda de tu pareja te saca más de quicio?'
    ],
    missions: [
      'Consigue que tu pareja admita que llevas razón en una discusión absurda.',
      'Haz que alguien recuerde una fecha de aniversario o primer beso.',
      'Consigue que alguien cuente cómo conoció a su crush.'
    ],
    banquillo_accusations: [
      '¿Quién de los dos tarda más en pedir perdón tras una discusión?',
      '¿Quién es más celoso/a en secreto aunque diga que no?',
      '¿Quién tarda más en arreglarse antes de salir?'
    ],
    banquillo_questions: [
      {
        question: '¿Qué es lo más cursi que has hecho por amor?',
        options: ['Una carta de 10 páginas', 'Viajar de sorpresa', 'Un regalo hecho a mano', 'Dedicar una canción vergonzosa']
      }
    ]
  }
};

export default function GamePlayPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params.code as string)?.toUpperCase();

  const [player, setPlayer] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados comunes de juego
  const [phase, setPhase] = useState<'brief' | 'playing' | 'self_report' | 'deduction' | 'results'>('brief');
  const [timeLeft, setTimeLeft] = useState(180);

  // Estados Misión Secreta
  const [topic, setTopic] = useState('');
  const [myMission, setMyMission] = useState('');
  const [selfReportSuccess, setSelfReportSuccess] = useState<boolean | null>(null);
  const [deductions, setDeductions] = useState<Record<string, string>>({});

  // Estados El Banquillo
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedAccused, setSelectedAccused] = useState<string | null>(null);

  useEffect(() => {
    const savedPlayer = sessionStorage.getItem('sincericidio_player');
    const savedRoom = sessionStorage.getItem('sincericidio_room');

    if (!savedPlayer || !savedRoom) {
      router.push('/');
      return;
    }

    const p = JSON.parse(savedPlayer);
    const r = JSON.parse(savedRoom);
    setPlayer(p);
    setRoom(r);

    const categoryKey = r.category in GAME_DATABASE ? r.category : 'amigos';
    const db = GAME_DATABASE[categoryKey];

    // Cargar contenido aleatorio según juego y modalidad
    if (r.game_type === 'mision_secreta') {
      setTopic(db.topics[Math.floor(Math.random() * db.topics.length)]);
      setMyMission(db.missions[Math.floor(Math.random() * db.missions.length)]);
    } else {
      // El Banquillo
      const isAccusationRound = Math.random() > 0.5;
      if (isAccusationRound && db.banquillo_accusations.length > 0) {
        setCurrentQuestion({
          type: 'accusation',
          text: db.banquillo_accusations[Math.floor(Math.random() * db.banquillo_accusations.length)]
        });
      } else if (db.banquillo_questions.length > 0) {
        setCurrentQuestion({
          type: 'multiple_choice',
          ...db.banquillo_questions[Math.floor(Math.random() * db.banquillo_questions.length)]
        });
      }
    }

    const fetchPlayers = async () => {
      const { data } = await supabase.from('players').select('*').eq('room_id', r.id);
      if (data) setPlayers(data);
      setLoading(false);
    };
    fetchPlayers();
  }, [roomCode, router]);

  // Reloj de cuenta atrás para Misión Secreta
  useEffect(() => {
    if (phase !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('self_report');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelfReport = (success: boolean) => {
    setSelfReportSuccess(success);
    setPhase('deduction');
  };

  const handleSubmitDeductions = () => {
    confetti({ particleCount: 60, spread: 70 });
    setPhase('results');
  };

  const handleBanquilloVote = (answer: string) => {
    setSelectedAnswer(answer);
    confetti({ particleCount: 40, spread: 60 });
    setPhase('results');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  const isMisionSecreta = room?.game_type === 'mision_secreta';

  return (
    <main className="min-h-screen bg-[#0B0E14] text-white flex flex-col items-center p-4 sm:p-6 selection:bg-[#FF1744]">
      <div className="w-full max-w-md flex flex-col items-center gap-6 my-auto">

        {/* ========================================================= */}
        {/* MODO 1: MISIÓN SECRETA */}
        {/* ========================================================= */}
        {isMisionSecreta && (
          <>
            {phase === 'brief' && (
              <div className="w-full bg-[#121620] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00] bg-[#CCFF00]/10 px-2.5 py-1 rounded-full">
                    Misión Confidencial
                  </span>
                  <span className="text-xs font-bold text-[#94A3B8]">Sala {roomCode}</span>
                </div>

                <div className="bg-[#0B0E14] p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] block mb-1">
                    📢 Tema para hablar todos:
                  </span>
                  <p className="text-sm font-bold text-white leading-snug">"{topic}"</p>
                </div>

                <div className="bg-[#FF1744]/10 border-2 border-[#FF1744] p-5 rounded-2xl text-center flex flex-col items-center gap-2 relative shadow-lg shadow-[#FF1744]/10">
                  <span className="text-2xl">🤫</span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#FF1744]">
                    Tu Misión Oculta:
                  </span>
                  <p className="text-base font-black text-white leading-snug">{myMission}</p>
                </div>

                <button
                  onClick={() => setPhase('playing')}
                  className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-base py-4 rounded-2xl shadow-xl shadow-[#CCFF00]/20 active:scale-95 transition-all mt-2"
                >
                  ¡ENTENDIDO, BLOQUEAR Y JUGAR! ⏱️
                </button>
              </div>
            )}

            {phase === 'playing' && (
              <div className="w-full bg-[#121620] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-6 animate-in fade-in duration-300">
                <div className="w-24 h-24 rounded-full border-4 border-[#FF1744] flex items-center justify-center bg-[#FF1744]/10 shadow-lg shadow-[#FF1744]/20 animate-pulse">
                  <span className="font-brand font-black text-3xl text-white">{formatTime(timeLeft)}</span>
                </div>
                <div className="bg-[#0B0E14] p-4 rounded-2xl border border-white/5 w-full">
                  <p className="text-xs text-[#94A3B8] font-medium leading-relaxed">
                    📵 <strong>Deja el móvil en la mesa boca abajo.</strong><br />
                    Cumple tu misión en la charla sin que sospechen.
                  </p>
                </div>
                <button
                  onClick={() => setPhase('self_report')}
                  className="text-[11px] text-[#94A3B8] hover:text-white underline underline-offset-4"
                >
                  (Terminar ronda antes)
                </button>
              </div>
            )}

            {phase === 'self_report' && (
              <div className="w-full bg-[#121620] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-5">
                <span className="text-3xl">🛎️</span>
                <h2 className="text-xl font-black text-white">¿Conseguiste cumplir tu misión?</h2>
                <p className="text-xs text-[#94A3B8]">"{myMission}"</p>
                <div className="grid grid-cols-2 gap-3 w-full mt-2">
                  <button
                    onClick={() => handleSelfReport(true)}
                    className="bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black py-4 rounded-2xl shadow-lg shadow-[#CCFF00]/20 active:scale-95 transition-all flex flex-col items-center gap-1"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    <span>SÍ, LO LOGRÉ</span>
                  </button>
                  <button
                    onClick={() => handleSelfReport(false)}
                    className="bg-white/10 hover:bg-white/20 text-white font-black py-4 rounded-2xl active:scale-95 transition-all flex flex-col items-center gap-1"
                  >
                    <XCircle className="w-6 h-6 text-[#FF1744]" />
                    <span>NO HUBO FORMA</span>
                  </button>
                </div>
              </div>
            )}

            {phase === 'deduction' && (
              <div className="w-full bg-[#121620] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
                <div className="text-center">
                  <h2 className="text-xl font-black text-white">🕵️‍♂️ Hora de Sospechar</h2>
                  <p className="text-xs text-[#94A3B8] mt-1">¿Qué intentaba hacer cada uno?</p>
                </div>
                <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto">
                  {players.filter((p) => p.id !== player?.id).map((p) => (
                    <div key={p.id} className="bg-[#0B0E14] p-3.5 rounded-2xl border border-white/5">
                      <label className="block text-xs font-black text-[#CCFF00] mb-1">{p.nickname}</label>
                      <input
                        type="text"
                        placeholder="Escribe su sospecha..."
                        value={deductions[p.id] || ''}
                        onChange={(e) => setDeductions({ ...deductions, [p.id]: e.target.value })}
                        className="w-full bg-transparent text-xs text-white placeholder-[#94A3B8]/30 outline-none"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSubmitDeductions}
                  className="w-full bg-[#7928CA] hover:bg-[#681fb0] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#7928CA]/30 active:scale-95 transition-all"
                >
                  ENVIAR DEDUCCIONES 🚀
                </button>
              </div>
            )}

            {phase === 'results' && (
              <div className="w-full bg-[#121620] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-5">
                <Trophy className="w-12 h-12 text-[#CCFF00] animate-bounce" />
                <h2 className="text-2xl font-brand font-black text-white">¡VEREDICTO FINAL!</h2>
                <div className="w-full bg-[#0B0E14] p-4 rounded-2xl border border-white/5 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-white">Tu Misión:</span>
                    <span className="text-xs font-black text-[#CCFF00]">
                      {selfReportSuccess ? '+100 pts (Éxito)' : '+0 pts'}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8]">"{myMission}"</p>
                </div>
                <button
                  onClick={() => router.push(`/room/${roomCode}`)}
                  className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black py-4 rounded-2xl active:scale-95 transition-all"
                >
                  JUGAR OTRA RONDA 🔥
                </button>
              </div>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* MODO 2: EL BANQUILLO */}
        {/* ========================================================= */}
        {!isMisionSecreta && (
          <div className="w-full bg-[#121620] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF1744] bg-[#FF1744]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Scale className="w-3 h-3" /> El Banquillo
              </span>
              <span className="text-xs font-bold text-[#94A3B8]">Sala {roomCode}</span>
            </div>

            <div className="text-center my-2">
              <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                {currentQuestion?.text || currentQuestion?.question}
              </h2>
            </div>

            {/* SI ES DE ACUSACIÓN: ELEGIR A UN AMIGO */}
            {currentQuestion?.type === 'accusation' && phase !== 'results' && (
              <div className="grid grid-cols-2 gap-2.5">
                {players.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleBanquilloVote(p.nickname)}
                    className="p-3.5 rounded-2xl bg-[#0B0E14] border border-white/10 hover:border-[#FF1744] font-bold text-sm text-white flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <span>👉</span> {p.nickname}
                  </button>
                ))}
              </div>
            )}

            {/* SI ES OPCIÓN MÚLTIPLE: 4 BOTONES */}
            {currentQuestion?.type === 'multiple_choice' && phase !== 'results' && (
              <div className="flex flex-col gap-2.5">
                {currentQuestion.options.map((opt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleBanquilloVote(opt)}
                    className="p-3.5 rounded-2xl bg-[#0B0E14] border border-white/10 hover:border-[#CCFF00] font-bold text-xs sm:text-sm text-white text-left active:scale-95 transition-all"
                  >
                    <span className="text-[#CCFF00] font-black mr-2">[{String.fromCharCode(65 + idx)}]</span>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* RESULTADO DE EL BANQUILLO */}
            {phase === 'results' && (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-12 h-12 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00] flex items-center justify-center text-xl">
                  ⚖️
                </div>
                <div>
                  <h3 className="font-brand font-black text-xl text-white">¡VOTO REGISTRADO!</h3>
                  <p className="text-xs text-[#94A3B8] mt-1">Has votado: <strong className="text-[#CCFF00]">"{selectedAnswer}"</strong></p>
                </div>
                <button
                  onClick={() => router.push(`/room/${roomCode}`)}
                  className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black py-4 rounded-2xl active:scale-95 transition-all mt-2"
                >
                  SIGUIENTE RONDA 🔥
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}