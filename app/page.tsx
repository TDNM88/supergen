import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BookOpen, ShoppingBag, Home, Activity, Megaphone } from "lucide-react"

export default function HomePage() {
  const industries = [
    {
      title: "Giáo dục",
      description: "Tạo bài học, câu hỏi và tài liệu giáo dục tương tác",
      icon: BookOpen,
      href: "/education",
      color: "bg-blue-500",
    },
    {
      title: "Marketing",
      description: "Thiết kế trang đích, mẫu email và tài liệu quảng cáo",
      icon: Megaphone,
      href: "/marketing",
      color: "bg-purple-500",
    },
    {
      title: "Kiến trúc",
      description: "Tạo bố cục nội thất và hình ảnh kiến trúc",
      icon: Home,
      href: "/architecture",
      color: "bg-green-500",
    },
    {
      title: "Y tế",
      description: "Tạo hướng dẫn sức khỏe, biểu đồ y tế và tài liệu bệnh nhân",
      icon: Activity,
      href: "/healthcare",
      color: "bg-red-500",
    },
    {
      title: "Thương mại điện tử",
      description: "Xây dựng danh mục sản phẩm và giao diện cửa hàng trực tuyến",
      icon: ShoppingBag,
      href: "/ecommerce",
      color: "bg-amber-500",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to Instamade</h1>
        <p className="text-xl text-muted-foreground">
          Generate professional content for multiple industries with AI assistance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {industries.map((industry) => (
          <Card key={industry.title} className="overflow-hidden">
            <CardHeader className={`${industry.color} text-white`}>
              <div className="flex items-center gap-2">
                <industry.icon className="h-6 w-6" />
                <CardTitle>{industry.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <CardDescription className="text-base">{industry.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={industry.href}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
        <p className="text-muted-foreground mb-4">
          You haven't created any projects yet. Get started by selecting an industry above.
        </p>
        <Button variant="outline" asChild>
          <Link href="/projects">View All Projects</Link>
        </Button>
      </div>
    </div>
  )
}

