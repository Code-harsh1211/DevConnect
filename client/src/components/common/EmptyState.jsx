export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      {icon && (
        <div className="text-5xl text-slate-300 dark:text-slate-600 mb-4">{icon}</div>
      )}
      <h3 className="font-display font-bold text-lg text-slate-700 dark:text-slate-300 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-500 max-w-xs leading-relaxed mb-5">
          {description}
        </p>
      )}
      {action && action}
    </div>
  );
}
