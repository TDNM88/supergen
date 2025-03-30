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
import { Loader2, Download, Copy } from "lucide-react"
import { ContentPreview } from "@/components/content-preview"
import { generateContent } from "@/lib/ai"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  subject: z.string().min(2, { message: "Subject is required" }),
  gradeLevel: z.string(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  questionCount: z.string(),
  questionTypes: z.array(z.string()).min(1, { message: "Select at least one question type" }),
  includeAnswers: z.boolean().default(true),
})

export function EducationQuizGenerator() {
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
      questionCount: "10",
      questionTypes: ["multiple-choice"],
      includeAnswers: true,
    },
  })

  const questionTypes = [
    { id: "multiple-choice", label: "Multiple Choice" },
    { id: "true-false", label: "True/False" },
    { id: "short-answer", label: "Short Answer" },
    { id: "matching", label: "Matching" },
    { id: "fill-blank", label: "Fill in the Blank" },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    try {
      const prompt = `
        Create an educational quiz with the following details:
        Title: ${values.title}
        Subject: ${values.subject}
        Grade Level: ${values.gradeLevel}
        Description: ${values.description}
        Number of Questions: ${values.questionCount}
        Question Types: ${values.questionTypes.join(", ")}
        
        ${values.includeAnswers ? "Include an answer key at the end." : "Do not include answers."}
        
        Format the quiz with appropriate headings, sections, and styling using Tailwind CSS.
        Make the quiz interactive with appropriate input elements for each question type.
      `

      const generatedContent = await generateContent(prompt, "education", "quiz")
      setContent(generatedContent)

      toast({
        title: "Quiz generated",
        description: "Your quiz has been successfully generated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
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
                  <FormLabel>Tiêu đề câu hỏi</FormLabel>
                  <FormControl>
                    <Input placeholder="World Geography Quiz" {...field} />
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
                  <FormLabel>Môn học</FormLabel>
                  <FormControl>
                    <Input placeholder="Geography" {...field} />
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
                  <FormLabel>Trình độ</FormLabel>
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

            <FormField
              control={form.control}
              name="questionCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng câu hỏi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of questions" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="5">5 questions</SelectItem>
                      <SelectItem value="10">10 questions</SelectItem>
                      <SelectItem value="15">15 questions</SelectItem>
                      <SelectItem value="20">20 questions</SelectItem>
                      <SelectItem value="25">25 questions</SelectItem>
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
                <FormLabel>Mô tả câu hỏi</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the quiz content, topics to cover, and any specific requirements"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Provide details about what you want to include in the quiz</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="questionTypes"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Loại câu hỏi</FormLabel>
                  <FormDescription>Chọn các loại câu hỏi cần bao gồm trong bài kiểm tra</FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {questionTypes.map((type) => (
                    <FormField
                      key={type.id}
                      control={form.control}
                      name="questionTypes"
                      render={({ field }) => {
                        return (
                          <FormItem key={type.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(type.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, type.id])
                                    : field.onChange(field.value?.filter((value) => value !== type.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{type.label}</FormLabel>
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

          <FormField
            control={form.control}
            name="includeAnswers"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Bao gồm đáp án</FormLabel>
                  <FormDescription>Thêm đáp án ở cuối bài kiểm tra</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo câu hỏi"
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
            </div>
          </div>
          <ContentPreview content={content} />
        </div>
      )}
    </div>
  )
}

