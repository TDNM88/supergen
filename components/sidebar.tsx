"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  Megaphone,
  HomeIcon,
  Activity,
  ShoppingBag,
  Settings,
  LayoutDashboard,
  FolderOpen,
  PlusCircle,
} from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      label: "Bảng điều khiển",
      icon: LayoutDashboard,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Dự án",
      icon: FolderOpen,
      href: "/projects",
      active: pathname === "/projects",
    },
    {
      label: "Dự án mới",
      icon: PlusCircle,
      href: "/new-project",
      active: pathname === "/new-project",
    },
    { type: "divider" },
    {
      label: "Giáo dục",
      icon: BookOpen,
      href: "/education",
      active: pathname.startsWith("/education"),
      color: "text-blue-500",
    },
    {
      label: "Marketing",
      icon: Megaphone,
      href: "/marketing",
      active: pathname.startsWith("/marketing"),
      color: "text-purple-500",
    },
    {
      label: "Kiến trúc",
      icon: HomeIcon,
      href: "/architecture",
      active: pathname.startsWith("/architecture"),
      color: "text-green-500",
    },
    {
      label: "Y tế",
      icon: Activity,
      href: "/healthcare",
      active: pathname.startsWith("/healthcare"),
      color: "text-red-500",
    },
    {
      label: "Thương mại điện tử",
      icon: ShoppingBag,
      href: "/ecommerce",
      active: pathname.startsWith("/ecommerce"),
      color: "text-amber-500",
    },
    { type: "divider" },
    {
      label: "Cài đặt",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  return (
    <div className="hidden md:block w-64 border-r bg-background h-[calc(100vh-4rem)]">
      <ScrollArea className="h-full py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {routes.map((route, i) =>
              route.type === "divider" ? (
                <div key={i} className="h-px bg-border my-4" />
              ) : (
                <Button
                  key={route.href}
                  variant={route.active ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", route.color)}
                  asChild
                >
                  <Link href={route.href}>
                    <route.icon className="mr-2 h-5 w-5" />
                    {route.label}
                  </Link>
                </Button>
              ),
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

