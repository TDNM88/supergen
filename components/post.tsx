"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { likePost, addComment } from "@/lib/actions"

interface PostProps {
  post: {
    id: string
    user: {
      id: string
      name: string
      username: string
      image?: string
    }
    image: string
    caption: string
    likes: number
    hasLiked: boolean
    comments: {
      id: string
      user: {
        username: string
      }
      content: string
    }[]
    createdAt: Date
  }
}

export function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.hasLiked)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState(post.comments)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLike = async () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
    await likePost(post.id)
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const newComment = await addComment(post.id, comment)
      setComments([...comments, newComment])
      setComment("")
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow">
      <div className="p-4 flex items-center justify-between">
        <Link href={`/profile/${post.user.username}`} className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.user.image || ""} alt={post.user.name} />
            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.user.username}</p>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative aspect-square">
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.caption}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleLike} className="h-9 w-9">
              <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              <span className="sr-only">Like</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">Comment</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Send className="h-6 w-6" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bookmark className="h-6 w-6" />
            <span className="sr-only">Save</span>
          </Button>
        </div>
        {likesCount > 0 && <p className="text-sm font-medium">{likesCount} likes</p>}
        <div className="space-y-1">
          <div className="text-sm">
            <Link href={`/profile/${post.user.username}`} className="font-medium">
              {post.user.username}
            </Link>{" "}
            {post.caption}
          </div>
          {comments.length > 0 && (
            <div className="space-y-1 mt-2">
              {comments.map((comment) => (
                <div key={comment.id} className="text-sm">
                  <Link href={`/profile/${comment.user.username}`} className="font-medium">
                    {comment.user.username}
                  </Link>{" "}
                  {comment.content}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">{formatDistanceToNow(post.createdAt, { addSuffix: true })}</p>
        </div>
        <form onSubmit={handleComment} className="flex items-center space-x-2">
          <Textarea
            placeholder="Thêm bình luận..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-0 h-9 resize-none"
          />
          <Button type="submit" size="sm" disabled={!comment.trim() || isSubmitting}>
            Đăng
          </Button>
        </form>
      </div>
    </div>
  )
}

