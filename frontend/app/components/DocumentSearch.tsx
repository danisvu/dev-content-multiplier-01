'use client'

import { useState, useMemo } from 'react'
import { Search, Loader2, FileText, TrendingUp, X, Filter, User, FolderOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Progress } from './ui/progress'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

export interface Document {
  id: number | string
  title: string
  content: string
  url: string
  keywords?: string[]
  uploadDate: string
  author?: string
  category?: string
}

export interface SearchResult extends Document {
  score: number // 0-100
  matchedSnippets: string[]
  relevanceReason: string
}

interface DocumentSearchProps {
  documents: Document[]
  onResultClick?: (result: SearchResult) => void
  placeholder?: string
  className?: string
  enableFilters?: boolean
}

export function DocumentSearch({
  documents,
  onResultClick,
  placeholder = "Tìm kiếm tài liệu theo nội dung, ví dụ: 'trí tuệ nhân tạo giúp quảng cáo'",
  className,
  enableFilters = true,
}: DocumentSearchProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedAuthor, setSelectedAuthor] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  // Extract unique authors and categories
  const uniqueAuthors = useMemo(() => {
    const authors = documents
      .map(doc => doc.author)
      .filter(Boolean) as string[]
    return Array.from(new Set(authors)).sort()
  }, [documents])

  const uniqueCategories = useMemo(() => {
    const categories = documents
      .map(doc => doc.category)
      .filter(Boolean) as string[]
    return Array.from(new Set(categories)).sort()
  }, [documents])

  // Filter documents based on selected filters
  const filteredDocuments = useMemo(() => {
    let filtered = documents

    if (selectedAuthor) {
      filtered = filtered.filter(doc => doc.author === selectedAuthor)
    }

    if (selectedCategory) {
      filtered = filtered.filter(doc => doc.category === selectedCategory)
    }

    return filtered
  }, [documents, selectedAuthor, selectedCategory])

  // Count active filters
  const activeFiltersCount = [selectedAuthor, selectedCategory].filter(Boolean).length

  // Semantic search simulation
  const calculateSimilarity = (query: string, document: Document): SearchResult | null => {
    const queryLower = query.toLowerCase()
    const titleLower = document.title.toLowerCase()
    const contentLower = document.content.toLowerCase()
    
    let score = 0
    const matchedSnippets: string[] = []
    const reasons: string[] = []

    // 1. Direct keyword matching
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2)
    const titleWords = titleLower.split(/\s+/)
    const contentWords = contentLower.split(/\s+/)

    queryWords.forEach(word => {
      if (titleWords.includes(word)) {
        score += 15
        reasons.push(`"${word}" trong tiêu đề`)
      }
      if (contentWords.includes(word)) {
        score += 5
      }
    })

    // 2. Semantic synonyms mapping (Vietnamese)
    const synonyms: Record<string, string[]> = {
      'ai': ['trí tuệ nhân tạo', 'artificial intelligence', 'machine learning', 'deep learning'],
      'marketing': ['quảng cáo', 'tiếp thị', 'pr', 'branding', 'content marketing'],
      'seo': ['tối ưu hóa', 'optimization', 'search engine', 'tìm kiếm'],
      'content': ['nội dung', 'bài viết', 'article', 'blog'],
      'social': ['mạng xã hội', 'facebook', 'instagram', 'twitter'],
      'analytics': ['phân tích', 'analysis', 'data', 'insights', 'metrics'],
      'strategy': ['chiến lược', 'kế hoạch', 'planning', 'approach'],
      'automation': ['tự động hóa', 'automatic', 'tự động'],
      'roi': ['lợi nhuận', 'return', 'profit', 'doanh thu'],
      'engagement': ['tương tác', 'interaction', 'participation'],
    }

    // Check semantic matches
    Object.entries(synonyms).forEach(([key, syns]) => {
      if (queryLower.includes(key)) {
        syns.forEach(syn => {
          if (titleLower.includes(syn) || contentLower.includes(syn)) {
            score += 10
            reasons.push(`Liên quan: "${key}" ↔ "${syn}"`)
          }
        })
      }
      
      // Reverse check
      syns.forEach(syn => {
        if (queryLower.includes(syn) && (titleLower.includes(key) || contentLower.includes(key))) {
          score += 10
          reasons.push(`Liên quan: "${syn}" ↔ "${key}"`)
        }
      })
    })

    // 3. Keyword matching
    if (document.keywords) {
      document.keywords.forEach(keyword => {
        if (queryLower.includes(keyword.toLowerCase())) {
          score += 8
          reasons.push(`Keyword match: "${keyword}"`)
        }
      })
    }

    // 4. Extract relevant snippets
    const sentences = document.content.split(/[.!?]\s+/)
    queryWords.forEach(word => {
      sentences.forEach(sentence => {
        if (sentence.toLowerCase().includes(word) && matchedSnippets.length < 3) {
          matchedSnippets.push(sentence.trim())
        }
      })
    })

    // 5. Partial phrase matching
    if (queryLower.length > 10) {
      const queryParts = queryLower.split(/\s+/).filter(w => w.length > 3)
      queryParts.forEach(part => {
        if (contentLower.includes(part)) {
          score += 3
        }
      })
    }

    // Normalize score to 0-100
    score = Math.min(score, 100)

    // Only return results with score > 10
    if (score > 10) {
      return {
        ...document,
        score,
        matchedSnippets: matchedSnippets.slice(0, 2),
        relevanceReason: reasons.slice(0, 3).join(' • ') || 'Khớp một phần với nội dung'
      }
    }

    return null
  }

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Vui lòng nhập từ khóa tìm kiếm')
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    try {
      const searchResults: SearchResult[] = []

      filteredDocuments.forEach(doc => {
        const result = calculateSimilarity(query, doc)
        if (result) {
          searchResults.push(result)
        }
      })

      // Sort by score (highest first)
      searchResults.sort((a, b) => b.score - a.score)

      setResults(searchResults)

      if (searchResults.length === 0) {
        toast.info('Không tìm thấy', {
          description: 'Thử với từ khóa khác hoặc mô tả chi tiết hơn.'
        })
      } else {
        toast.success('Tìm thấy!', {
          description: `${searchResults.length} tài liệu liên quan.`
        })
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Lỗi tìm kiếm', {
        description: 'Vui lòng thử lại.'
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setHasSearched(false)
  }

  const handleClearFilters = () => {
    setSelectedAuthor('')
    setSelectedCategory('')
    toast.info('Đã xóa bộ lọc', {
      description: 'Tất cả bộ lọc đã được reset.'
    })
  }

  const getScoreColor = (score: number): string => {
    if (score >= 70) return 'text-green-600 dark:text-green-400'
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-orange-600 dark:text-orange-400'
  }

  const getScoreLabel = (score: number): string => {
    if (score >= 70) return 'Rất liên quan'
    if (score >= 40) return 'Liên quan'
    return 'Có thể liên quan'
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Filters Section */}
      {enableFilters && (uniqueAuthors.length > 0 || uniqueCategories.length > 0) && (
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">
                  Bộ Lọc
                  {activeFiltersCount > 0 && (
                    <Badge variant="default" className="ml-2 bg-primary">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </CardTitle>
              </div>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Author Filter */}
              {uniqueAuthors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Tác giả
                  </label>
                  <select
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Tất cả tác giả ({documents.length})</option>
                    {uniqueAuthors.map((author) => {
                      const count = documents.filter(doc => doc.author === author).length
                      return (
                        <option key={author} value={author}>
                          {author} ({count})
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}

              {/* Category Filter */}
              {uniqueCategories.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-muted-foreground" />
                    Chủ đề
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Tất cả chủ đề ({documents.length})</option>
                    {uniqueCategories.map((category) => {
                      const count = documents.filter(doc => doc.category === category).length
                      return (
                        <option key={category} value={category}>
                          {category} ({count})
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium">Đang lọc:</span>
                <div className="flex gap-2 flex-wrap">
                  {selectedAuthor && (
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => setSelectedAuthor('')}
                    >
                      <User className="w-3 h-3" />
                      {selectedAuthor}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => setSelectedCategory('')}
                    >
                      <FolderOpen className="w-3 h-3" />
                      {selectedCategory}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground ml-auto">
                  {filteredDocuments.length} / {documents.length} tài liệu
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="pl-10 pr-10"
            disabled={isSearching}
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={handleClear}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="min-w-[100px]"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang tìm...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </>
          )}
        </Button>
      </div>

      {/* Search Stats */}
      {hasSearched && !isSearching && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span>
            Tìm thấy <strong className="text-foreground">{results.length}</strong> kết quả
          </span>
          {results.length > 0 && (
            <span>
              trong <strong className="text-foreground">{filteredDocuments.length}</strong> tài liệu
              {activeFiltersCount > 0 && (
                <span className="text-xs ml-1">
                  (đã lọc từ {documents.length})
                </span>
              )}
            </span>
          )}
          {activeFiltersCount > 0 && (
            <Badge variant="outline" className="gap-1">
              <Filter className="w-3 h-3" />
              {activeFiltersCount} bộ lọc đang dùng
            </Badge>
          )}
        </div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : hasSearched && results.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Thử tìm với từ khóa khác hoặc mô tả chi tiết hơn
                </p>
                <Button variant="outline" onClick={handleClear}>
                  Xóa tìm kiếm
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => onResultClick?.(result)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base mb-2 group-hover:text-primary transition-colors">
                          {result.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={cn('font-semibold', getScoreColor(result.score))}
                          >
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {result.score}% - {getScoreLabel(result.score)}
                          </Badge>
                          {result.keywords?.slice(0, 3).map((keyword, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Progress value={result.score} className="w-20 h-2" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Relevance Reason */}
                    <div className="text-xs text-muted-foreground italic">
                      <span className="font-semibold">Lý do liên quan:</span> {result.relevanceReason}
                    </div>

                    {/* Matched Snippets */}
                    {result.matchedSnippets.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">
                          Đoạn trích liên quan:
                        </p>
                        {result.matchedSnippets.map((snippet, i) => (
                          <div
                            key={i}
                            className="text-sm p-3 rounded-lg bg-muted/50 border-l-2 border-primary/50 italic"
                          >
                            "...{snippet}..."
                          </div>
                        ))}
                      </div>
                    )}

                    {/* URL */}
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {result.url}
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

