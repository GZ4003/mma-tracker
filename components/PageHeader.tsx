interface PageHeaderProps {
  title: string;
  subtitle?: string;
  accent?: boolean;
}

export default function PageHeader({ title, subtitle, accent = true }: PageHeaderProps) {
  return (
    <div className="space-y-3 mb-8">
      <div className="space-y-2">
        <h1 className="font-display text-5xl font-black text-blue-400 tracking-widest" style={{ textShadow: '0 0 8px rgba(59, 130, 246, 0.2)' }}>
          {title}
        </h1>
        {accent && (
          <div className="flex gap-2">
            <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" />
            <div className="h-1 w-10 bg-blue-600/40 rounded-full" />
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-blue-300 font-medium tracking-wide">{subtitle}</p>
      )}
    </div>
  );
}
