import { DEFAULT_LANGUAGE } from '@/context/i18n';

export const DEFAULT_CURRENCY = 'EUR';

export const formatAmount = (
  amount: number,
  options?: Intl.NumberFormatOptions,
  locale: string = DEFAULT_LANGUAGE,
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: DEFAULT_CURRENCY,
    ...options,
  }).format(amount);
};

// https://stackoverflow.com/a/62688921/15183871
export const fractionAmount = (
  amount: number,
  options?: Intl.NumberFormatOptions,
  ...args: string[]
): string => {
  const shouldFraction = Boolean(amount % 1);
  const decimals = shouldFraction ? 2 : 0;
  return formatAmount(
    amount,
    {
      ...options,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    },
    ...args,
  );
};
