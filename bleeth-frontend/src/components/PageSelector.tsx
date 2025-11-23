import styles from "./PageSelector.module.css";

interface PageSelectorProps {
  onAttackClick: () => void;
  onPotsClick: () => void;
}

export default function PageSelector({ onAttackClick, onPotsClick }: PageSelectorProps) {
  return (
    <div id="pageSelector" className="w-full h-full flex flex-col gap-4  justify-items-center items-center content-center ">
      <div 
        id="attacks" 
        onClick={onAttackClick}
        className={`w-full h-full flex flex-col gap-4 pt-24  justify-items-center items-center content-center hover:cursor-pointer ${styles.attacksContainer}`}
      >
        <img src="/attack.avif" alt="Attacks" className={`w-32 h-32 ${styles.attackImage}`} />
        <p className={`text-red-300 text-2xl font-bold ${styles.attackText}`}>Attack</p>
      </div>
      <div 
        id="pots" 
        onClick={onPotsClick}
        className={`w-full h-full flex flex-col gap-4 pb-24  justify-items-center items-center content-center justify-center hover:cursor-pointer ${styles.potsContainer}`}
      >
        <img src="/pot.avif" alt="Pots" className={`w-32 h-32 ${styles.potImage}`} />
        <p className={`text-red-900 text-2xl font-bold ${styles.potText}`}>Join the horde</p>
      </div>
    </div>
  );
}

