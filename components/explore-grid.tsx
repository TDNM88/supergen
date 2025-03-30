import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"

async function getExplorePosts() {
  try {
    const posts = await db.post.findMany({
      take: 12,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    return posts
  } catch (error) {
    console.error("Error fetching explore posts:", error)
    return []
  }
}

export async function ExploreGrid() {
  const posts = await getExplorePosts()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
      {posts.map((post) => (
        <Link key={post.id} href={`/p/${post.id}`} className="relative aspect-square group overflow-hidden bg-muted">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.caption}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path
                    d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                    fill="white"
                  ></path>
                </svg>
                <span>{post._count.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{post._count.comments}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

