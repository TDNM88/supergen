import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HealthcareGuideGenerator } from "@/components/healthcare/guide-generator"
import { HealthcareChartGenerator } from "@/components/healthcare/chart-generator"
import { HealthcareInfosheetGenerator } from "@/components/healthcare/infosheet-generator"

export default function HealthcarePage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tạo nội dung y tế</h1>
        <p className="text-xl text-muted-foreground">Tạo hướng dẫn sức khỏe, biểu đồ y tế và tài liệu bệnh nhân</p>
      </div>

      <Tabs defaultValue="guide" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guide">Hướng dẫn sức khỏe</TabsTrigger>
          <TabsTrigger value="chart">Biểu đồ y tế</TabsTrigger>
          <TabsTrigger value="infosheet">Tài liệu thông tin</TabsTrigger>
        </TabsList>
        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Tạo hướng dẫn sức khỏe</CardTitle>
              <CardDescription>
                Tạo hướng dẫn sức khỏe toàn diện với hướng dẫn rõ ràng và hình ảnh minh họa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HealthcareGuideGenerator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Tạo biểu đồ y tế</CardTitle>
              <CardDescription>Tạo biểu đồ y tế tương tác và hình ảnh dữ liệu</CardDescription>
            </CardHeader>
            <CardContent>
              <HealthcareChartGenerator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="infosheet">
          <Card>
            <CardHeader>
              <CardTitle>Tạo tài liệu thông tin</CardTitle>
              <CardDescription>
                Tạo tài liệu thông tin thân thiện với bệnh nhân về tình trạng, thủ thuật hoặc thuốc
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HealthcareInfosheetGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

