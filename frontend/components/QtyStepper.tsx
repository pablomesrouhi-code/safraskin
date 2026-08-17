"use client";

import clsx from "clsx";

type QtyStepperProps = {
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  max?: number;
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
};

export default function QtyStepper({
  qty,
  onDecrease,
  onIncrease,
  min = 1,
  max = 3,
  decreaseDisabled,
  increaseDisabled,
}: QtyStepperProps) {
  const canDecrease = decreaseDisabled ?? qty <= min;
  const canIncrease = increaseDisabled ?? qty >= max;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={onDecrease}
        disabled={canDecrease}
        aria-label="نقّصي"
        className={clsx(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xl font-bold leading-none transition",
          canDecrease
            ? "cursor-not-allowed border-border text-gray-300"
            : "border-border text-ink hover:border-rose hover:text-rose"
        )}
      >
        −
      </button>
      <span className="min-w-[2rem] text-center text-lg font-extrabold tabular-nums text-ink">{qty}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={canIncrease}
        className={clsx(
          "h-9 min-w-[4.5rem] rounded-lg px-3 text-xs font-bold transition",
          canIncrease
            ? "cursor-not-allowed bg-rose/30 text-white"
            : "bg-rose text-white hover:bg-rose-dark"
        )}
      >
        أضيفي
      </button>
    </div>
  );
}
