import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-10 py-12">
      <div>
        <h1 className="text-5xl font-bold text-brand mb-4">수다<span className="text-3xl font-normal text-ink-muted ml-2">(手多)</span></h1>
        <p className="text-xl text-ink leading-relaxed">
          청각장애인을 위한 한국어 수어(KSL) 실시간 번역 플랫폼
        </p>
        <p className="text-sm text-ink-muted mt-2">
          수어 동작 또는 텍스트 입력으로 자연스러운 한국어 문장을 생성합니다.
        </p>
      </div>

      {/* 두 가지 입력 방식 카드 */}
      <div className="grid grid-cols-2 gap-6">
        <Link
          to="/text"
          className="flex flex-col items-center gap-3 p-8 bg-surface border-2 border-divider rounded-2xl shadow-sm hover:shadow-md hover:border-brand transition-all group"
        >
          <span className="text-5xl">⌨️</span>
          <h2 className="text-xl font-bold text-ink group-hover:text-brand transition-colors">
            텍스트 번역
          </h2>
          <p className="text-sm text-ink-muted text-center leading-relaxed">
            단어를 직접 검색해서 수어 후보를 확인하고 자연어로 변환
          </p>
        </Link>

        <Link
          to="/webcam"
          className="flex flex-col items-center gap-3 p-8 bg-surface border-2 border-divider rounded-2xl shadow-sm hover:shadow-md hover:border-brand transition-all group"
        >
          <span className="text-5xl">📷</span>
          <h2 className="text-xl font-bold text-ink group-hover:text-brand transition-colors">
            웹캠 번역
          </h2>
          <p className="text-sm text-ink-muted text-center leading-relaxed">
            웹캠으로 수어 동작을 촬영하면 실시간으로 자연어로 변환
          </p>
        </Link>
      </div>

      {/* 사용 방법 안내 */}
      <div className="bg-brand-soft rounded-2xl p-6 text-left">
        <h2 className="text-lg font-bold text-ink mb-4">어떻게 사용하나요?</h2>
        <ol className="space-y-3 text-sm text-ink">
          <li className="flex gap-3">
            <span className="bg-brand text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">
              1
            </span>
            <span>위의 두 가지 방식 중 하나를 선택합니다.</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-brand text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">
              2
            </span>
            <span>
              <strong>텍스트 번역:</strong> 수어 단어를 검색하고 후보 중에서 올바른 수어를 선택합니다.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="bg-brand text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">
              3
            </span>
            <span>단어 시퀀스가 완성되면 번역 버튼을 눌러 자연어 문장을 생성합니다.</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
