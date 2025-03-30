import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArchitectureLayoutGenerator } from "@/components/architecture/layout-generator"
import { ArchitectureInteriorGenerator } from "@/components/architecture/interior-generator"
import { ArchitectureVisualizationGenerator } from "@/components/architecture/visualization-generator"

export default function ArchitecturePage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Kiến trúc & Thiết kế nội thất</h1>
        <p className="text-xl text-muted-foreground">
          Tạo bố cục, thiết kế nội thất và hình ảnh kiến trúc
        </p>
      </div>

      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="layout">Bố cục sàn</TabsTrigger>
          <TabsTrigger value="interior">Thiết kế nội thất</TabsTrigger>
          <TabsTrigger value="visualization">Hình ảnh 3D</TabsTrigger>
        </TabsList>
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Tạo bố cục sàn</CardTitle>
              <CardDescription>
                Tạo bố cục 2D cho không gian dân cư hoặc thương mại
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ArchitectureLayoutGenerator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="interior">
          <Card>
            <CardHeader>
              <CardTitle>Tạo thiết kế nội thất</CardTitle>
              <CardDescription>
                Tạo khái niệm thiết kế nội thất với bố cục đồ nội thất và đề xuất phong cách
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ArchitectureInteriorGenerator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="visualization">
          <Card>
            <CardHeader>
              <CardTitle>Tạo hình ảnh kiến trúc</CardTitle>
              <CardDescription>Tạo hình ảnh kiến trúc và bài thuyết trình khái niệm</CardDescription>
            </CardHeader>
            <CardContent>
              <ArchitectureVisualizationGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

