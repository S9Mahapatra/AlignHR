"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  Calendar,
  Wallet,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, getInitials } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "My Profile",
        href: "/profile",
        icon: User,
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        label: "Employees",
        href: "/employees",
        icon: Users,
        roles: ["ADMIN", "HR"],
      },
      {
        label: "Departments",
        href: "/departments",
        icon: Building2,
        roles: ["ADMIN", "HR"],
      },
    ],
  },
  {
    title: "TRACKING",
    items: [
      {
        label: "Attendance",
        href: "/attendance",
        icon: Clock,
      },
      {
        label: "Leaves",
        href: "/leave",
        icon: Calendar,
      },
    ],
  },
  {
    title: "FINANCE",
    items: [
      {
        label: "Payroll",
        href: "/payroll",
        icon: Wallet,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || "EMPLOYEE";
  const userName = session?.user?.name || "User";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const filteredSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.roles || item.roles.includes(role)
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="flex flex-col h-full w-[280px] bg-slate-900/95 backdrop-blur-xl border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          AlignHR
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {filteredSections.map((section) => (
          <div key={section.title}>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                      active
                        ? "bg-indigo-500/20 text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-indigo-400 to-violet-400 rounded-r-full" />
                    )}
                    <Icon
                      className={cn(
                        "w-[18px] h-[18px] flex-shrink-0",
                        active
                          ? "text-indigo-400"
                          : "text-slate-500 group-hover:text-slate-300"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-medium">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {userName}
            </p>
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 bg-indigo-500/20 text-indigo-300 border-0"
            >
              {role}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
