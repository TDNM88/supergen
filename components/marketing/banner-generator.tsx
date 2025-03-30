"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download, Copy, ImageIcon } from "lucide-react"
import { ContentPreview } from "@/components/content-preview"
import { generateContent } from "@/lib/ai"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  headline: z.string().min(2, { message: "Headline is required" }),
  bannerSize: z.string(),
  productName: z.string().min(2, { message: "Product name is required" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  colorScheme: z.string(),
  includeImage: z.boolean().default(true),
  animated: z.boolean().default(false),
})

export function MarketingBannerGenerator() {
  const [content, setContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      headline: "",
      bannerSize: "leaderboard",
      productName: "",
      description: "",
      colorScheme: "blue",
      includeImage: true,
      animated: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    try {
      const prompt = `
        Create an HTML ad banner with the following details:
        Headline: ${values.headline}
        Banner Size: ${values.bannerSize}
        Product/Service Name: ${values.productName}
        Description: ${values.description}
        Color Scheme: ${values.colorScheme}
        
        ${values.includeImage ? "Include a placeholder for a product image." : "Do not include images."}
        ${values.animated ? "Add simple CSS animations for elements." : "No animations needed."}
        
        Format the banner with appropriate styling using HTML and CSS.
        Make the content compelling and focused on driving clicks.
        Ensure the design fits the specified banner size.
      `

      const generatedContent = await generateContent(prompt, "marketing", "ad banner")
      setContent(generatedContent)

      toast({
        title: "Ad banner generated",
        description: "Your ad banner has been successfully generated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate ad banner. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề banner</FormLabel>
                  <FormControl>
                    <Input placeholder="Limited Time Offer!" {...field} />
                  </FormControl>
                  <FormDescription>Create a compelling headline for your banner</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bannerSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kích thước banner</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select banner size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="leaderboard">Leaderboard (728×90)</SelectItem>
                      <SelectItem value="medium">Medium Rectangle (300×250)</SelectItem>
                      <SelectItem value="large">Large Rectangle (336×280)</SelectItem>
                      <SelectItem value="skyscraper">Skyscraper (160×600)</SelectItem>
                      <SelectItem value="mobile">Mobile Banner (320×50)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sản phẩm/dịch vụ</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="colorScheme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bảng màu</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color scheme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="blue">Blue (Trust, Stability)</SelectItem>
                      <SelectItem value="green">Green (Growth, Health)</SelectItem>
                      <SelectItem value="purple">Purple (Creativity, Luxury)</SelectItem>
                      <SelectItem value="red">Red (Energy, Urgency)</SelectItem>
                      <SelectItem value="orange">Orange (Enthusiasm, Friendliness)</SelectItem>
                      <SelectItem value="black">Black & White (Elegant, Simple)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả banner</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description or call to action for your banner"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Keep it short and compelling</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="includeImage"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bao gồm hình ảnh</FormLabel>
                    <FormDescription>Thêm hình ảnh sản phẩm vào banner</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="animated"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Phần tử hoạt hình</FormLabel>
                    <FormDescription>Thêm hiệu ứng hoạt hình đơn giản cho các phần tử</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo banner quảng cáo"
            )}
          </Button>
        </form>
      </Form>

      {content && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Preview</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(content)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy HTML
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export HTML
              </Button>
              <Button variant="outline" size="sm">
                <ImageIcon className="mr-2 h-4 w-4" />
                Add Images
              </Button>
            </div>
          </div>
          <ContentPreview content={content} />
        </div>
      )}
    </div>
  )
}

