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
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  subject: z.string().min(2, { message: "Subject is required" }),
  gradeLevel: z.string(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  sections: z.array(z.string()).min(1, { message: "Select at least one section" }),
  includeImages: z.boolean().default(true),
  includePractice: z.boolean().default(true),
})

export function EducationGuideGenerator() {
  const [content, setContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subject: "",
      gradeLevel: "middle",
      description: "",
      sections: ["key-concepts", "examples", "summary"],
      includeImages: true,
      includePractice: true,
    },
  })

  const sectionTypes = [
    { id: "key-concepts", label: "Key Concepts" },
    { id: "examples", label: "Examples" },
    { id: "diagrams", label: "Diagrams" },
    { id: "formulas", label: "Formulas" },
    { id: "summary", label: "Summary" },
    { id: "glossary", label: "Glossary" },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    try {
      const prompt = `
        Create an educational study guide with the following details:
        Title: ${values.title}
        Subject: ${values.subject}
        Grade Level: ${values.gradeLevel}
        Description: ${values.description}
        Sections to Include: ${values.sections.join(", ")}
        
        ${values.includeImages ? "Include placeholders for relevant educational images." : "Do not include images."}
        ${values.includePractice ? "Include practice questions or exercises at the end." : "Do not include practice questions."}
        
        Format the study guide with appropriate headings, sections, and styling using Tailwind CSS.
        Make the content comprehensive, clear, and educational.
      `

      const generatedContent = await generateContent(prompt, "education", "study guide")
      setContent(generatedContent)

      toast({
        title: "Study guide generated",
        description: "Your study guide has been successfully generated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate study guide. Please try again.",
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề hướng dẫn</FormLabel>
                  <FormControl>
                    <Input placeholder="Cell Biology Study Guide" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại hướng dẫn</FormLabel>
                  <FormControl>
                    <Input placeholder="Biology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gradeLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đối tượng mục tiêu</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="elementary">Elementary School</SelectItem>
                      <SelectItem value="middle">Middle School</SelectItem>
                      <SelectItem value="high">High School</SelectItem>
                      <SelectItem value="college">College/University</SelectItem>
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
                <FormLabel>Mô tả hướng dẫn</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the study guide content, topics to cover, and any specific requirements"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Provide details about what you want to include in the study guide</FormDescription>
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
                  <FormDescription>Select the sections to include in the study guide</FormDescription>
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
                    <FormDescription>Thêm hình ảnh và biểu đồ y tế liên quan</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includePractice"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bao gồm tài liệu tham khảo</FormLabel>
                    <FormDescription>Thêm tài liệu tham khảo hoặc nguồn ở cuối</FormDescription>
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
              "Tạo hướng dẫn sức khỏe"
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
                Export PDF
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

