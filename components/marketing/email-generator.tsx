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
  subject: z.string().min(3, { message: "Subject line is required" }),
  campaignType: z.string(),
  productName: z.string().min(2, { message: "Product name is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  audience: z.string().min(3, { message: "Target audience is required" }),
  includeImages: z.boolean().default(true),
  includeButton: z.boolean().default(true),
})

export function MarketingEmailGenerator() {
  const [content, setContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      campaignType: "promotional",
      productName: "",
      description: "",
      audience: "",
      includeImages: true,
      includeButton: true,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    try {
      const prompt = `
        Create an email marketing template with the following details:
        Subject Line: ${values.subject}
        Campaign Type: ${values.campaignType}
        Product/Service Name: ${values.productName}
        Description: ${values.description}
        Target Audience: ${values.audience}
        
        ${values.includeImages ? "Include placeholders for product images." : "Do not include images."}
        ${values.includeButton ? "Include a call-to-action button." : "Do not include a CTA button."}
        
        Format the email with appropriate headings, sections, and styling using inline CSS and HTML.
        Make the content compelling, persuasive, and focused on the campaign goal.
        Ensure the design is responsive and works well in email clients.
      `

      const generatedContent = await generateContent(prompt, "marketing", "email template")
      setContent(generatedContent)

      toast({
        title: "Email template generated",
        description: "Your email template has been successfully generated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate email template. Please try again.",
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
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dòng tiêu đề email</FormLabel>
                  <FormControl>
                    <Input placeholder="Introducing Our New Product..." {...field} />
                  </FormControl>
                  <FormDescription>Create a compelling subject line that drives opens</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="campaignType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại chiến dịch</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="promotional">Promotional</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="abandoned">Abandoned Cart</SelectItem>
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
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đối tượng mục tiêu</FormLabel>
                  <FormControl>
                    <Input placeholder="Small business owners, parents, etc." {...field} />
                  </FormControl>
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
                <FormLabel>Mô tả nội dung email</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what you want to promote, announce, or share in this email"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Include key points, offers, or information to include</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="includeImages"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bao gồm hình ảnh</FormLabel>
                    <FormDescription>Thêm hình ảnh sản phẩm vào email</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeButton"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bao gồm nút CTA</FormLabel>
                    <FormDescription>Thêm nút kêu gọi hành động</FormDescription>
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
              "Tạo mẫu email"
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

