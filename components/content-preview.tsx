"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ContentPreviewProps {
  content: string
}

export function ContentPreview({ content }: ContentPreviewProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const wrappedContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `

  return (
    <Card className="overflow-hidden">
      <Tabs defaultValue="preview">
        <TabsList className="w-full rounded-none border-b bg-muted/50">
          <TabsTrigger value="preview" className="rounded-none">
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="rounded-none">
            HTML
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="p-0">
          <div className="h-[600px] overflow-auto">
            <iframe
              srcDoc={wrappedContent}
              title="Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts"
            />
          </div>
        </TabsContent>
        <TabsContent value="code" className="p-0">
          <div className="h-[600px] overflow-auto">
            <pre className="p-4 text-sm">
              <code>{content}</code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

