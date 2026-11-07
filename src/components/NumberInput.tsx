import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './number-input.css';

type Props = { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number; disabled?: boolean; readOnly?: boolean; actionLabel?: string };

/** Quantity control with a full-height, 16px stepper at the right edge. */
export function NumberInput({ label, value, onChange, min, max, step = 1, disabled = false, readOnly = false, actionLabel = label }: Props) {
  const input = useRef<HTMLInputElement>(null), [empty, setEmpty] = useState(false);
  const bounded = (next: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, next));
  const adjust = (direction: number) => {
    if (disabled || readOnly || !input.current) return;
    input.current.value = String(value);
    if (direction > 0) input.current.stepUp(); else input.current.stepDown();
    const next = input.current.valueAsNumber;
    if (Number.isFinite(next)) onChange(bounded(next));
    setEmpty(false);
  };
  return <div className="gx-number-input" data-disabled={disabled} data-readonly={readOnly}>
    <input ref={input} type="number" aria-label={label} min={min} max={max} step={step} value={empty ? '' : value} disabled={disabled} readOnly={readOnly}
      onChange={event => { const next = event.currentTarget.valueAsNumber; setEmpty(!Number.isFinite(next)); if (Number.isFinite(next)) onChange(bounded(next)); }}
      onBlur={() => setEmpty(false)}
      onKeyDown={event => { if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); adjust(event.key === 'ArrowUp' ? 1 : -1); } }}/>
    <div className="gx-number-stepper"><button type="button" aria-label={`增加${actionLabel}`} disabled={disabled || readOnly || (max !== undefined && value >= max)} onClick={() => adjust(1)}><ChevronUp size={10} aria-hidden="true"/></button><button type="button" aria-label={`减少${actionLabel}`} disabled={disabled || readOnly || (min !== undefined && value <= min)} onClick={() => adjust(-1)}><ChevronDown size={10} aria-hidden="true"/></button></div>
  </div>;
}
