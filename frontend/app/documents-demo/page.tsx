'use client'

import { useState } from 'react'
import { DocumentUpload } from '../components/DocumentUpload'
import { DocumentCard, Document } from '../components/DocumentCard'
import { InlineCitations, Source } from '../components/InlineCitations'
import { Footnotes } from '../components/Footnotes'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Button,
  Badge
} from '../components/ui'
import { Upload, FileText, BookOpen, Hash } from 'lucide-react'
import { toast } from 'sonner'

const sampleDocuments: Document[] = [
  {
    id: 1,
    title: "AI Content Generation Best Practices",
    url: "https://example.com/ai-content-best-practices",
    uploadDate: "2025-11-01T10:00:00Z",
    fileType: "PDF",
    fileSize: 2048000
  },
  {
    id: 2,
    title: "SEO Optimization Guide 2025",
    url: "https://example.com/seo-guide-2025-comprehensive-tutorial",
    uploadDate: "2025-11-02T14:30:00Z",
    fileType: "DOCX",
    fileSize: 1536000
  },
  {
    id: 3,
    title: "Content Marketing Strategy",
    url: "https://example.com/content-marketing-strategy-framework",
    uploadDate: "2025-11-03T09:15:00Z",
    fileType: "TXT",
    fileSize: 512000
  }
]

const sampleSources: Source[] = [
  {
    id: 1,
    title: "The Impact of AI on Content Creation",
    url: "https://example.com/ai-impact-content",
    snippet: "AI has revolutionized content creation by reducing production time by up to 70% while maintaining quality standards. Modern AI tools can generate first drafts, suggest improvements, and optimize content for specific audiences."
  },
  {
    id: 2,
    title: "SEO Best Practices 2025",
    url: "https://example.com/seo-best-practices",
    snippet: "Search engine optimization continues to evolve with algorithm updates. Key factors include content quality, user experience, mobile optimization, and semantic search optimization."
  },
  {
    id: 3,
    title: "Content Marketing ROI Study",
    url: "https://example.com/content-marketing-roi",
    snippet: "Recent studies show that content marketing delivers 3x more leads than traditional marketing while costing 62% less. Quality content builds brand authority and drives organic traffic."
  }
]

const sampleTextWithCitations = `AI has transformed the content creation landscape significantly [1]. According to recent research, businesses that implement AI-powered content strategies see substantial improvements in both efficiency and quality [2].

The key to successful AI content generation lies in understanding its capabilities and limitations. While AI can generate first drafts quickly [1], human oversight remains crucial for maintaining brand voice and ensuring accuracy [3].

Modern content marketing requires a strategic approach that combines AI automation with human creativity [2]. This hybrid model allows teams to scale content production without sacrificing quality [3].`

export default function DocumentsDemoPage() {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const handleUpload = async (file: File) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newDoc: Document = {
      id: documents.length + 1,
      title: file.name,
      url: URL.createObjectURL(file),
      uploadDate: new Date().toISOString(),
      fileType: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      fileSize: file.size
    }
    
    setDocuments([...documents, newDoc])
  }

  const handleDeleteDocument = (id: number | string) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  const handleCitationClick = (sourceId: number) => {
    console.log('Citation clicked:', sourceId)
    toast.info('Citation clicked', {
      description: `Jumped to source [${sourceId}]`
    })
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            📚 Documents & Citations System
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete document management với upload, citations, và footnotes
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Drag & drop</li>
                <li>• File validation</li>
                <li>• Progress bar</li>
                <li>• Toast feedback</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Card display</li>
                <li>• URL truncation</li>
                <li>• Delete confirm</li>
                <li>• Copy & open</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Citations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Parse [1], [2]</li>
                <li>• Badge với tooltip</li>
                <li>• Click scroll</li>
                <li>• Hover preview</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Footnotes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Accordion list</li>
                <li>• Source snippets</li>
                <li>• Copy URL</li>
                <li>• Open source</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Document Upload Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  1. Document Upload
                </CardTitle>
                <CardDescription>
                  Upload documents với drag-drop và progress tracking
                </CardDescription>
              </div>
              <DocumentUpload
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
                onUpload={handleUpload}
                trigger={
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p className="font-medium">Test Upload Dialog:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Click "Upload Document" button</li>
                <li>Drag & drop file hoặc click để chọn</li>
                <li>Watch progress bar animation</li>
                <li>File appears in Documents section below</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              2. Document Cards ({documents.length})
            </CardTitle>
            <CardDescription>
              Manage uploaded documents với delete confirmation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inline Citations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              3. Inline Citations
            </CardTitle>
            <CardDescription>
              Parse [1], [2] và replace với interactive badges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge className="mb-2">Interactive Text</Badge>
              <div className="p-4 rounded-lg border bg-card">
                <InlineCitations
                  text={sampleTextWithCitations}
                  sources={sampleSources}
                  onCitationClick={handleCitationClick}
                />
              </div>
            </div>
            <div className="text-sm space-y-2">
              <p className="font-medium">Test Citations:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Hover [1], [2], [3] badges → Tooltip shows source</li>
                <li>Click citation badge → Scrolls to footnote below</li>
                <li>Footnote highlights with pulse animation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footnotes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              4. Footnotes Section
            </CardTitle>
            <CardDescription>
              Accordion list với full source details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Footnotes sources={sampleSources} />
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle>💻 Usage Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">DocumentUpload:</p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`<DocumentUpload
  onUpload={async (file) => {
    await uploadToServer(file)
  }}
  trigger={<Button>Upload</Button>}
  maxSize={10} // MB
/>`}
              </pre>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">InlineCitations:</p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`<InlineCitations
  text="Content with [1] and [2] citations"
  sources={sources}
  onCitationClick={(id) => scrollToFootnote(id)}
/>`}
              </pre>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Footnotes:</p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`<Footnotes sources={sources} />`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <h3 className="text-2xl font-bold mb-2">✅ Complete System!</h3>
          <p className="text-muted-foreground mb-4">
            Full document management với upload, citations, và footnotes
          </p>
        </div>
      </div>
    </div>
  )
}

