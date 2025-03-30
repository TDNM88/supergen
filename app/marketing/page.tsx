import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MarketingLandingGenerator } from "@/components/marketing/landing-generator"
import { MarketingEmailGenerator } from "@/components/marketing/email-generator"
import { MarketingBannerGenerator } from "@/components/marketing/banner-generator"

export default function MarketingPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tạo nội dung marketing</h1>
        <p className="text-xl text-muted-foreground">
          Tạo trang đích, mẫu email và tài liệu quảng cáo
        </p>
      </div>

      <Tabs defaultValue="landing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="landing">Trang đích</TabsTrigger>
          <TabsTrigger value="email">Mẫu email</TabsTrigger>
          <TabsTrigger value="banner">Banner quảng cáo</TabsTrigger>
        </TabsList>
        <TabsContent value="landing">
          <Card>
            <CardHeader>
              <CardTitle>Tạo trang đích</CardTitle>
              <CardDescription>
                Tạo trang đích chuyển đổi cao với các phần hero, lợi ích, đánh giá và CTA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarketingLandingGenerator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Tạo mẫu email</CardTitle>
              <CardDescription>
                Tạo mẫu email marketing với dòng tiêu đề hấp dẫn và nội dung thuyết phục
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarketingEmailGenerator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="banner">
          <Card>
            <CardHeader>
              <CardTitle>Tạo banner quảng cáo</CardTitle>
              <CardDescription>Tạo banner quảng cáo HTML cho chiến dịch marketing kỹ thuật số</CardDescription>
            </CardHeader>
            <CardContent>
              <MarketingBannerGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

