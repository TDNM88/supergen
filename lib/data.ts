import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getPosts() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return []
    }

    const posts = await db.post.findMany({
      where: {
        OR: [
          {
            user: {
              followers: {
                some: {
                  followerId: session.user.id,
                },
              },
            },
          },
          {
            userId: session.user.id,
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        comments: {
          take: 3,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        likes: {
          where: {
            userId: session.user.id,
          },
          take: 1,
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    })

    return posts.map((post) => ({
      id: post.id,
      user: post.user,
      image: post.image,
      caption: post.caption,
      likes: post._count.likes,
      hasLiked: post.likes.length > 0,
      comments: post.comments,
      createdAt: post.createdAt,
    }))
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

