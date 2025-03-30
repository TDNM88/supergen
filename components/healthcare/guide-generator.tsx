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
  guideType: z.string(),
  audience: z.string(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  sections: z.array(z.string()).min(1, { message: "Select at least one section" }),
  includeImages: z.boolean().default(true),
  includeReferences: z.boolean().default(true),
})

export function HealthcareGuideGenerator() {
  const [content, setContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      guideType: "condition",
      audience: "patients",
      description: "",
      sections: ["overview", "symptoms", "treatment", "prevention"],
      includeImages: true,
      includeReferences: true,
    },
  })

  const sectionTypes = [
    { id: "overview", label: "Overview" },
    { id: "symptoms", label: "Symptoms/Signs" },
    { id: "causes", label: "Causes/Risk Factors" },
    { id: "diagnosis", label: "Diagnosis" },
    { id: "treatment", label: "Treatment Options" },
    { id: "prevention", label: "Prevention" },
    { id: "living", label: "Living With/Management" },
    { id: "emergency", label: "Emergency Signs" },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    try {
      const prompt = `
        Create a healthcare guide with the following details:
        Title: ${values.title}
        Guide Type: ${values.guideType}
        Target Audience: ${values.audience}
        Description: ${values.description}
        Sections to Include: ${values.sections.join(", ")}
        
        ${values.includeImages ? "Include placeholders for relevant medical images and diagrams." : "Do not include images."}
        ${values.includeReferences ? "Include references or sources at the end." : "Do not include references."}
        
        Format the guide with appropriate headings, sections, and styling using Tailwind CSS.
        Make the content accurate, clear, and easy to understand for the target audience.
        Use numbered steps for procedures and clear warnings for important information.
      `

      const generatedContent = await generateContent(prompt, "healthcare", "health guide")
      setContent(generatedContent)

      toast({
        title: "Health guide generated",
        description: "Your health guide has been successfully generated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate health guide. Please try again.",
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
                    <Input placeholder="Understanding Diabetes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guideType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại hướng dẫn</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select guide type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="condition">Medical Condition</SelectItem>
                      <SelectItem value="procedure">Medical Procedure</SelectItem>
                      <SelectItem value="firstaid">First Aid</SelectItem>
                      <SelectItem value="wellness">Wellness/Prevention</SelectItem>
                      <SelectItem value="medication">Medication Information</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="patients">Patients</SelectItem>
                      <SelectItem value="caregivers">Caregivers</SelectItem>
                      <SelectItem value="general">General Public</SelectItem>
                      <SelectItem value="healthcare">Healthcare Professionals</SelectItem>
                      <SelectItem value="children">Children/Youth</SelectItem>
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
                    placeholder="Describe the health topic, specific aspects to cover, and any particular focus areas"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Provide details about what you want to include in the health guide</FormDescription>
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
                  <FormDescription>Chọn các phần cần bao gồm trong hướng dẫn sức khỏe</FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              name="includeReferences"
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

