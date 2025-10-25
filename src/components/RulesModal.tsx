'use client';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      data-testid="modal-backdrop"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Five Crowns Rules</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold px-2"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="space-y-4 text-gray-700">
            <p>
              Five Crowns is a card game for the whole family. It has original game play,
              but uses skills that you have obtained from playing your favorite card games.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold mb-2">For complete rules and detailed gameplay:</p>
              <a
                href="https://cdn.1j1ju.com/medias/b3/19/ed-five-crowns-rulebook.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                View Full Rulebook (PDF)
              </a>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Quick Overview:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>11 hands are played over the course of the game</li>
                <li>Each hand has a different wild card (3s through Kings)</li>
                <li>Goal: Make books (3+ of same rank) and runs (3+ in sequence)</li>
                <li>Lowest total score after all hands wins</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
