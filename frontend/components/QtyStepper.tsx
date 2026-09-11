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
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-xl font-bold leading-none transition",
          canDecrease
            ? "cursor-not-allowed border-border text-gray-300"
            : "border-rose/40 text-rose hover:border-rose hover:bg-rose/5"
        )}
      >
        −
      </button>
      <span className="min-w-[2rem] text-center text-lg font-extrabold tabular-nums text-ink">{qty}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={canIncrease}
        aria-label="زيدي"
        className={clsx(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-xl font-bold leading-none transition",
          canIncrease
            ? "cursor-not-allowed border-border bg-rose/20 text-white"
            : "border-rose bg-rose text-white hover:bg-rose-dark"
        )}
      >
        +
      </button>
    </div>
  );
}
