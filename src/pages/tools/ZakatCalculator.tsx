import React, { useState, useMemo, useRef } from "react";
import {
  Coins,
  Landmark,
  Wallet,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Scale,
  CheckCircle2,
  XCircle,
  Info,
  BookOpen,
  Calculator,
} from "lucide-react";
import { useTr, type Loc } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Currencies
// ---------------------------------------------------------------------------

interface CurrencyDef {
  code: string;
  /** Approximate silver-based Nisab in this currency (verify with live prices). */
  defaultNisab: number;
  label: Loc;
}

// Default Nisab values are rough silver-based estimates (~US$560 equivalent),
// shown as a starting point. The UI tells the user to verify against live prices.
const CURRENCIES: CurrencyDef[] = [
  { code: "XOF", defaultNisab: 350000, label: { en: "West African CFA — XOF", fr: "Franc CFA — XOF" } },
  { code: "USD", defaultNisab: 560, label: { en: "US Dollar — USD", fr: "Dollar US — USD" } },
  { code: "EUR", defaultNisab: 520, label: { en: "Euro — EUR", fr: "Euro — EUR" } },
  { code: "GBP", defaultNisab: 450, label: { en: "British Pound — GBP", fr: "Livre sterling — GBP" } },
  { code: "NGN", defaultNisab: 900000, label: { en: "Nigerian Naira — NGN", fr: "Naira nigérian — NGN" } },
  { code: "GHS", defaultNisab: 8500, label: { en: "Ghanaian Cedi — GHS", fr: "Cedi ghanéen — GHS" } },
  { code: "GMD", defaultNisab: 40000, label: { en: "Gambian Dalasi — GMD", fr: "Dalasi gambien — GMD" } },
  { code: "MAD", defaultNisab: 5600, label: { en: "Moroccan Dirham — MAD", fr: "Dirham marocain — MAD" } },
  { code: "SAR", defaultNisab: 2100, label: { en: "Saudi Riyal — SAR", fr: "Riyal saoudien — SAR" } },
  { code: "AED", defaultNisab: 2050, label: { en: "UAE Dirham — AED", fr: "Dirham des EAU — AED" } },
];

const currencyDefFor = (code: string): CurrencyDef =>
  CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];

/** Best-effort guess of the user's currency from their locale region; falls back to XOF. */
function detectCurrency(): string {
  try {
    const loc = new Intl.Locale(navigator.language);
    const region = (loc as any).maximize?.().region ?? loc.region;
    const map: Record<string, string> = {
      SN: "XOF", CI: "XOF", BJ: "XOF", BF: "XOF", ML: "XOF", NE: "XOF", TG: "XOF", GW: "XOF",
      NG: "NGN", GH: "GHS", GM: "GMD", MA: "MAD",
      US: "USD", GB: "GBP", SA: "SAR", AE: "AED",
      FR: "EUR", BE: "EUR", DE: "EUR", ES: "EUR", IT: "EUR",
    };
    if (region && map[region] && CURRENCIES.some((c) => c.code === map[region])) {
      return map[region];
    }
  } catch {
    /* ignore — fall back below */
  }
  return "XOF";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface InputRowProps {
  icon: React.ReactNode;
  label: string;
  helper?: string;
  value: number;
  onChange: (v: number) => void;
  isDebt?: boolean;
}

const InputRow: React.FC<InputRowProps> = ({
  icon,
  label,
  helper,
  value,
  onChange,
  isDebt = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-0.5">
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
            isDebt
              ? "bg-destructive/10 text-destructive"
              : "bg-accent/50 text-primary"
          }`}
        >
          {icon}
        </span>
        <label className="text-sm font-medium text-foreground">{label}</label>
      </div>
      {helper && (
        <p className="text-xs text-muted-foreground pl-9 mb-0.5">{helper}</p>
      )}
      <div className="pl-9">
        <input
          type="number"
          min={0}
          value={value === 0 ? "" : value}
          placeholder="0"
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            onChange(isNaN(parsed) ? 0 : Math.max(0, parsed));
          }}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Result card row
// ---------------------------------------------------------------------------

interface ResultRowProps {
  label: string;
  value: string;
  subtle?: boolean;
}

const ResultRow: React.FC<ResultRowProps> = ({ label, value, subtle }) => (
  <div
    className={`flex items-center justify-between py-2 border-b border-border last:border-0 ${
      subtle ? "opacity-70" : ""
    }`}
  >
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-semibold text-foreground">{value}</span>
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const ZakatCalculator: React.FC = () => {
  const tr = useTr();
  const resultRef = useRef<HTMLDivElement>(null);

  // Currency (auto-detected from locale, defaults to XOF for West Africa)
  const [currency, setCurrency] = useState<string>(detectCurrency);

  // Asset inputs
  const [gold, setGold] = useState<number>(0);
  const [silver, setSilver] = useState<number>(0);
  const [cash, setCash] = useState<number>(0);
  const [investments, setInvestments] = useState<number>(0);
  const [business, setBusiness] = useState<number>(0);
  const [debts, setDebts] = useState<number>(0);
  const [nisab, setNisab] = useState<number>(() => currencyDefFor(detectCurrency()).defaultNisab);

  // Show result section after clicking calculate
  const [resultVisible, setResultVisible] = useState<boolean>(false);

  // Format a number as currency in the selected currency. XOF has no minor units.
  const formatMoney = (val: number): string => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: currency === "XOF" ? 0 : 2,
        minimumFractionDigits: currency === "XOF" ? 0 : 2,
      }).format(val);
    } catch {
      return `${val.toLocaleString()} ${currency}`;
    }
  };

  const handleCurrencyChange = (code: string) => {
    setCurrency(code);
    // Re-baseline the Nisab to the new currency's default estimate.
    setNisab(currencyDefFor(code).defaultNisab);
  };

  // Live calculation via useMemo
  const result = useMemo(() => {
    const zakatableAssets = gold + silver + cash + investments + business;
    const net = Math.max(0, zakatableAssets - debts);
    const meetsNisab = net >= nisab;
    const zakatDue = meetsNisab ? net * 0.025 : 0;
    return { zakatableAssets, net, meetsNisab, zakatDue };
  }, [gold, silver, cash, investments, business, debts, nisab]);

  const handleCalculate = () => {
    setResultVisible(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // ---------------------------------------------------------------------------
  // Field definitions
  // ---------------------------------------------------------------------------

  type FieldDef = {
    icon: React.ReactNode;
    label: Loc;
    helper?: Loc;
    value: number;
    setter: (v: number) => void;
    isDebt?: boolean;
  };

  const assetFields: FieldDef[] = [
    {
      icon: <Coins className="w-3.5 h-3.5" />,
      label: { en: "Gold Value", fr: "Valeur de l'or" },
      value: gold,
      setter: setGold,
    },
    {
      icon: <Coins className="w-3.5 h-3.5" />,
      label: { en: "Silver Value", fr: "Valeur de l'argent" },
      value: silver,
      setter: setSilver,
    },
    {
      icon: <Wallet className="w-3.5 h-3.5" />,
      label: { en: "Cash & Bank Savings", fr: "Espèces & épargne bancaire" },
      value: cash,
      setter: setCash,
    },
    {
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      label: { en: "Investments", fr: "Investissements" },
      helper: {
        en: "Stocks, bonds, mutual funds, crypto, etc.",
        fr: "Actions, obligations, fonds, crypto, etc.",
      },
      value: investments,
      setter: setInvestments,
    },
    {
      icon: <ShoppingBag className="w-3.5 h-3.5" />,
      label: { en: "Business Assets", fr: "Actifs professionnels" },
      helper: {
        en: "Value of inventory, receivables, business cash",
        fr: "Valeur des stocks, créances, trésorerie",
      },
      value: business,
      setter: setBusiness,
    },
  ];

  const debtField: FieldDef = {
    icon: <CreditCard className="w-3.5 h-3.5" />,
    label: { en: "Debts Owed", fr: "Dettes" },
    helper: {
      en: "Short-term debts that are due within the year",
      fr: "Dettes à court terme dues dans l'année",
    },
    value: debts,
    setter: setDebts,
    isDebt: true,
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div>
      <section className="container py-8 md:py-10 space-y-8">
        {/* Page header */}
        <header>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
            {tr({ en: "Tools", fr: "Outils" })}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {tr({ en: "Zakat Calculator", fr: "Calculateur de Zakât" })}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            {tr({
              en: "Calculate your Zakat obligation based on your assets and liabilities.",
              fr: "Calculez votre obligation de Zakât à partir de vos actifs et de vos dettes.",
            })}
          </p>
        </header>

        {/* Two-column grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ----------------------------------------------------------------
              LEFT / MAIN COLUMN  (inputs + result)
          ---------------------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Asset inputs card */}
            <div className="islamic-card p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/50 text-primary">
                    <Calculator className="w-4 h-4" />
                  </span>
                  <h2 className="text-lg font-semibold text-foreground">
                    {tr({ en: "Enter Your Assets", fr: "Saisissez vos actifs" })}
                  </h2>
                </div>

                {/* Currency selector */}
                <div className="flex items-center gap-2">
                  <label htmlFor="currency-select" className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                    {tr({ en: "Currency", fr: "Devise" })}
                  </label>
                  <select
                    id="currency-select"
                    value={currency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="text-sm bg-card border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {tr(c.label)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
                {tr({
                  en: `Enter all amounts in ${currency}.`,
                  fr: `Saisissez tous les montants en ${currency}.`,
                })}
              </p>

              <div className="grid sm:grid-cols-2 gap-5">
                {assetFields.map((field) => (
                  <InputRow
                    key={field.label.en}
                    icon={field.icon}
                    label={tr(field.label)}
                    helper={field.helper ? tr(field.helper) : undefined}
                    value={field.value}
                    onChange={field.setter}
                  />
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-border pt-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" />
                  {tr({ en: "Deduct Debts", fr: "Déduire les dettes" })}
                </p>
                <InputRow
                  icon={debtField.icon}
                  label={tr(debtField.label)}
                  helper={debtField.helper ? tr(debtField.helper) : undefined}
                  value={debtField.value}
                  onChange={debtField.setter}
                  isDebt
                />
              </div>

              {/* Nisab threshold */}
              <div className="border-t border-border pt-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" />
                  {tr({ en: "Nisab Threshold", fr: "Seuil du Nisab" })}
                </p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent/50 text-primary">
                      <Landmark className="w-3.5 h-3.5" />
                    </span>
                    <label className="text-sm font-medium text-foreground">
                      {tr({
                        en: `Nisab threshold (${currency})`,
                        fr: `Seuil du Nisab (${currency})`,
                      })}
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground pl-9 mb-0.5 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary" />
                    {tr({
                      en: "Nisab is based on 87.48g of gold or 612.36g of silver. Verify against current market prices in your currency before calculating.",
                      fr: "Le Nisab est basé sur 87,48 g d'or ou 612,36 g d'argent. Vérifiez les prix actuels du marché dans votre devise avant de calculer.",
                    })}
                  </p>
                  <div className="pl-9">
                    <input
                      type="number"
                      min={0}
                      value={nisab === 0 ? "" : nisab}
                      placeholder="0"
                      onChange={(e) => {
                        const parsed = parseFloat(e.target.value);
                        setNisab(isNaN(parsed) ? 0 : Math.max(0, parsed));
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>
              </div>

              {/* Calculate button */}
              <button
                type="button"
                onClick={handleCalculate}
                className="btn-islamic w-full mt-2"
              >
                <Calculator className="w-4 h-4" />
                {tr({ en: "Calculate Zakat", fr: "Calculer la Zakât" })}
              </button>
            </div>

            {/* Result card — always rendered but visually revealed */}
            <div
              ref={resultRef}
              className={`transition-all duration-500 ${
                resultVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none select-none"
              }`}
              aria-live="polite"
            >
              <div className="islamic-card p-6 space-y-4">
                {/* Header row */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/50 text-primary">
                    <Scale className="w-4 h-4" />
                  </span>
                  <h2 className="text-lg font-semibold text-foreground">
                    {tr({ en: "Your Zakat Summary", fr: "Résumé de votre Zakât" })}
                  </h2>
                </div>

                {/* Breakdown rows */}
                <div className="rounded-xl bg-secondary/40 border border-border p-4 space-y-0.5">
                  <ResultRow
                    label={tr({
                      en: "Total Zakatable Assets",
                      fr: "Total des actifs zakâtables",
                    })}
                    value={formatMoney(result.zakatableAssets)}
                  />
                  <ResultRow
                    label={tr({
                      en: "Less: Debts Owed",
                      fr: "Moins : Dettes",
                    })}
                    value={`− ${formatMoney(debts)}`}
                    subtle
                  />
                  <ResultRow
                    label={tr({
                      en: "Net Zakatable Wealth",
                      fr: "Richesse nette zakâtable",
                    })}
                    value={formatMoney(result.net)}
                  />
                </div>

                {/* Nisab status */}
                <div
                  className={`flex items-center gap-3 rounded-xl p-4 border ${
                    result.meetsNisab
                      ? "bg-accent/50 border-primary/20"
                      : "bg-secondary/50 border-border"
                  }`}
                >
                  {result.meetsNisab ? (
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        result.meetsNisab ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {result.meetsNisab
                        ? tr({
                            en: "Above Nisab threshold",
                            fr: "Au-dessus du seuil du Nisab",
                          })
                        : tr({
                            en: "Below Nisab threshold",
                            fr: "En dessous du seuil du Nisab",
                          })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {tr({ en: "Nisab:", fr: "Nisab :" })}{" "}
                      <span className="font-medium text-foreground">
                        {formatMoney(nisab)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Zakat Due */}
                <div className="rounded-2xl bg-primary/8 border-2 border-primary/20 p-5 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    {tr({ en: "Zakat Due (2.5%)", fr: "Zakât due (2,5 %)" })}
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    {formatMoney(result.zakatDue)}
                  </p>
                  {!result.meetsNisab && (
                    <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
                      {tr({
                        en: "No Zakat is due this year, as your net wealth is below the Nisab. However, you are encouraged to give voluntary Sadaqah.",
                        fr: "Aucune Zakât n'est due cette année, car votre richesse nette est inférieure au Nisab. Vous êtes néanmoins encouragé(e) à donner une Sadaqa volontaire.",
                      })}
                    </p>
                  )}
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-muted-foreground flex items-start gap-1.5 pt-1">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
                  {tr({
                    en: "This is an estimate for guidance. Consult a scholar for complex assets.",
                    fr: "Il s'agit d'une estimation indicative. Consultez un érudit pour les actifs complexes.",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------
              RIGHT COLUMN — About Zakat panel
          ---------------------------------------------------------------- */}
          <div className="lg:col-span-1 space-y-5">
            {/* About card */}
            <div className="islamic-card p-6 space-y-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/50 text-primary">
                  <BookOpen className="w-4 h-4" />
                </span>
                <h2 className="text-base font-semibold text-foreground">
                  {tr({ en: "About Zakat", fr: "À propos de la Zakât" })}
                </h2>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {tr({
                  en: "Zakat is one of the Five Pillars of Islam. It is obligatory for every Muslim who meets the Nisab threshold to pay 2.5% of their qualifying wealth annually.",
                  fr: "La Zakât est l'un des cinq piliers de l'Islam. Il est obligatoire pour tout musulman atteignant le seuil du Nisab de verser 2,5 % de sa richesse qualifiante chaque année.",
                })}
              </p>

              {/* Gold & Silver sub-cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-secondary/40 p-3 text-center">
                  <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent/50 text-primary mb-2">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs font-semibold text-foreground mb-0.5">
                    {tr({ en: "Gold Nisab", fr: "Nisab Or" })}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {tr({
                      en: "87.48g of gold or its equivalent value",
                      fr: "87,48 g d'or ou sa valeur équivalente",
                    })}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-secondary/40 p-3 text-center">
                  <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent/50 text-primary mb-2">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs font-semibold text-foreground mb-0.5">
                    {tr({ en: "Silver Nisab", fr: "Nisab Argent" })}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {tr({
                      en: "612.36g of silver or its equivalent value",
                      fr: "612,36 g d'argent ou sa valeur équivalente",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Quranic verse block */}
            <div className="islamic-card p-6 space-y-4 text-center">
              {/* Arabic */}
              <p
                className="font-arabic text-xl leading-loose text-foreground"
                dir="rtl"
              >
                خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا
              </p>

              <div className="flex-1 h-px bg-border" />

              {/* Translation */}
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                {tr({
                  en: '"Take from their wealth a charity to purify them and cleanse them thereby."',
                  fr: '« Prélève de leurs biens une aumône par laquelle tu les purifies et les bénis. »',
                })}
              </p>

              {/* Citation */}
              <p className="text-xs text-muted-foreground font-medium tracking-wide">
                {tr({
                  en: "(Surah At-Tawbah 9:103)",
                  fr: "(Sourate At-Tawba 9:103)",
                })}
              </p>
            </div>

            {/* Quick-reference nisab note */}
            <div className="rounded-2xl border border-primary/20 bg-accent/30 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-primary flex-shrink-0" />
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                  {tr({ en: "Nisab Note", fr: "Note sur le Nisab" })}
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tr({
                  en: "The default Nisab shown is an approximate silver-based estimate for your selected currency. Nisab fluctuates daily with gold and silver prices — always verify with a trusted source before paying Zakat.",
                  fr: "Le Nisab par défaut affiché est une estimation approximative basée sur l'argent pour la devise choisie. Il fluctue quotidiennement avec les cours de l'or et de l'argent — vérifiez toujours auprès d'une source fiable avant de payer la Zakât.",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ZakatCalculator;
