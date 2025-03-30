"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function Header() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="hidden font-bold sm:inline-block text-xl">Instamade</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLoading ? (
            <Button variant="ghost" size="icon" disabled>
              <Loader2 className="h-5 w-5 animate-spin" />
            </Button>
          ) : session ? (
            <UserNav user={session.user} />
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Đăng nhập</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/signup">Đăng ký</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

