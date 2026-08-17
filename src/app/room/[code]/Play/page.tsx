'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import confetti from 'canvas-confetti';
import { ShieldAlert, Clock, Eye, CheckCircle2, XCircle, Trophy, ArrowRight, Flame, Volume2 } from 'lucide-react';

// BANCO DE MISIONES Y TEMAS CEBO SEGÚN LA CATEGORÍA
const MISSIONS_DB: Record<string, { topics: string[]; missions: string[] }> = {
  amigos: {
    topics: [
      'Contad anécdotas de vuestros peores trabajos o jefes insoportables.',
      '¿Cuál ha sido la compra más absurda o inútil en la que habéis tirado dinero?',
      '¿Qué teoría de conspiración loca creéis que podría ser 100% real?',
      'Contad la peor metedura de pata que habéis tenido en una fiesta.'
    ],
    missions: [
      'Consigue que alguien se toque el pelo o la cabeza.',
      'Haz que alguien te dé la razón diciendo "Totalmente", "Tal cual" o "Literal".',
      'Haz que un amigo mencione una comida o bebida específica.',
      'Convence al grupo de un rumor falso y ridículo sobre un famoso.',
      'Consigue que alguien te choque los cinco o te dé la mano.',
      'Haz que alguien hable de un viaje o de irse al extranjero.',
      'Consigue que todo el grupo se quede en silencio total durante al menos 3 segundos.'
    ]
  },
  picante: {
    topics: [
      '¿Qué es lo más tóxico que habéis hecho por celos o por amor?',
      '¿Cuál ha sido vuestra peor cita o experiencia romántica vergonzosa?',
      '¿Qué secreto inconfesable sabéis de alguien que jamás podréis contar?'
    ],
    missions: [
      'Haz que alguien admita si saldría con el ex de algún amigo.',
      'Consigue que alguien se sonroje o se ponga nervioso con una mirada/pregunta.',
      'Haz que alguien confiese su mayor "crush" inalcanzable.',
      'Consigue que alguien hable de aplicaciones de citas (Tinder, Bumble).'
    ]
  },
  familiar: {
    topics: [
      '¿Cuál es el recuerdo de vacaciones familiares más caótico que tenéis?',
      '¿Qué comida típica odiáis que a todo el mundo le encanta?'
    ],
    missions: [
      'Consigue que alguien mencione a los abuelos o a un tío.',
      'Haz que alguien cuente un chiste malo.',
      'Consigue que alguien imite a otro miembro de la familia.'
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
  
  // Fases del juego: 'mission_brief' | 'playing' | 'self_report' | 'deduction' | 'results'
  const [phase, setPhase] = useState<'mission_brief' | 'playing' | 'self_report' | 'deduction' | 'results'>('mission_brief');
  
  const [topic, setTopic] = useState('');
  const [myMission, setMyMission] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos (180s)
  
  const [selfReportSuccess, setSelfReportSuccess] = useState<boolean | null>(null);
  const [deductions, setDeductions] = useState<Record<string, string>>({});
  const [submittedDeductions, setSubmittedDeductions] = useState(false);

  // Inicializar juego y asignar misiones
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

    const category = r.category in MISSIONS_DB ? r.category : 'amigos';
    const db = MISSIONS_DB[category];

    // Asignar tema cebo aleatorio
    const randomTopic = db.topics[Math.floor(Math.random() * db.topics.length)];
    setTopic(randomTopic);

    // Asignar misión aleatoria
    const randomMission = db.missions[Math.floor(Math.random() * db.missions.length)];
    setMyMission(randomMission);

    // Cargar jugadores de la sala
    const fetchPlayers = async () => {
      const { data } = await supabase.from('players').select('*').eq('room_id', r.id);
      if (data) setPlayers(data);
    };
    fetchPlayers();
  }, [roomCode, router]);

  // Temporizador de 3 minutos cuando empieza la charla
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

  // Formato mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Guardar auto-declaración
  const handleSelfReport = (success: boolean) => {
    setSelfReportSuccess(success);
    setPhase('deduction');
  };

  // Enviar sospechas
  const handleSubmitDeductions = () => {
    setSubmittedDeductions(true);
    confetti({ particleCount: 50, spread: 70 });
    setPhase('results');
  };

  return (
    <main className="min-h-screen bg-[#0B0E14] text-white flex flex-col items-center p-4 sm:p-6 selection:bg-[#FF1744]">
      <div className="w-full max-w-md flex flex-col items-center gap-6 my-auto">

        {/* FASE 1: LECTURA DE MISIÓN SECRETA */}
        {phase === 'mission_brief' && (
          <div className="w-full bg-[#121620] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00] bg-[#CCFF00]/10 px-2.5 py-1 rounded-full">
                Misión Confidencial
              </span>
              <span className="text-xs font-bold text-[#94A3B8]">Sala {roomCode}</span>
            </div>

            {/* TEMA CEBO PÚBLICO */}
            <div className="bg-[#0B0E14] p-4 rounded-2xl border border-white/5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] block mb-1">
                📢 Tema Rompehielos (Para hablar todos):
              </span>
              <p className="text-sm font-bold text-white leading-snug">
                "{topic}"
              </p>
            </div>

            {/* TU MISIÓN SECRETA */}
            <div className="bg-[#FF1744]/10 border-2 border-[#FF1744] p-5 rounded-2xl text-center flex flex-col items-center gap-2 relative shadow-lg shadow-[#FF1744]/10">
              <span className="text-2xl">🤫</span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF1744]">
                Tu Misión Oculta en esta ronda:
              </span>
              <p className="text-base font-black text-white leading-snug">
                {myMission}
              </p>
              <span className="text-[10px] text-[#94A3B8] mt-1">
                (Memorízala. No dejes que nadie vea tu pantalla).
              </span>
            </div>

            <button
              onClick={() => setPhase('playing')}
              className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-base py-4 rounded-2xl shadow-xl shadow-[#CCFF00]/20 flex items-center justify-center gap-2 active:scale-95 transition-all mt-2"
            >
              ¡ENTENDIDO, BLOQUEAR Y JUGAR! ⏱️
            </button>
          </div>
        )}

        {/* FASE 2: MODO CHARLA EN CURSO (MÓVILES BOCA ABAJO) */}
        {phase === 'playing' && (
          <div className="w-full bg-[#121620] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-6 animate-in fade-in duration-300">
            
            {/* RELOJ EN TIEMPO REAL */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-4 border-[#FF1744] flex items-center justify-center bg-[#FF1744]/10 shadow-lg shadow-[#FF1744]/20 animate-pulse">
                <span className="font-brand font-black text-3xl text-white">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest mt-3">
                Tiempo de Conversación
              </span>
            </div>

            <div className="bg-[#0B0E14] p-4 rounded-2xl border border-white/5 w-full">
              <p className="text-xs text-[#94A3B8] font-medium leading-relaxed">
                📵 <strong>Deja el móvil en la mesa boca abajo.</strong><br />
                Hablad con normalidad del tema y cumple tu misión sin que sospechen.
              </p>
            </div>

            {/* BOTÓN DE EMERGENCIA PARA TERMINAR ANTES SI TODOS ACABAN */}
            <button
              onClick={() => setPhase('self_report')}
              className="text-[11px] text-[#94A3B8] hover:text-white underline underline-offset-4"
            >
              (Terminar ronda ahora)
            </button>
          </div>
        )}

        {/* FASE 3: AUTO-DECLARACIÓN PRIVADA */}
        {phase === 'self_report' && (
          <div className="w-full bg-[#121620] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-5 animate-in zoom-in-95 duration-300">
            <span className="text-3xl">🛎️</span>
            <div>
              <h2 className="text-xl font-black text-white">¡Fin del Tiempo!</h2>
              <p className="text-xs text-[#94A3B8] mt-1">
                Tu misión era: <strong className="text-white">"{myMission}"</strong>
              </p>
            </div>

            <p className="text-sm font-bold text-white mt-2">
              ¿Conseguiste cumplir tu misión antes de que sonara la alarma?
            </p>

            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <button
                onClick={() => handleSelfReport(true)}
                className="bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black py-4 rounded-2xl flex flex-col items-center gap-1 shadow-lg shadow-[#CCFF00]/20 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>SÍ, LO LOGRÉ</span>
              </button>

              <button
                onClick={() => handleSelfReport(false)}
                className="bg-white/10 hover:bg-white/20 text-white font-black py-4 rounded-2xl flex flex-col items-center gap-1 active:scale-95 transition-all"
              >
                <XCircle className="w-6 h-6 text-[#FF1744]" />
                <span>NO HUBO FORMA</span>
              </button>
            </div>
          </div>
        )}

        {/* FASE 4: PANTALLA DE DEDUCCIÓN / SOSPECHAS */}
        {phase === 'deduction' && (
          <div className="w-full bg-[#121620] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in duration-300">
            <div className="text-center">
              <h2 className="text-xl font-black text-white">🕵️‍♂️ Hora de Sospechar</h2>
              <p className="text-xs text-[#94A3B8] mt-1">
                Escribe qué crees que intentaba hacer cada uno (+50 pts si aciertas):
              </p>
            </div>

            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {players
                .filter((p) => p.id !== player?.id)
                .map((p) => (
                  <div key={p.id} className="bg-[#0B0E14] p-3.5 rounded-2xl border border-white/5">
                    <label className="block text-xs font-black text-[#CCFF00] mb-1">
                      {p.nickname}
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Intentó que habláramos de coches..."
                      value={deductions[p.id] || ''}
                      onChange={(e) =>
                        setDeductions({ ...deductions, [p.id]: e.target.value })
                      }
                      className="w-full bg-transparent text-xs text-white placeholder-[#94A3B8]/30 outline-none"
                    />
                  </div>
                ))}
            </div>

            <button
              onClick={handleSubmitDeductions}
              className="w-full bg-[#7928CA] hover:bg-[#681fb0] text-white font-black text-base py-4 rounded-2xl shadow-xl shadow-[#7928CA]/30 flex items-center justify-center gap-2 active:scale-95 transition-all mt-2"
            >
              ENVIAR DEDUCCIONES 🚀
            </button>
          </div>
        )}

        {/* FASE 5: RESULTADOS Y PODIO */}
        {phase === 'results' && (
          <div className="w-full bg-[#121620] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-5 animate-in zoom-in-95 duration-300">
            <Trophy className="w-12 h-12 text-[#CCFF00] animate-bounce" />
            
            <div>
              <h2 className="text-2xl font-brand font-black text-white">¡VEREDICTO FINAL!</h2>
              <p className="text-xs text-[#94A3B8] mt-1">
                Revelación de misiones y reparto de puntos
              </p>
            </div>

            <div className="w-full bg-[#0B0E14] p-4 rounded-2xl border border-white/5 flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-sm text-white">Tu Misión:</span>
                <span className="text-xs font-black text-[#CCFF00]">
                  {selfReportSuccess ? '+100 pts (Éxito)' : '+0 pts'}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                "{myMission}"
              </p>
            </div>

            <button
              onClick={() => router.push(`/room/${roomCode}`)}
              className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-base py-4 rounded-2xl shadow-xl shadow-[#CCFF00]/20 active:scale-95 transition-all mt-2"
            >
              JUGAR OTRA RONDA 🔥
            </button>
          </div>
        )}

      </div>
    </main>
  );
}