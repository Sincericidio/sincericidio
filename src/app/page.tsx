'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Users, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [selectedGame, setSelectedGame] = useState<'mision_secreta' | 'el_banquillo'>('mision_secreta');
  const [selectedCategory, setSelectedCategory] = useState<'amigos' | 'familiar' | 'picante' | 'previa' | 'parejas'>('amigos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si alguien entra escaneando el QR con ?code=XXXX, pasar directo a la pestaña Unirse
  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      setRoomCode(codeParam.toUpperCase());
      setActiveTab('join');
    }
  }, [searchParams]);

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateRoom = async () => {
    if (!nickname.trim()) {
      setError('Por favor, escribe tu apodo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const code = generateCode();
      const hostId = crypto.randomUUID();

      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert({
          code: code,
          host_id: hostId,
          game_type: selectedGame,
          category: selectedCategory,
          status: 'lobby',
          current_round: 1
        })
        .select()
        .single();

      if (roomError) throw roomError;

      const { data: player, error: playerError } = await supabase
        .from('players')
        .insert({
          id: hostId,
          room_id: room.id,
          nickname: nickname.trim(),
          is_host: true,
          score: 0
        })
        .select()
        .single();

      if (playerError) throw playerError;

      sessionStorage.setItem('sincericidio_player', JSON.stringify(player));
      sessionStorage.setItem('sincericidio_room', JSON.stringify(room));

      router.push(`/room/${code}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al crear la sala');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!nickname.trim()) {
      setError('Escribe tu apodo');
      return;
    }
    if (!roomCode.trim()) {
      setError('Escribe el código de 4 letras');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanCode = roomCode.trim().toUpperCase();

      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', cleanCode)
        .single();

      if (roomError || !room) {
        throw new Error('No se encontró ninguna sala con ese código');
      }

      if (room.status !== 'lobby') {
        throw new Error('La partida ya ha comenzado');
      }

      const playerId = crypto.randomUUID();
      const { data: player, error: playerError } = await supabase
        .from('players')
        .insert({
          id: playerId,
          room_id: room.id,
          nickname: nickname.trim(),
          is_host: false,
          score: 0
        })
        .select()
        .single();

      if (playerError) throw playerError;

      sessionStorage.setItem('sincericidio_player', JSON.stringify(player));
      sessionStorage.setItem('sincericidio_room', JSON.stringify(room));

      router.push(`/room/${cleanCode}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al unirte a la sala');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0E14] text-white flex flex-col items-center justify-center p-4 selection:bg-[#FF1744] touch-manipulation">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        
        {/* LOGO OFICIAL */}
        <div className="flex flex-col items-center mt-2">
          <div className="font-brand font-black text-4xl sm:text-5xl text-white tracking-tighter flex items-center leading-none">
            <span>SINCERICID</span>
            <span className="relative inline-block ml-[2px]">
              IO
              <svg className="absolute -top-[18px] left-0 w-[60px] h-[35px] pointer-events-none" viewBox="0 0 100 60" fill="none">
                <path d="M8 32 C8 8, 47 8, 47 32" stroke="#FFFFFF" strokeWidth="11" strokeLinecap="round"/>
                <g transform="translate(56, 4) scale(0.85)">
                  <path d="M16 0 L22 14 L36 7 L27 21 L40 28 L25 30 L32 44 L18 35 L14 48 L9 32 L0 39 L7 25 L0 16 L14 18 Z" fill="#FF1744"/>
                  <circle cx="17" cy="22" r="4.5" fill="#CCFF00"/>
                </g>
              </svg>
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#94A3B8] uppercase mt-2">
            No te fíes ni de tu mejor amigo
          </p>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="w-full bg-[#121620] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          
          {/* PESTAÑAS */}
          <div className="grid grid-cols-2 bg-[#0B0E14] p-1.5 rounded-2xl border border-white/5 mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab('create'); setError(''); }}
              className={`py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none ${
                activeTab === 'create'
                  ? 'bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/20'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Crear Sala
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('join'); setError(''); }}
              className={`py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none ${
                activeTab === 'join'
                  ? 'bg-[#7928CA] text-white shadow-lg shadow-[#7928CA]/30'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Unirse
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-[#FF1744]/10 border border-[#FF1744]/30 text-[#FF1744] text-xs font-semibold p-3 rounded-xl mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* APODO */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
              Tu Apodo en la fiesta
            </label>
            <input
              type="text"
              maxLength={15}
              placeholder="Ej: Mikel, La Tóxica, Jon..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-[#0B0E14] border border-white/15 focus:border-[#CCFF00] rounded-2xl px-4 py-3.5 text-white font-bold placeholder-[#94A3B8]/40 outline-none transition-all"
            />
          </div>

          {/* VISTA 1: CREAR SALA */}
          {activeTab === 'create' && (
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                  Elige el Juego
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGame('mision_secreta')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between cursor-pointer transition-all ${
                      selectedGame === 'mision_secreta'
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-white'
                        : 'border-white/10 bg-[#0B0E14] text-[#94A3B8]'
                    }`}
                  >
                    <span className="text-lg">🕵️‍♂️</span>
                    <span className="font-extrabold text-sm mt-2 block">Misión Secreta</span>
                    <span className="text-[10px] text-[#94A3B8] leading-tight">Infiltración y sigilo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGame('el_banquillo')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between cursor-pointer transition-all ${
                      selectedGame === 'el_banquillo'
                        ? 'border-[#FF1744] bg-[#FF1744]/10 text-white'
                        : 'border-white/10 bg-[#0B0E14] text-[#94A3B8]'
                    }`}
                  >
                    <span className="text-lg">⚖️</span>
                    <span className="font-extrabold text-sm mt-2 block">El Banquillo</span>
                    <span className="text-[10px] text-[#94A3B8] leading-tight">Acusaciones y salseo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                  Modalidad de Contenido
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'amigos', label: 'Amigos', icon: '🍻', free: true },
                    { id: 'familiar', label: 'Familiar', icon: '🍕', free: true },
                    { id: 'picante', label: '+18 Hot', icon: '🔥', free: false },
                    { id: 'previa', label: 'Previa', icon: '🍾', free: false },
                    { id: 'parejas', label: 'Parejas', icon: '💔', free: false },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 relative cursor-pointer transition-all ${
                        selectedCategory === cat.id
                          ? 'border-white bg-white/10 text-white'
                          : 'border-white/5 bg-[#0B0E14] text-[#94A3B8]'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.label}</span>
                      {!cat.free && (
                        <span className="absolute -top-1 -right-1 bg-[#FF1744] text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase">
                          VIP
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreateRoom}
                disabled={loading}
                className="w-full bg-[#CCFF00] hover:bg-[#b8e600] active:scale-95 text-black font-black text-base py-4 rounded-2xl shadow-xl shadow-[#CCFF00]/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 mt-2"
              >
                {loading ? 'Creando Sala...' : '¡CREAR SALA Y JUGAR!'}
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* VISTA 2: UNIRSE A SALA */}
          {activeTab === 'join' && (
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                  Código de Sala (4 letras)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Ej: ROMA"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#0B0E14] border border-white/15 focus:border-[#7928CA] rounded-2xl px-4 py-4 text-center text-3xl font-black tracking-widest text-white uppercase placeholder-[#94A3B8]/20 outline-none transition-all"
                />
              </div>

              <button
                type="button"
                onClick={handleJoinRoom}
                disabled={loading}
                className="w-full bg-[#7928CA] hover:bg-[#681fb0] active:scale-95 text-white font-black text-base py-4 rounded-2xl shadow-xl shadow-[#7928CA]/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 mt-2"
              >
                {loading ? 'Entrando...' : '¡ENTRAR A LA FIESTA!'}
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0E14]" />}>
      <HomeContent />
    </Suspense>
  );
}