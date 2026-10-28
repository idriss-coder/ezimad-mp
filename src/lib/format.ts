const formatter = new Intl.NumberFormat("fr-FR");

export const formatNumber = (value: number) => formatter.format(value);

/** 1275 → « 1 275 FCFA » (espaces insécables). */
export const formatFcfa = (value: number) => `${formatter.format(value)} FCFA`;
