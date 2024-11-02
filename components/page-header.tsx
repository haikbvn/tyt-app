import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  text?: string
}

export function PageHeader({
  heading,
  text,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {heading}
      </h1>
      {text && <p className="text-base text-muted-foreground">{text}</p>}
    </div>
  )
}
