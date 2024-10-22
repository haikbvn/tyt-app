export interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-base text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
