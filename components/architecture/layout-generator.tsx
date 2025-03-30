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
  projectName: z.string().min(2, { message: "Project name is required" }),
  buildingType: z.string(),
  squareFootage: z.string().min(1, { message: "Square footage is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  rooms: z.array(z.string()).min(1, { message: "Select at least one room" }),
  includeLabels: z.boolean().default(true),
  includeDimensions: z.boolean().default(true),
})

export function ArchitectureLayoutGenerator() {
  const [content, setContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      buildingType: "residential",
      squareFootage: "",
      description: "",
      rooms: ["living", "kitchen", "bedroom", "bathroom"],
      includeLabels: true,
      includeDimensions: true,
    },
  })

  const roomTypes = [
    { id: "living", label: "Living Room" },
    { id: "kitchen", label: "Kitchen" },
    { id: "bedroom", label: "Bedroom" },
    { id: "bathroom", label: "Bathroom" },
    { id: "dining", label: "Dining Room" },
    { id: "office", label: "Home Office" },
    { id: "laundry", label: "Laundry Room" },
    { id: "garage", label: "Garage" },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    try {
      const prompt = `
        Create a floor plan layout with the following details:
        Project Name: ${values.projectName}
        Building Type: ${values.buildingType}
        Square Footage: ${values.squareFootage}
        Description: ${values.description}
        Rooms to Include: ${values.rooms.join(", ")}
        
        ${values.includeLabels ? "Include labels for each room and area." : "Do not include labels."}
        ${values.includeDimensions ? "Include dimensions for rooms and overall layout." : "Do not include dimensions."}
        
        Create an HTML representation of a floor plan using div elements with Tailwind CSS for positioning and styling.
        Use different colors to represent different rooms and areas.
        Make the layout proportional and realistic based on typical room sizes.
      `

      const generatedContent = await generateContent(prompt, "architecture", "floor plan")
      setContent(generatedContent)

      toast({
        title: "Floor plan generated",
        description: "Your floor plan has been successfully generated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate floor plan. Please try again.",
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
                    <Input placeholder="Modern Family Home" {...field} />
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
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="office">Office Space</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="squareFootage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diện tích (m²)</FormLabel>
                  <FormControl>
                    <Input placeholder="1500" type="number" {...field} />
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
                <FormLabel>Mô tả dự án</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the layout requirements, style preferences, and any specific needs"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Include details about layout preferences, number of bedrooms, etc.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rooms"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Các phòng cần bao gồm</FormLabel>
                  <FormDescription>Select the rooms to include in your floor plan</FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {roomTypes.map((room) => (
                    <FormField
                      key={room.id}
                      control={form.control}
                      name="rooms"
                      render={({ field }) => {
                        return (
                          <FormItem key={room.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(room.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, room.id])
                                    : field.onChange(field.value?.filter((value) => value !== room.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{room.label}</FormLabel>
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
              name="includeLabels"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bao gồm nhãn phòng</FormLabel>
                    <FormDescription>Thêm nhãn cho từng phòng và khu vực</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeDimensions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bao gồm kích thước</FormLabel>
                    <FormDescription>Thêm kích thước cho các phòng và bố cục tổng thể</FormDescription>
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
              "Tạo bố cục sàn"
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
                Export as Image
              </Button>
              <Button variant="outline" size="sm">
                <ImageIcon className="mr-2 h-4 w-4" />
                Edit Layout
              </Button>
            </div>
          </div>
          <ContentPreview content={content} />
        </div>
      )}
    </div>
  )
}

