import { Post } from "@/components/post"
import { Skeleton } from "@/components/ui/skeleton"
import { getPosts } from "@/lib/data"

export async function Feed() {
  const posts = await getPosts()

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export function FeedSkeleton() {
  return (
    <div className="max-w-xl mx-auto space-y-6 py-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-md border bg-card text-card-foreground shadow">
          <div className="p-4 flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
          <Skeleton className="h-[300px] w-full" />
          <div className="p-4 space-y-4">
            <div className="flex space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

