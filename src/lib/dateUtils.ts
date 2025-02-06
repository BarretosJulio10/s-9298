
export const getNextDueDateDays = (frequency: string): number => {
  switch (frequency) {
    case 'weekly':
      return 7;
    case 'biweekly':
      return 14;
    case 'monthly':
      return 30;
    case 'quarterly':
      return 90;
    case 'semiannual':
      return 180;
    case 'yearly':
      return 365;
    default:
      return 30; // Default to monthly
  }
};
