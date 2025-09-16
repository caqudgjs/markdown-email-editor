import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Copy, 
  Download, 
  Moon, 
  Sun, 
  FileText, 
  Mail,
  Check,
  AlertCircle
} from 'lucide-react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const Toolbar = ({ markdown, isDark, onToggleDark, className = '' }) => {
  const [copyStatus, setCopyStatus] = useState('idle') // idle, success, error

  // 이메일용 HTML 생성 (인라인 스타일 포함)
  const generateEmailHTML = (markdown) => {
    if (!markdown.trim()) return ''
    
    try {
      // 간단한 마크다운 파서
      let html = markdown
        // 이스케이프 처리
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        
        // 헤더 처리 (# ## ### 등)
        .replace(/^### (.*$)/gim, '<h3 style="font-size: 20px; font-weight: bold; color: #1a1a1a; margin: 16px 0 8px 0; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif;">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 style="font-size: 24px; font-weight: bold; color: #1a1a1a; margin: 20px 0 12px 0; line-height: 1.3; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif;">$2</h2>')
        .replace(/^# (.*$)/gim, '<h1 style="font-size: 28px; font-weight: bold; color: #1a1a1a; margin: 24px 0 16px 0; line-height: 1.2; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif;">$1</h1>')
        
        // 굵은 글씨 처리
        .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1a1a1a;">$1</strong>')
        
        // 기울임 글씨 처리
        .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #333333;">$1</em>')
        
        // 인라인 코드 처리
        .replace(/`(.*?)`/g, '<code style="background-color: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 3px; padding: 2px 4px; font-family: \'Courier New\', monospace; font-size: 12px; color: #d73a49;">$1</code>')
        
        // 링크 처리
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #0066cc; text-decoration: none; border-bottom: 1px solid #0066cc;">$1</a>')
        
        // 수평선 처리
        .replace(/^---$/gim, '<hr style="border: none; border-top: 1px solid #e1e5e9; margin: 24px 0;">')
        
        // 인용문 처리
        .replace(/^&gt; (.*$)/gim, '<blockquote style="margin: 16px 0; padding: 12px 16px; border-left: 4px solid #e1e5e9; background-color: #f8f9fa; font-style: italic; color: #666666; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif;">$1</blockquote>')
        
        // 목록 처리 (간단한 버전)
        .replace(/^- (.*$)/gim, '<li style="margin: 4px 0; line-height: 1.5; font-size: 14px;">$1</li>')
        .replace(/^(\d+)\. (.*$)/gim, '<li style="margin: 4px 0; line-height: 1.5; font-size: 14px;">$2</li>')
        
        // 줄바꿈을 단락으로 변환
        .split('\n\n')
        .map(paragraph => {
          if (paragraph.trim() === '') return ''
          if (paragraph.includes('<h1') || paragraph.includes('<h2') || paragraph.includes('<h3') || 
              paragraph.includes('<hr') || paragraph.includes('<blockquote') || paragraph.includes('<li')) {
            return paragraph
          }
          if (paragraph.includes('<li')) {
            // 목록 항목들을 ul로 감싸기
            if (paragraph.match(/^- /m)) {
              return '<ul style="margin: 12px 0; padding-left: 20px; color: #333333; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif;">' + paragraph + '</ul>'
            } else if (paragraph.match(/^\d+\. /m)) {
              return '<ol style="margin: 12px 0; padding-left: 20px; color: #333333; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif;">' + paragraph + '</ol>'
            }
          }
          return '<p style="margin: 12px 0; line-height: 1.6; color: #333333; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif;">' + paragraph.replace(/\n/g, '<br>') + '</p>'
        })
        .join('')

      return DOMPurify.sanitize(html)
    } catch (error) {
      console.error('HTML generation error:', error)
      return ''
    }
  }

  // Gmail용 HTML 복사
  const handleCopyToClipboard = async () => {
    try {
      setCopyStatus('loading')
      
      const emailHTML = generateEmailHTML(markdown)
      if (!emailHTML) {
        setCopyStatus('error')
        setTimeout(() => setCopyStatus('idle'), 2000)
        return
      }
      
      // HTML을 클립보드에 복사 (Rich Text 형태로)
      const blob = new Blob([emailHTML], { type: 'text/html' })
      const clipboardItem = new ClipboardItem({ 'text/html': blob })
      
      await navigator.clipboard.write([clipboardItem])
      
      setCopyStatus('success')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch (error) {
      console.error('복사 실패:', error)
      
      // 폴백: 텍스트로 복사
      try {
        await navigator.clipboard.writeText(generateEmailHTML(markdown))
        setCopyStatus('success')
        setTimeout(() => setCopyStatus('idle'), 2000)
      } catch (fallbackError) {
        console.error('폴백 복사도 실패:', fallbackError)
        setCopyStatus('error')
        setTimeout(() => setCopyStatus('idle'), 2000)
      }
    }
  }

  // HTML 파일 다운로드
  const handleDownloadHTML = () => {
    const emailHTML = generateEmailHTML(markdown)
    if (!emailHTML) return
    
    const fullHTML = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>이메일 내용</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        ${emailHTML}
    </div>
</body>
</html>`
    
    const blob = new Blob([fullHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'email-content.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getCopyButtonContent = () => {
    switch (copyStatus) {
      case 'success':
        return (
          <>
            <Check className="w-4 h-4" />
            복사됨!
          </>
        )
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4" />
            복사 실패
          </>
        )
      default:
        return (
          <>
            <Mail className="w-4 h-4" />
            Gmail에 복사
          </>
        )
    }
  }

  return (
    <div className={`flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-semibold">Markdown Email Editor</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyToClipboard}
          disabled={!markdown.trim() || copyStatus === 'loading'}
          className={`transition-colors ${
            copyStatus === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
            copyStatus === 'error' ? 'bg-red-50 border-red-200 text-red-700' : ''
          }`}
        >
          {getCopyButtonContent()}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadHTML}
          disabled={!markdown.trim()}
        >
          <Download className="w-4 h-4" />
          HTML 다운로드
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleDark}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}

export default Toolbar
