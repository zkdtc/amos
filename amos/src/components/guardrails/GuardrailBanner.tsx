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
  title = 'Guardrails',
  items,
  children
}: Props) {
  return (
    <div className={variantClass[variant]} data-testid="guardrail-banner">
      <strong>⚠ {title}</strong>
      {items && (
        <ul className="bullets" style={{ marginTop: 6 }}>
          {items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
}
