"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { createPost } from "@/lib/actions"
import { ImagePlus, Loader2, X } from "lucide-react"

const formSchema = z.object({
  caption: z.string().min(1, { message: "Caption is required" }).max(2200),
})

export function CreatePostForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!previewImage) {
      form.setError("caption", { message: "Please select an image" })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("caption", values.caption)

      // In a real app, you would append the actual file
      // For this example, we'll use a placeholder
      const blob = await fetch(previewImage).then((r) => r.blob())
      const file = new File([blob], "image.jpg", { type: "image/jpeg" })
      formData.append("image", file)

      const result = await createPost(formData)

      if (result.success) {
        router.push("/")
        router.refresh()
      } else {
        throw new Error(result.error || "Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <FormLabel>Photo</FormLabel>
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 bg-muted/50">
            {previewImage ? (
              <div className="relative w-full max-w-md">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Image
                  src={previewImage || "/placeholder.svg"}
                  alt="Preview"
                  width={400}
                  height={400}
                  className="rounded-md object-cover max-h-[400px] w-auto mx-auto"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
                <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  Select Image
                </Button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>
        </div>
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Textarea placeholder="Write a caption..." className="resize-none min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Share Post"
          )}
        </Button>
      </form>
    </Form>
  )
}

