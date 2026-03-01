
import { PaymentCard } from '@/types';
import { CardBrandBadge } from '@/components/shared/CardBrandBadge';
import { Check, Plus } from 'lucide-react';

interface PaymentCardPickerProps {
  cards: PaymentCard[];
  selectedId?: string;
  onSelect: (cardId: string) => void;
  onAddCard?: () => void;
}

export function PaymentCardPicker({ cards, selectedId, onSelect, onAddCard }: PaymentCardPickerProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
        Payment Card
      </p>
      <div className="grid grid-cols-1 gap-2">
        {cards.map((card) => {
          const isSelected = card.id === selectedId;
          return (
            <button
              key={card.id}
              onClick={() => onSelect(card.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                isSelected
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
              <div
                className="w-10 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ backgroundColor: card.color || '#4B5563' }}
              >
                ••
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{card.nickname}</p>
                <CardBrandBadge brand={card.brand} last4={card.last4} />
              </div>
              {isSelected && <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />}
            </button>
          );
        })}
        {onAddCard && (
          <button
            onClick={onAddCard}
            className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-white/20 hover:border-purple-500/50 text-gray-400 hover:text-purple-400 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add new card</span>
          </button>
        )}
      </div>
    </div>
  );
}
