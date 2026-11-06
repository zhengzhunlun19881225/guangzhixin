import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import './select-field.css';

export type SelectOption = { value: string; label: string; icon?: React.ReactNode; disabled?: boolean };
type Props = {
  label: string;
  options: (string | SelectOption)[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  variant?: 'field' | 'compact' | 'pill';
  placement?: 'auto' | 'top';
  placeholder?: boolean;
};

export function SelectField({ label, options, value, onChange, className = '', variant = 'field', placement = 'auto', placeholder = false }: Props) {
  const items = options.map(option => typeof option === 'string' ? { value: option, label: option } : option);
  const [ownValue, setOwnValue] = useState(items[0]?.value ?? '');
  const selectedValue = value ?? ownValue;
  const selectedIndex = items.findIndex(item => item.value === selectedValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 160, maxHeight: 280 });
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const id = useId();
  const typed = useRef({ text: '', time: 0 });
  const enabled = items.map((item, index) => item.disabled ? -1 : index).filter(index => index >= 0);
  const show = (last = false) => {
    if (!enabled.length) return;
    setActive(selectedIndex >= 0 && !items[selectedIndex].disabled ? selectedIndex : last ? enabled[enabled.length - 1] : enabled[0]);
    setOpen(true);
  };
  const choose = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    setOwnValue(item.value);
    onChange?.(item.value);
    setOpen(false);
    trigger.current?.focus();
  };

  useLayoutEffect(() => {
    if (!open) return;
    const panel = popup.current!;
    panel.showPopover();
    const update = () => {
      const rect = trigger.current!.getBoundingClientRect();
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      const width = viewport?.width ?? window.innerWidth;
      const topOffset = viewport?.offsetTop ?? 0;
      const leftOffset = viewport?.offsetLeft ?? 0;
      if (rect.bottom < topOffset || rect.top > height + topOffset) { setOpen(false); return; }
      const menuWidth = Math.min(Math.max(rect.width, 160), width - 16);
      const desiredHeight = Math.min(panel.scrollHeight, 280);
      const above = Math.max(0, rect.top - topOffset - 14);
      const below = Math.max(0, height + topOffset - rect.bottom - 14);
      const upwards = (placement === 'top' && above >= desiredHeight) || (below < desiredHeight && above > below);
      const maxHeight = Math.min(280, upwards ? above : below);
      setPosition({ width: menuWidth, maxHeight, left: Math.max(leftOffset + 8, Math.min(rect.left, leftOffset + width - menuWidth - 8)), top: upwards ? rect.top - 6 - Math.min(desiredHeight, maxHeight) : rect.bottom + 6 });
    };
    update();
    const scroll = (event: Event) => { if (!panel.contains(event.target as Node)) update(); };
    window.addEventListener('resize', update);
    document.addEventListener('scroll', scroll, true);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      if (panel.matches(':popover-open')) panel.hidePopover();
      window.removeEventListener('resize', update);
      document.removeEventListener('scroll', scroll, true);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, [open, placement, items.length]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: Event) => {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !popup.current?.contains(target)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('focusin', outside); };
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active, id]);

  const keyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Tab') { setOpen(false); return; }
    if (event.key === 'Escape') { if (open) { event.preventDefault(); event.stopPropagation(); setOpen(false); } return; }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open ? choose(active) : show(); return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!open) { show(event.key === 'ArrowUp' || event.key === 'End'); return; }
      const index = enabled.indexOf(active);
      setActive(event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1] : enabled[(index + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length]);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now();
      typed.current = { text: (now - typed.current.time < 700 ? typed.current.text : '') + event.key.toLowerCase(), time: now };
      const found = items.findIndex(item => !item.disabled && item.label.toLowerCase().startsWith(typed.current.text));
      if (found >= 0) { event.preventDefault(); setActive(found); setOpen(true); }
    }
  };

  return <>
    <button ref={trigger} type="button" role="combobox" aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? `${id}-list` : undefined} aria-activedescendant={open ? `${id}-option-${active}` : undefined} disabled={!enabled.length} className={`ui-select ui-select-${variant} ${className}`} data-placeholder={placeholder} onClick={() => open ? setOpen(false) : show()} onKeyDown={keyDown}>
      <span>{items[selectedIndex]?.label ?? label}</span><ChevronDown size={14} aria-hidden="true" />
    </button>
    {open && createPortal(<div ref={popup} popover="manual" id={`${id}-list`} role="listbox" aria-label={label} className="ui-select-menu" style={position}>
      {items.map((item, index) => <div id={`${id}-option-${index}`} key={item.value} role="option" aria-selected={item.value === selectedValue} aria-disabled={item.disabled || undefined} className={`ui-select-option ${active === index ? 'is-active' : ''}`} onPointerMove={() => !item.disabled && setActive(index)} onPointerDown={event => event.preventDefault()} onClick={() => choose(index)}>
        {item.icon && <span className="ui-select-option-icon" aria-hidden="true">{item.icon}</span>}<span>{item.label}</span>
      </div>)}
    </div>, document.body)}
  </>;
}
