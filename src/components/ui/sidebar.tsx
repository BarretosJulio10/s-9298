import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}>({
  collapsed: false,
  setCollapsed: () => null,
})

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = React.useContext(SidebarContext)

  return (
    <aside
      className={cn(
        "h-screen border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {children}
    </aside>
  )
}

export function SidebarContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-4 p-4", className)}>
      {children}
    </div>
  )
}

export function SidebarGroup({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {children}
    </div>
  )
}

export function SidebarGroupLabel({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = React.useContext(SidebarContext)

  if (collapsed) {
    return null
  }

  return (
    <div className={cn("text-sm font-semibold text-muted-foreground", className)}>
      {children}
    </div>
  )
}

export function SidebarGroupContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {children}
    </div>
  )
}

export function SidebarMenu({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {children}
    </div>
  )
}

export function SidebarMenuItem({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  )
}

export function SidebarMenuButton({
  className,
  children,
  asChild,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const Comp = asChild ? React.Fragment : "button"
  const { collapsed } = React.useContext(SidebarContext)

  return (
    <Comp
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            className: cn(
              "flex items-center gap-2",
              collapsed && "w-full justify-center",
              child.props.className
            ),
          })
        }
        return child
      })}
    </Comp>
  )
}