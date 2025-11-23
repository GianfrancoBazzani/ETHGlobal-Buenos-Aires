interface PotsProps {
  onBack: () => void;
}

export default function Pots({ onBack }: PotsProps) {
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center p-4">
      <button 
        onClick={onBack}
        className="text-white hover:text-red-300 mb-4 text-lg"
      >
        ← Back
      </button>
      <h1 className="text-red-900 text-3xl font-bold mb-4">Join the horde</h1>
      <div className="w-full flex flex-col gap-4">
        <p className="text-white text-center">Pots functionality coming soon...</p>
      </div>
    </div>
  );
}

