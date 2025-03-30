import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Chào mừng trở lại</h1>
          <p className="text-sm text-muted-foreground">Nhập thông tin đăng nhập của bạn</p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/auth/signup" className="underline underline-offset-4 hover:text-primary">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  )
}

