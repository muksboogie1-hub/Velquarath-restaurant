import React from 'react';
import { Flame, RefreshCw, AlertCircle, UtensilsCrossed } from 'lucide-react';

interface BrandedLoadingScreenProps {
  loadError?: string | null;
  onRetry?: () => void;
  onContinueOffline?: () => void;
  isRetrying?: boolean;
}

export const BrandedLoadingScreen: React.FC<BrandedLoadingScreenProps> = ({
  loadError,
  onRetry,
  onContinueOffline,
  isRetrying = false,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen w-full bg-[#141210] text-[#F4ECDA] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none"
    >
      {/* Background radial warmth */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C9A24B]/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center">
        {/* Brand Icon */}
        <div className="relative mb-6">
          <div
            className={`absolute inset-0 bg-[#C9A24B]/20 rounded-2xl blur-lg transition-opacity duration-1000 ${
              loadError ? 'opacity-30' : 'animate-pulse opacity-80'
            }`}
            aria-hidden="true"
          />
          <div className="relative w-16 h-16 rounded-2xl bg-[#1E1B17] border border-[#C9A24B]/40 flex items-center justify-center shadow-2xl">
            {loadError ? (
              <AlertCircle className="w-8 h-8 text-[#C9A24B]" aria-hidden="true" />
            ) : (
              <Flame className="w-8 h-8 text-[#C9A24B] animate-pulse" aria-hidden="true" />
            )}
          </div>
        </div>

        {/* Brand Title */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24B] mb-1.5">
          Harare · Zimbabwe
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F4ECDA] tracking-tight">
          Velquarath Cafe
        </h1>
        <p className="text-xs text-[#B8AD96] mt-1 tracking-wide">
          Flame-Grilled Meats · Traditional Plates · Craft Cocktails
        </p>

        {/* State 1: Active Loading */}
        {!loadError ? (
          <div className="mt-8 flex flex-col items-center w-full max-w-xs">
            {/* Shimmering Progress Bar */}
            <div className="w-full h-1 bg-[#26221D] rounded-full overflow-hidden relative">
              <div
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent rounded-full animate-[shimmer_1.6s_ease-in-out_infinite]"
                style={{
                  animation: 'loading-slide 1.4s ease-in-out infinite',
                }}
              />
            </div>
            <p className="text-xs text-[#736B5E] mt-3.5 flex items-center gap-2">
              <span>Fetching live menu &amp; daily kitchen boards...</span>
            </p>
          </div>
        ) : (
          /* State 2: Error / Slow Connection / Unavailable */
          <div className="mt-6 w-full bg-[#1E1B17] border border-[#332E26] rounded-2xl p-6 text-center shadow-xl">
            <h2 className="font-display text-base font-bold text-[#F4ECDA] mb-2">
              Live Connection Unavailable
            </h2>
            <p className="text-xs text-[#B8AD96] leading-relaxed mb-6">
              {loadError ||
                "We could not establish a connection to the live restaurant database. To ensure you never see outdated prices or sold-out items, please retry connecting."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  disabled={isRetrying}
                  className="px-5 py-2.5 text-xs font-semibold bg-[#C9A24B] text-[#141210] rounded-lg hover:bg-[#DFB85E] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-md"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                  <span>{isRetrying ? 'Connecting...' : 'Retry Connection'}</span>
                </button>
              )}

              {onContinueOffline && (
                <button
                  type="button"
                  onClick={onContinueOffline}
                  className="px-4 py-2.5 text-xs font-medium bg-[#141210] text-[#B8AD96] border border-[#332E26] rounded-lg hover:border-[#C9A24B] hover:text-[#F4ECDA] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>View Archived Sample Menu</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-[#736B5E] mt-4">
              Archived view displays sample prices that may differ from today’s board.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes loading-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};
