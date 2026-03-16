"use client";

import { Bell, ChevronLeft, ChevronRight, PanelLeftClose, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { primaryNavigation, supportNavigation, type NavigationItem } from "@/lib/mock-data";
import { useUiStore } from "@/stores/ui-store";

type NavigationShellProps = Readonly<{
  children: React.ReactNode;
}>;

function NavigationList({
  items,
  collapsed,
}: {
  items: NavigationItem[];
  collapsed: boolean;
}): React.JSX.Element {
  const activeNavigation = useUiStore((state) => state.activeNavigation);
  const setActiveNavigation = useUiStore((state) => state.setActiveNavigation);

  return (
    <nav className="space-y-1.5">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeNavigation === item.id;

        return (
          <button
            key={item.id}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200",
              isActive
                ? "bg-white text-brand-navy shadow-[0_18px_36px_-24px_rgba(15,52,112,0.45)]"
                : "text-white/72 hover:bg-white/10 hover:text-white",
              collapsed && "justify-center px-0",
            )}
            onClick={() => setActiveNavigation(item.id)}
            type="button"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.label}</p>
                <p className={cn("truncate text-xs", isActive ? "text-brand-blue" : "text-white/50")}>
                  {item.caption}
                </p>
              </div>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

export function NavigationShell({ children }: NavigationShellProps): React.JSX.Element {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const activeCollection = useUiStore((state) => state.activeCollection);
  const setActiveCollection = useUiStore((state) => state.setActiveCollection);

  return (
    <div
      className="murigne-app-shell"
      style={{
        gridTemplateColumns: sidebarCollapsed ? "5.5rem minmax(0,1fr)" : undefined,
      }}
    >
      <aside className={cn("murigne-sidebar", sidebarCollapsed && "px-3")}>
        <div className="flex items-center justify-between gap-3">
          {!sidebarCollapsed ? (
            <div>
              <p className="murigne-eyebrow text-brand-gold">Murigne</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Analytics OS</h2>
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-white/10">
              <Sparkles className="h-5 w-5" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-white hover:bg-white/10 hover:text-white lg:inline-flex"
            onClick={toggleSidebar}
            type="button"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {!sidebarCollapsed ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">Coverage</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["banks", "fixed-income", "macro"] as const).map((collection) => (
                <button
                  key={collection}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition",
                    activeCollection === collection
                      ? "bg-brand-gold text-brand-navy"
                      : "bg-white/10 text-white/75 hover:bg-white/18",
                  )}
                  onClick={() => setActiveCollection(collection)}
                  type="button"
                >
                  {collection.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex-1 space-y-6 overflow-y-auto pb-6">
          <div>
            {!sidebarCollapsed ? (
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/45">Primary</p>
            ) : null}
            <NavigationList collapsed={sidebarCollapsed} items={primaryNavigation} />
          </div>
          <div>
            {!sidebarCollapsed ? (
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/45">Support</p>
            ) : null}
            <NavigationList collapsed={sidebarCollapsed} items={supportNavigation} />
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="murigne-topbar lg:hidden">
          <div>
            <p className="murigne-eyebrow">Murigne</p>
            <h2 className="mt-2 text-lg font-semibold text-brand-navy">Analytics OS</h2>
          </div>
          <Button onClick={toggleSidebar} size="icon" variant="outline" type="button">
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </header>

        <header className="murigne-topbar hidden lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-full border border-border/70 bg-white px-4 py-2 shadow-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Search banks, ratios, or filings</span>
            </div>
            <Badge tone="info" variant="soft">
              Phase 0
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone="success" variant="outline">
              Mock data mode
            </Badge>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-white shadow-sm">
              <Bell className="h-4 w-4 text-brand-blue" />
            </div>
          </div>
        </header>

        <motion.main
          animate={{ opacity: 1, y: 0 }}
          className="murigne-shell"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
