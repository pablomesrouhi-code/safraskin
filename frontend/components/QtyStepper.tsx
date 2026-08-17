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
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={onDecrease}
        disabled={canDecrease}
        aria-label="نقّصي"
        className={clsx(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 text-2xl font-bold leading-none transition",
          canDecrease
            ? "cursor-not-allowed border-border text-gray-300"
            : "border-border text-ink hover:border-rose hover:text-rose"
        )}
      >
        −
      </button>
      <span className="min-w-[2.5rem] text-center text-2xl font-extrabold tabular-nums text-ink">{qty}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={canIncrease}
        className={clsx(
          "h-11 min-w-[5.5rem] rounded-xl px-4 text-sm font-bold transition",
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
