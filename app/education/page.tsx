import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EducationLessonGenerator } from "@/components/education/lesson-generator"
import { EducationQuizGenerator } from "@/components/education/quiz-generator"
import { EducationGuideGenerator } from "@/components/education/guide-generator"

export default function EducationPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tạo nội dung giáo dục</h1>
        <p className="text-xl text-muted-foreground">Tạo bài học, câu hỏi và tài liệu giáo dục tương tác</p>
      </div>

      <Tabs defaultValue="lesson" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lesson">Kế hoạch bài học</TabsTrigger>
          <TabsTrigger value="quiz">Câu hỏi</TabsTrigger>
          <TabsTrigger value="guide">Hướng dẫn học tập</TabsTrigger>
        </TabsList>
        <TabsContent value="lesson">
          <Card>
            <CardHeader>
              <CardTitle>Tạo kế hoạch bài học</CardTitle>
              <CardDescription>
                Tạo kế hoạch bài học tương tác với mục tiêu, nội dung, hoạt động và đánh giá
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EducationLessonGenerator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle>Tạo câu hỏi</CardTitle>
              <CardDescription>
                Tạo câu hỏi với các loại câu hỏi trắc nghiệm, đúng/sai hoặc câu hỏi mở
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EducationQuizGenerator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Tạo hướng dẫn học tập</CardTitle>
              <CardDescription>
                Tạo hướng dẫn học tập toàn diện với các khái niệm chính, ví dụ và câu hỏi thực hành
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EducationGuideGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

