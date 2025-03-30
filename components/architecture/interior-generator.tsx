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
  roomType: z.string(),
  style: z.string(),
  squareFootage: z.string().min(1, { message: "Square footage is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  furniture: z.array(z.string()).min(1, { message: "Select at least one furniture item" }),
  colorScheme: z.string(),
  includeLabels: z.boolean().default(true),
})

export function ArchitectureInteriorGenerator() {
  const [content, setContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomType: "living",
      style: "modern",
      squareFootage: "",
      description: "",
      furniture: ["sofa", "coffee-table", "tv"],
      colorScheme: "neutral",
      includeLabels: true,
    },
  })

  const furnitureItems = [
    { id: "sofa", label: "Sofa" },
    { id: "coffee-table", label: "Coffee Table" },
    { id: "dining-table", label: "Dining Table" },
    { id: "chairs", label: "Chairs" },
    { id: "bed", label: "Bed" },
    { id: "wardrobe", label: "Wardrobe" },
    { id: "desk", label: "Desk" },
    { id: "tv", label: "TV/Media Unit" },
    { id: "bookshelf", label: "Bookshelf" },
    { id: "rug", label: "Rug" },
    { id: "lamps", label: "Lamps" },
    { id: "plants", label: "Plants" },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    try {
      const prompt = `
        Create an interior design layout with the following details:
        Room Type: ${values.roomType}
        Design Style: ${values.style}
        Square Footage: ${values.squareFootage}
        Description: ${values.description}
        Furniture to Include: ${values.furniture.join(", ")}
        Color Scheme: ${values.colorScheme}
        
        ${values.includeLabels ? "Include labels for furniture and design elements." : "Do not include labels."}
        
        Create an HTML representation of an interior design layout using div elements with Tailwind CSS for positioning and styling.
        Use different colors to represent different furniture pieces and design elements.
        Make the layout proportional and realistic based on typical room dimensions.
        Include design recommendations and style notes.
      `

      const generatedContent = await generateContent(prompt, "architecture", "interior design")
      setContent(generatedContent)

      toast({
        title: "Interior design generated",
        description: "Your interior design layout has been successfully generated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate interior design. Please try again.",
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
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại phòng</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="living">Living Room</SelectItem>
                      <SelectItem value="bedroom">Bedroom</SelectItem>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="dining">Dining Room</SelectItem>
                      <SelectItem value="office">Home Office</SelectItem>
                      <SelectItem value="bathroom">Bathroom</SelectItem>
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
                  <FormLabel>Phong cách thiết kế</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select design style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="modern">Modern/Contemporary</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="scandinavian">Scandinavian</SelectItem>
                      <SelectItem value="bohemian">Bohemian</SelectItem>
                      <SelectItem value="mid-century">Mid-Century Modern</SelectItem>
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
                    <Input placeholder="250" type="number" {...field} />
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
                      <SelectItem value="neutral">Neutral (Whites, Beiges, Grays)</SelectItem>
                      <SelectItem value="warm">Warm (Reds, Oranges, Yellows)</SelectItem>
                      <SelectItem value="cool">Cool (Blues, Greens, Purples)</SelectItem>
                      <SelectItem value="monochromatic">Monochromatic</SelectItem>
                      <SelectItem value="contrast">High Contrast</SelectItem>
                      <SelectItem value="earthy">Earthy Tones</SelectItem>
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
                <FormLabel>Yêu cầu thiết kế</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your design preferences, specific requirements, and any existing elements to work around"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Include details about your lifestyle, preferences, and needs</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="furniture"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Nội thất cần bao gồm</FormLabel>
                  <FormDescription>Select the furniture items to include in your design</FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {furnitureItems.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="furniture"
                      render={({ field }) => {
                        return (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(field.value?.filter((value) => value !== item.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
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
            name="includeLabels"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Bao gồm nhãn</FormLabel>
                  <FormDescription>Thêm nhãn cho đồ nội thất và các yếu tố thiết kế</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-2">
            <Button variant="outline" type="button" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload Reference Image (Optional)
            </Button>
            <FormDescription>Upload an image of your existing space or inspiration for better results</FormDescription>
          </div>

          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo thiết kế nội thất"
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
                Edit Design
              </Button>
            </div>
          </div>
          <ContentPreview content={content} />
        </div>
      )}
    </div>
  )
}

