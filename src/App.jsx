import { useState, useEffect } from 'react'
import MarkdownEditor from './components/MarkdownEditor'
import EmailPreview from './components/EmailPreview'
import Toolbar from './components/Toolbar'
import './App.css'

function App() {
  const [markdown, setMarkdown] = useState('')
  const [isDark, setIsDark] = useState(false)

  // 다크 모드 토글
  const toggleDarkMode = () => {
    setIsDark(!isDark)
  }

  // 다크 모드 적용
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  // 초기 샘플 텍스트
  useEffect(() => {
    const sampleMarkdown = `# 이메일 제목

안녕하세요! **Markdown Email Editor**에 오신 것을 환영합니다.

이 도구를 사용하면 마크다운으로 작성한 내용을 이메일에 최적화된 스타일로 실시간 미리보기할 수 있습니다.

## 주요 기능

- ✅ **실시간 미리보기**: 왼쪽에서 작성하면 오른쪽에서 즉시 확인
- ✅ **이메일 최적화**: Gmail, Outlook 등에서 완벽하게 표시
- ✅ **원클릭 복사**: Gmail 작성창에 바로 붙여넣기 가능
- ✅ **다양한 문법 지원**: 헤더, 리스트, 링크, 코드 등

## 사용 방법

1. 왼쪽 편집기에서 마크다운을 작성하세요
2. 오른쪽에서 이메일 스타일로 미리보기를 확인하세요
3. **"Gmail에 복사"** 버튼을 클릭하세요
4. Gmail 작성창에 붙여넣기(Ctrl+V)하세요

## 지원하는 문법

### 텍스트 스타일
- **굵은 글씨**
- *기울임 글씨*
- \`인라인 코드\`

### 링크와 목록
- [링크 예시](https://example.com)
- 순서 없는 목록
- 순서 있는 목록

### 인용문
> 이것은 인용문입니다. 중요한 내용을 강조할 때 사용하세요.

### 코드 블록
\`\`\`javascript
function sendEmail() {
  console.log('이메일 전송!');
}
\`\`\`

---

**팁**: 이 샘플 텍스트를 지우고 원하는 내용을 작성해보세요!`

    setMarkdown(sampleMarkdown)
  }, [])

  return (
    <div className={`min-h-screen bg-background text-foreground ${isDark ? 'dark' : ''}`}>
      {/* 상단 도구 모음 */}
      <Toolbar 
        markdown={markdown}
        isDark={isDark}
        onToggleDark={toggleDarkMode}
      />
      
      {/* 메인 편집 영역 */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* 왼쪽: 마크다운 편집기 */}
        <div className="w-1/2 border-r bg-background">
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b bg-muted/30">
              <h2 className="text-sm font-medium text-muted-foreground">
                Markdown 편집기
              </h2>
            </div>
            <MarkdownEditor 
              value={markdown}
              onChange={setMarkdown}
              className="flex-1"
            />
          </div>
        </div>
        
        {/* 오른쪽: 이메일 미리보기 */}
        <div className="w-1/2 bg-muted/20">
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b bg-muted/30">
              <h2 className="text-sm font-medium text-muted-foreground">
                이메일 미리보기
              </h2>
            </div>
            <EmailPreview 
              markdown={markdown}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
