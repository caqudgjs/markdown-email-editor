import { useState, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'

const MarkdownEditor = ({ value, onChange, className = '' }) => {
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  const handleChange = useCallback((e) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // 단어 수와 문자 수 계산
    const words = newValue.trim() ? newValue.trim().split(/\s+/).length : 0
    const chars = newValue.length
    
    setWordCount(words)
    setCharCount(chars)
  }, [onChange])

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 relative">
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder="여기에 마크다운을 작성하세요...

# 제목 1
## 제목 2

**굵은 글씨** 및 *기울임 글씨*

- 목록 항목 1
- 목록 항목 2

[링크](https://example.com)

> 인용문

```javascript
console.log('코드 블록');
```"
          className="markdown-editor h-full resize-none font-mono text-sm leading-relaxed border-0 focus:ring-0 focus:border-0 shadow-none"
          style={{ minHeight: 'calc(100vh - 200px)' }}
        />
      </div>
      
      {/* 상태 표시줄 */}
      <div className="flex justify-between items-center px-3 py-2 bg-muted/50 border-t text-xs text-muted-foreground">
        <div className="flex gap-4">
          <span>단어: {wordCount}</span>
          <span>문자: {charCount}</span>
        </div>
        <div className="text-xs">
          Markdown 문법을 사용하여 작성하세요
        </div>
      </div>
    </div>
  )
}

export default MarkdownEditor
