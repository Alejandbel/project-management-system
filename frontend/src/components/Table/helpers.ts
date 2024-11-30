import React from 'react';

import { ColumnType } from './types';

export function getTemplate<
  T,
  TKey extends keyof T = keyof T,
>(data: T | null, key: TKey, typeOrTemplate: ColumnType | ((val: T[TKey]) => React.ReactNode)): React.ReactNode {
  if (!data) {
    return null;
  }

  const value = data[key];

  if (value === null || value === undefined) {
    return null;
  }

  if (typeof typeOrTemplate === 'string') {
    switch (typeOrTemplate) {
      case 'string':
        return String(value);
      case 'date':
        return (value as unknown as Date).toString();
      case 'numeric':
        return value as number;
      case 'logical':
        return value.toString();
      default:
        throw new Error('Unknown type');
    }
  } else {
    return typeOrTemplate(value);
  }
}
