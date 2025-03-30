"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function likePost(postId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const existingLike = await db.like.findFirst({
      where: {
        postId,
        userId: session.user.id,
      },
    })

    if (existingLike) {
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      })
    } else {
      await db.like.create({
        data: {
          postId,
          userId: session.user.id,
        },
      })
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error liking post:", error)
    return { success: false, error: "Failed to like post" }
  }
}

export async function addComment(postId: string, content: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const comment = await db.comment.create({
      data: {
        content,
        postId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    })

    revalidatePath("/")
    return comment
  } catch (error) {
    console.error("Error adding comment:", error)
    throw new Error("Failed to add comment")
  }
}

export async function createPost(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const caption = formData.get("caption") as string
    const imageFile = formData.get("image") as File

    if (!imageFile || !caption) {
      throw new Error("Image and caption are required")
    }

    // In a real app, you would upload the image to a storage service like Vercel Blob
    // For this example, we'll use a placeholder URL
    const imageUrl = `/placeholder.svg?height=600&width=600`

    const post = await db.post.create({
      data: {
        caption,
        image: imageUrl,
        userId: session.user.id,
      },
    })

    revalidatePath("/")
    return { success: true, postId: post.id }
  } catch (error) {
    console.error("Error creating post:", error)
    return { success: false, error: "Failed to create post" }
  }
}

