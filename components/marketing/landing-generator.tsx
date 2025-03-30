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
  productName: z.string().min(2, { message: "Product name is required" }),
  industry: z.string().min(2, { message: "Industry is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  style: z.string(),
  colorScheme: z.string(),
  sections: z.array(z.string()).min(1, { message: "Select at least one section" }),
  includeImages: z.boolean().default(true),
  includeForms: z.boolean().default(true),
})

export function MarketingLandingGenerator() {
  const [content, setContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      industry: "",
      description: "",
      style: "modern",
      colorScheme: "blue",
      sections: ["hero", "features", "testimonials", "cta"],
      includeImages: true,
      includeForms: true,
    },
  })

  const sectionTypes = [
    { id: "hero", label: "Hero Section" },
    { id: "features", label: "Features/Benefits" },
    { id: "testimonials", label: "Testimonials" },
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
    { id: "cta", label: "Call to Action" },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    try {
      const prompt = `
        Create a marketing landing page with the following details:
        Product/Service Name: ${values.productName}
        Industry: ${values.industry}
        Description: ${values.description}
        Style: ${values.style}
        Color Scheme: ${values.colorScheme}
        Sections to Include: ${values.sections.join(", ")}
        
        ${values.includeImages ? "Include placeholders for relevant product images and icons." : "Do not include images."}
        ${values.includeForms ? "Include a lead capture form with appropriate fields." : "Do not include forms."}
        
        Format the landing page with appropriate headings, sections, and styling using Tailwind CSS.
        Make the content compelling, persuasive, and focused on conversion.
        Ensure the design is responsive and mobile-friendly.
      `

      const generatedContent = await generateContent(prompt, "marketing", "landing page")
      setContent(generatedContent)

      toast({
        title: "Landing page generated",
        description: "Your landing page has been successfully generated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate landing page. Please try again.",
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
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sản phẩm/dịch vụ</FormLabel>
                  <FormControl>
                    <Input placeholder="SaaS Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngành công nghiệp</FormLabel>
                  <FormControl>
                    <Input placeholder="Technology, Healthcare, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phong cách thiết kế</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select design style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="modern">Modern/Minimal</SelectItem>
                      <SelectItem value="bold">Bold/Vibrant</SelectItem>
                      <SelectItem value="corporate">Corporate/Professional</SelectItem>
                      <SelectItem value="playful">Playful/Creative</SelectItem>
                      <SelectItem value="luxury">Luxury/Premium</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="neutral">Neutral (Timeless, Sophisticated)</SelectItem>
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
                <FormLabel>Mô tả sản phẩm/dịch vụ</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your product or service, its key benefits, target audience, and unique selling points"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Provide details about what makes your offering special</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sections"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Các phần cần bao gồm</FormLabel>
                  <FormDescription>Chọn các phần cần bao gồm trong trang đích</FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {sectionTypes.map((section) => (
                    <FormField
                      key={section.id}
                      control={form.control}
                      name="sections"
                      render={({ field }) => {
                        return (
                          <FormItem key={section.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(section.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, section.id])
                                    : field.onChange(field.value?.filter((value) => value !== section.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{section.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
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
                    <FormDescription>Thêm hình ảnh sản phẩm và biểu tượng liên quan</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeForms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bao gồm biểu mẫu</FormLabel>
                    <FormDescription>Thêm biểu mẫu thu thập thông tin khách hàng tiềm năng</FormDescription>
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
              "Tạo trang đích"
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

