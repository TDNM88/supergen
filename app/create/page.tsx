import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CreatePostForm } from "@/components/create-post-form"

export default async function CreatePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="container max-w-xl py-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Tạo bài viết</h1>
          <p className="text-muted-foreground">Chia sẻ ảnh với người theo dõi của bạn</p>
        </div>
        <CreatePostForm />
      </div>
    </div>
  )
}

