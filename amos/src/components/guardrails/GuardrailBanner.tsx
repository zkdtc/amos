import { useLang } from '../../data/LangContext';

interface Props {
  variant?: 'gold' | 'red' | 'cyan' | 'green';
  title?: string;
  items?: string[];
  children?: React.ReactNode;
}

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  gold: 'banner',
  red: 'banner banner--red',
  cyan: 'banner banner--cyan',
  green: 'banner banner--green'
};

export default function GuardrailBanner({
  variant = 'gold',
  title,
  items,
  children
}: Props) {
  const { t } = useLang();
  const displayTitle = title ?? t.guardrailsDefault;
  return (
    <div className={variantClass[variant]} data-testid="guardrail-banner">
      <strong>⚠ {displayTitle}</strong>
      {items && (
        <ul className="bullets" style={{ marginTop: 6 }}>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
}
