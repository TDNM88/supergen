"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Search, PlusSquare, Heart, User, LogIn, UserPlus } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const routes = session
    ? [
        { href: "/", label: "Trang chủ", icon: Home },
        { href: "/explore", label: "Khám phá", icon: Search },
        { href: "/create", label: "Tạo mới", icon: PlusSquare },
        { href: "/notifications", label: "Thông báo", icon: Heart },
        { href: `/profile/${session?.user?.username}`, label: "Hồ sơ", icon: User },
      ]
    : [
        { href: "/explore", label: "Khám phá", icon: Search },
        { href: "/features", label: "Tính năng", icon: PlusSquare },
        { href: "/auth/login", label: "Đăng nhập", icon: LogIn },
        { href: "/auth/signup", label: "Đăng ký", icon: UserPlus },
      ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" onClick={() => setOpen(false)}>
              <h1 className="text-xl font-bold">Instamade</h1>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 text-lg font-medium p-2 rounded-md hover:bg-accent ${
                  pathname === route.href ? "bg-accent" : ""
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{route.label}</span>
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

