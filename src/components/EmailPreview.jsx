import { useMemo } from 'react'
import DOMPurify from 'dompurify'

const EmailPreview = ({ markdown, className = '' }) => {
  // 간단한 마크다운 파서
  const parseMarkdown = (text) => {
    if (!text.trim()) {
      return '<p style="color: #999; font-style: italic; text-align: center; margin-top: 50px;">왼쪽에서 마크다운을 작성하면 여기에 이메일 스타일로 미리보기가 표시됩니다.</p>'
    }

    let html = text
      // 이스케이프 처리
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      
      // 헤더 처리 (# ## ### 등)
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 20px; font-weight: bold; color: #1a1a1a; margin: 16px 0 8px 0; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size: 24px; font-weight: bold; color: #1a1a1a; margin: 20px 0 12px 0; line-height: 1.3; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif;">$1</h2>')
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

    return html
  }

  // HTML 생성
  const htmlContent = useMemo(() => {
    try {
      const rawHtml = parseMarkdown(markdown)
      return DOMPurify.sanitize(rawHtml)
    } catch (error) {
      console.error('Markdown parsing error:', error)
      return '<p style="color: #dc3545;">마크다운 파싱 중 오류가 발생했습니다.</p>'
    }
  }, [markdown])

  return (
    <div className={`h-full overflow-auto ${className}`}>
      {/* 이메일 컨테이너 */}
      <div 
        className="email-preview-container"
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '20px',
          backgroundColor: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#333333'
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  )
}

export default EmailPreview
