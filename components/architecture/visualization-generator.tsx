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
import { Loader2, Download, Copy, ImageIcon, Upload } from "lucide-react"
import { ContentPreview } from "@/components/content-preview"
import { generateContent } from "@/lib/ai"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  projectName: z.string().min(2, { message: "Project name is required" }),
  buildingType: z.string(),
  visualizationType: z.string(),
  style: z.string(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  includeText: z.boolean().default(true),
  includeMultipleViews: z.boolean().default(false),
})

export function ArchitectureVisualizationGenerator() {
  const [content, setContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      buildingType: "residential",
      visualizationType: "exterior",
      style: "modern",
      description: "",
      includeText: true,
      includeMultipleViews: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    try {
      const prompt = `
        Create an architectural visualization presentation with the following details:
        Project Name: ${values.projectName}
        Building Type: ${values.buildingType}
        Visualization Type: ${values.visualizationType}
        Architectural Style: ${values.style}
        Description: ${values.description}
        
        ${values.includeText ? "Include descriptive text and annotations." : "Minimize text, focus on visual representation."}
        ${values.includeMultipleViews ? "Include multiple views/perspectives of the design." : "Focus on a single main view."}
        
        Create an HTML representation of an architectural visualization using div elements with Tailwind CSS for styling.
        Include placeholders for architectural renderings and diagrams.
        Create a professional presentation layout with appropriate sections.
      `

      const generatedContent = await generateContent(prompt, "architecture", "visualization")
      setContent(generatedContent)

      toast({
        title: "Visualization generated",
        description: "Your architectural visualization has been successfully generated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate visualization. Please try again.",
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
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên dự án</FormLabel>
                  <FormControl>
                    <Input placeholder="Modern Residence" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buildingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại công trình</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select building type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="mixed-use">Mixed-Use</SelectItem>
                      <SelectItem value="institutional">Institutional</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visualizationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại hình ảnh</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visualization type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="exterior">Exterior Rendering</SelectItem>
                      <SelectItem value="interior">Interior Rendering</SelectItem>
                      <SelectItem value="aerial">Aerial View</SelectItem>
                      <SelectItem value="section">Section View</SelectItem>
                      <SelectItem value="concept">Concept Presentation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phong cách kiến trúc</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select architectural style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="contemporary">Contemporary</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="sustainable">Sustainable/Green</SelectItem>
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
                <FormLabel>Mô tả dự án</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the architectural project, key features, and visualization requirements"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include details about materials, surroundings, and specific visualization needs
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="includeText"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bao gồm văn bản & chú thích</FormLabel>
                    <FormDescription>Thêm văn bản mô tả và chú thích vào hình ảnh</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeMultipleViews"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bao gồm nhiều góc nhìn</FormLabel>
                    <FormDescription>Hiển thị nhiều góc nhìn hoặc quan điểm của thiết kế</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Button variant="outline" type="button" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload Reference Images (Optional)
            </Button>
            <FormDescription>Upload sketches, inspiration images, or site photos for better results</FormDescription>
          </div>

          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo hình ảnh 3D"
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
                Export as PDF
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

