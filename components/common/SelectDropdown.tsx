/**
 * SelectDropdown Component
 *
 * Reusable dropdown select component with consistent styling across the dashboard.
 * Prevents text cutoff with proper padding and custom chevron icon.
 *
 * Features:
 * - Custom SVG chevron icon (consistent cross-browser)
 * - Size variants (sm, md, lg)
 * - Color themes for focus rings
 * - Full accessibility support
 * - TypeScript type safety
 *
 * @example
 * ```tsx
 * <SelectDropdown
 *   value={status}
 *   onChange={(e) => setStatus(e.target.value)}
 *   options={[
 *     { value: 'all', label: 'All Status' },
 *     { value: 'active', label: 'Active' }
 *   ]}
 * />
 * ```
 */

'use client';

import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectDropdownProps {
  /** Current selected value */
  value: string;

  /** Change handler */
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;

  /** Array of options to display */
  options: SelectOption[];

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Color theme for focus ring */
  colorTheme?: 'blue' | 'purple' | 'green';

  /** Additional CSS classes */
  className?: string;

  /** Disabled state */
  disabled?: boolean;

  /** ARIA label for accessibility */
  ariaLabel?: string;

  /** Optional name attribute */
  name?: string;
}

// Custom chevron SVG as data URL (same as inline version)
const CHEVRON_ICON = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")';

/**
 * Size configuration for different variants
 */
const sizeConfig = {
  sm: 'text-xs pl-3 pr-8 py-1.5',
  md: 'text-sm pl-4 pr-10 py-2.5',
  lg: 'text-base pl-5 pr-12 py-3',
};

/**
 * Color configuration for focus ring themes
 */
const colorConfig = {
  blue: 'focus:ring-blue-500',
  purple: 'focus:ring-purple-500',
  green: 'focus:ring-green-500',
};

/**
 * SelectDropdown Component
 */
export function SelectDropdown({
  value,
  onChange,
  options,
  size = 'md',
  colorTheme = 'blue',
  className = '',
  disabled = false,
  ariaLabel,
  name,
}: SelectDropdownProps) {
  const sizeClasses = sizeConfig[size];
  const colorClasses = colorConfig[colorTheme];

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      name={name}
      className={`
        ${sizeClasses}
        border border-gray-300 rounded-lg
        focus:ring-2 ${colorClasses} focus:border-transparent
        bg-white appearance-none cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-150
        ${className}
      `}
      style={{
        backgroundImage: CHEVRON_ICON,
        backgroundPosition: 'right 0.75rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.25em 1.25em',
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default SelectDropdown;
