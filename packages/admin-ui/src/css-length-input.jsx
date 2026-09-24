import React from 'react';
import { cn } from './cn.js';
import { createInputComponents } from './input.jsx';
import { createSelect } from './select.jsx';

export const cssLengthUnits = ['px', 'rem', 'em', '%', 'vh', 'vw', 'dvh', 'dvw'];

function normalizeUnit(unit, units = cssLengthUnits, fallbackUnit = 'px') {
  const allowed = Array.isArray(units) && units.length ? units.map(String) : cssLengthUnits;
  const rawUnit = String(unit || '').trim().toLowerCase();
  const rawFallback = String(fallbackUnit || '').trim().toLowerCase();

  if (allowed.includes(rawUnit)) {
    return rawUnit;
  }

  if (allowed.includes(rawFallback)) {
    return rawFallback;
  }

  return allowed[0] || 'px';
}

function getFallbackParts(fallback, units, defaultUnit) {
  const parsed = parseCssLengthValue(fallback, units);

  if (parsed) {
    return parsed;
  }

  return {
    amount: '0',
    unit: normalizeUnit(defaultUnit, units),
  };
}

function trimDecimal(value) {
  const number = Number.parseFloat(String(value).replace(',', '.'));

  if (!Number.isFinite(number)) {
    return '';
  }

  return String(Math.round(number * 100) / 100);
}

export function parseCssLengthValue(value, units = cssLengthUnits) {
  const rawValue = String(value ?? '').trim().toLowerCase().replace(',', '.');

  if (rawValue === '') {
    return null;
  }

  if (rawValue === '0') {
    return { amount: '0', unit: normalizeUnit('', units) };
  }

  const match = rawValue.match(/^([0-9]+(?:\.[0-9]{1,2})?)([a-z%]+)$/);
  if (!match) {
    return null;
  }

  const unit = normalizeUnit(match[2], units, '');
  if (unit !== match[2]) {
    return null;
  }

  return {
    amount: trimDecimal(match[1]),
    unit,
  };
}

export function splitCssLengthValue(value, {
  fallback = '1rem',
  units = cssLengthUnits,
  allowEmpty = false,
  defaultUnit = '',
} = {}) {
  const parsed = parseCssLengthValue(value, units);
  if (parsed) {
    return parsed;
  }

  const fallbackParts = getFallbackParts(fallback, units, defaultUnit);
  if (allowEmpty) {
    return {
      amount: '',
      unit: fallbackParts.unit,
    };
  }

  return fallbackParts;
}

export function formatCssLengthValue(amount, unit, {
  fallback = '1rem',
  units = cssLengthUnits,
  min = 0,
  max = 1000,
  allowEmpty = false,
  defaultUnit = '',
} = {}) {
  const fallbackParts = getFallbackParts(fallback, units, defaultUnit);
  const rawAmount = String(amount ?? '').trim();

  if (rawAmount === '') {
    return allowEmpty ? '' : `${fallbackParts.amount}${fallbackParts.unit}`;
  }

  const numeric = Number.parseFloat(rawAmount.replace(',', '.'));
  if (!Number.isFinite(numeric)) {
    return allowEmpty ? '' : `${fallbackParts.amount}${fallbackParts.unit}`;
  }

  const safeMin = Number.isFinite(Number(min)) ? Number(min) : 0;
  const safeMax = Number.isFinite(Number(max)) ? Number(max) : 1000;
  const bounded = Math.min(Math.max(numeric, safeMin), safeMax);
  const amountText = trimDecimal(bounded);

  return `${amountText}${normalizeUnit(unit, units, fallbackParts.unit)}`;
}

export function normalizeCssLengthValue(value, options = {}) {
  const parts = splitCssLengthValue(value, options);

  return formatCssLengthValue(parts.amount, parts.unit, options);
}

function getUnitOptions(units) {
  return (Array.isArray(units) && units.length ? units : cssLengthUnits).map((unit) => ({
    value: unit,
    label: unit,
  }));
}

export function createCssLengthInput(themeName = 'niceMenu') {
  const { Input } = createInputComponents(themeName);
  const Select = createSelect(themeName);

  return function CssLengthInput({
    value,
    onChange,
    fallback = '1rem',
    units = cssLengthUnits,
    min = 0,
    max = 1000,
    step = '0.1',
    allowEmpty = false,
    className = '',
    numberAriaLabel = 'Value',
    unitAriaLabel = 'Unit',
  }) {
    const parts = splitCssLengthValue(value, { fallback, units, allowEmpty });
    const emit = (amount, unit) => {
      onChange(formatCssLengthValue(amount, unit, {
        fallback,
        units,
        min,
        max,
        step,
        allowEmpty,
      }));
    };

    return (
      <div className={cn('tw-grid tw-grid-cols-[minmax(0,1fr)_96px] tw-gap-2', className)}>
        <Input
          type='number'
          min={min}
          max={max}
          step={step}
          value={parts.amount}
          aria-label={numberAriaLabel}
          onChange={(event) => emit(event.target.value, parts.unit)}
        />
        <Select
          value={parts.unit}
          onValueChange={(nextUnit) => emit(parts.amount, nextUnit)}
          options={getUnitOptions(units)}
          ariaLabel={unitAriaLabel}
        />
      </div>
    );
  };
}
