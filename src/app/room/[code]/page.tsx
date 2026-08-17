'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { Users, Play, Copy, Check, Crown, ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';

interface Player {
  id: string;
  nickname: string;
  is_host: boolean;
  score: number;
}

interface Room {
  id: string;
  code: string;
  game_type: string;
  category: string;
  status: string;
  current_round: number;
}

export default function RoomLobbyPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params.code as string)?.toUpperCase();

  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Definir la URL para compartir / QR
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/?code=${roomCode}`);
    }

    // Cargar datos del jugador actual desde la sesión
    const savedPlayer = sessionStorage.getItem('sincericidio_player');
    if (savedPlayer) {
      setCurrentPlayer(JSON.parse(savedPlayer));
    }

    // 1. Obtener la sala y los jugadores iniciales
    const fetchRoomData = async () => {
      try {
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .eq('code', roomCode)
          .single();

        if (roomError || !roomData) {
          alert('Sala no encontrada');
          router.push('/');
          return;
        }

        setRoom(roomData);

        const { data: playersData } = await supabase
          .from('players')
          .select('*')
          .eq('room_id', roomData.id)
          .order('created_at', { ascending: true });

        if (playersData) {
          setPlayers(playersData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();

    // 2. SUSCRIPCIÓN EN TIEMPO REAL A SUPABASE (WebSockets)
    const channel = supabase
      .channel(`room_${roomCode}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'players' },
        (payload) => {
          const newPlayer = payload.new as Player;
          setPlayers((prev) => {
            if (prev.some((p) => p.id === newPlayer.id)) return prev;
            // Pequeño confeti cuando entra alguien nuevo
            confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
            return [...prev, newPlayer];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms' },
        (payload) => {
          const updatedRoom = payload.new as Room;
          setRoom(updatedRoom);
          if (updatedRoom.status === 'playing') {
            router.push(`/room/${roomCode}/play`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomCode, router]);

  // Copiar código al portapapeles
  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Iniciar la partida (Solo el Host)
  const handleStartGame = async () => {
    if (!room || !currentPlayer?.is_host) return;

    if (players.length < 2) {
      alert('Se necesitan al menos 2 jugadores para empezar la partida');
      return;
    }

    try {
      await supabase
        .from('rooms')
        .update({ status: 'playing' })
        .eq('id', room.id);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-sm text-[#94A3B8]">Conectando con la sala...</p>
        </div>
      </main>
    );
  }

  const isHost = currentPlayer?.is_host;

  return (
    <main className="min-h-screen bg-[#0B0E14] text-white flex flex-col items-center p-4 sm:p-6 selection:bg-[#FF1744]">
      <div className="w-full max-w-xl flex flex-col items-center gap-6 my-auto">
        
        {/* CABECERA CON CÓDIGO DE SALA */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8]">
              Código de Sala
            </span>
            <div className="flex items-center gap-2">
              <span className="font-brand font-black text-3xl sm:text-4xl tracking-widest text-white">
                {roomCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#CCFF00] transition-all"
                title="Copiar código"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="w-10"></div> {/* Espaciador */}
        </div>

        {/* TARJETA PRINCIPAL: QR Y JUGADORES */}
        <div className="w-full bg-[#121620] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row gap-6 items-center">
          
          {/* CÓDIGO QR */}
          <div className="flex flex-col items-center gap-3 bg-[#0B0E14] p-4 rounded-2xl border border-white/5">
            <div className="p-2 bg-white rounded-xl shadow-lg">
              {shareUrl && (
                <QRCodeSVG
                  value={shareUrl}
                  size={140}
                  level="M"
                  includeMargin={false}
                />
              )}
            </div>
            <p className="text-[10px] font-bold text-[#94A3B8] text-center uppercase tracking-wider">
              Escanea para unirte
            </p>
          </div>

          {/* INFORMACIÓN DEL JUEGO Y MODO */}
          <div className="flex-1 flex flex-col justify-between w-full h-full gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                {room?.game_type === 'mision_secreta' ? 'Misión Secreta' : 'El Banquillo'}
              </div>
              <h2 className="text-xl font-black text-white capitalize">
                Modo {room?.category}
              </h2>
              <p className="text-xs text-[#94A3B8] mt-1">
                {room?.game_type === 'mision_secreta'
                  ? 'Cumple tu misión sin ser descubierto y desenmascara a los demás.'
                  : 'Vota a los culpables y descubre qué piensan tus amigos de ti.'}
              </p>
            </div>

            {/* CONTADOR DE JUGADORES */}
            <div className="flex items-center gap-2 text-xs font-bold text-[#94A3B8]">
              <Users className="w-4 h-4 text-[#CCFF00]" />
              <span>{players.length} jugadores en la sala</span>
            </div>
          </div>

        </div>

        {/* LISTA DE JUGADORES CONECTADOS EN TIEMPO REAL */}
        <div className="w-full">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3">
            Sospechosos en la sala ({players.length})
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-[#121620] border border-white/10 rounded-2xl p-3 flex items-center gap-3 animate-in fade-in zoom-in duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-[#7928CA] flex items-center justify-center font-black text-sm text-white shadow-md">
                  {player.nickname.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-white truncate">
                    {player.nickname}
                  </span>
                  {player.is_host && (
                    <span className="text-[9px] font-extrabold text-[#CCFF00] flex items-center gap-1 uppercase tracking-wider">
                      <Crown className="w-2.5 h-2.5" /> Anfitrión
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN / EMPEZAR */}
        <div className="w-full mt-2">
          {isHost ? (
            <button
              onClick={handleStartGame}
              disabled={players.length < 2}
              className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-base py-4 rounded-2xl shadow-xl shadow-[#CCFF00]/20 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5 fill-current" />
              {players.length < 2
                ? 'ESPERANDO A MÁS JUGADORES (MÍN. 2)...'
                : '¡COMENZAR LA PARTIDA!'}
            </button>
          ) : (
            <div className="w-full bg-white/5 border border-white/10 text-center py-4 rounded-2xl text-xs font-bold text-[#94A3B8] flex items-center justify-center gap-2 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping"></div>
              Esperando a que el anfitrión comience la partida...
            </div>
          )}
        </div>

      </div>
    </main>
  );
}