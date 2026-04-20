const COLORS = [
  'from-violet-400 to-purple-600',
  'from-blue-400 to-brand-600',
  'from-emerald-400 to-teal-600',
  'from-orange-400 to-red-500',
  'from-pink-400 to-rose-600',
  'from-amber-400 to-orange-500',
];

function getColor(name = '') {
  let sum = 0;
  for (let c of name) sum += c.charCodeAt(0);
  return COLORS[sum % COLORS.length];
}

export default function Avatar({ src, name = '', size = 40, className = '' }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const style = { width: size, height: size, minWidth: size, fontSize: size * 0.38 };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`avatar ${className}`}
        style={style}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    );
  }

  return (
    <div
      className={`avatar bg-gradient-to-br ${getColor(name)} flex items-center justify-center text-white font-bold select-none ${className}`}
      style={style}
    >
      {initials || '?'}
    </div>
  );
}
