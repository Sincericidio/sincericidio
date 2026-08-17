import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, Copy, Check, Send, Sparkles, Shield, UserX } from 'lucide-react';
import { sounds } from '../utils/audio';

interface RoomQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  onAddAnonymousQuestion: (question: string) => void;
}

export const RoomQRModal: React.FC<RoomQRModalProps> = ({
  isOpen,
  onClose,
  roomCode,
  onAddAnonymousQuestion,
}) => {
  const [copied, setCopied] = useState(false);
  const [anonQuestion, setAnonQuestion] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://sincericidio.app';
  const joinUrl = `${currentUrl.split('?')[0]}?room=${roomCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    sounds.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendAnonymous = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anonQuestion.trim()) return;

    onAddAnonymousQuestion(anonQuestion.trim());
    setAnonQuestion('');
    setSentSuccess(true);
    sounds.playSuccess();
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-rose-500" />
              <span>Sala Multijugador & QR</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Escanea para unirte a la partida o enviar preguntas secretas.
            </p>
          </div>
          <button
            id="close-qr-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Presentation Box */}
        <div className="my-4 p-6 rounded-2xl bg-white flex flex-col items-center justify-center shadow-lg">
          <QRCodeSVG
            value={joinUrl}
            size={180}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#09090b"
          />
          <div className="mt-3 text-center">
            <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider block">
              Código de Sala
            </span>
            <span className="text-2xl font-black text-neutral-900 tracking-widest font-mono">
              {roomCode}
            </span>
          </div>
        </div>

        {/* Share & Copy Button */}
        <button
          id="copy-room-link-btn"
          onClick={handleCopyLink}
          className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 transition-all mb-4"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-neutral-400" />}
          <span>{copied ? '¡Enlace copiado al portapapeles!' : 'Copiar enlace para compartir'}</span>
        </button>

        {/* Secret Anonymous Box */}
        <div className="p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <UserX className="w-4 h-4" />
            <span>Buzón Anónimo de Preguntas & Secretos</span>
          </div>
          <p className="text-[11px] text-neutral-400 mb-3">
            Escribe una pregunta picante o secreta. Se inyectará anónimamente en el mazo de cartas sin revelar tu identidad.
          </p>

          <form onSubmit={handleSendAnonymous} className="space-y-2">
            <input
              type="text"
              placeholder="¿Alguna vez has...? (100% Anónimo)"
              value={anonQuestion}
              onChange={(e) => setAnonQuestion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
              maxLength={140}
            />
            <div className="flex items-center justify-between">
              {sentSuccess && (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> ¡Pregunta añadida al mazo!
                </span>
              )}
              <div className="flex-1" />
              <button
                type="submit"
                disabled={!anonQuestion.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar al mazo</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
