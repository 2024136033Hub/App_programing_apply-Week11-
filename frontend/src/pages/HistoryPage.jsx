import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getHistory, deleteHistory, deleteAllHistory, getImage, searchSign } from '../services/api'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function proxyMediaUrl(url) {
  if (!url) return null
  if (url.includes('sldict.korean.go.kr')) {
    return `${BASE_URL}/dictionary/media-proxy?url=${encodeURIComponent(url)}`
  }
  return url
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function SignModal({ words, wordImages, onClose }) {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all(words.map(async word => {
      const r = await searchSign(word)
      return [word, r.results]
    })).then(entries => {
      setData(Object.fromEntries(entries))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <h2 className="text-xl font-bold text-ink">수어 동작 보기</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink text-2xl leading-none">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <p className="text-center text-ink-muted py-10">불러오는 중...</p>
          ) : (
            words.map(word => (
              <div key={word}>
                <h3 className="text-lg font-semibold text-ink mb-3">
                  "{word}" 수어 후보
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {(data[word] || []).map((item, idx) => (
                    <div key={idx} className="border border-divider rounded-xl p-4 bg-page-bg">
                      {item.video_url ? (
                        <video
                          src={proxyMediaUrl(item.video_url)}
                          className="w-full rounded-lg bg-surface mb-2"
                          controls muted playsInline
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                        />
                      ) : null}
                      <div
                        className="w-full bg-surface rounded-lg p-3 text-sm text-ink leading-relaxed mb-2"
                        style={{ display: item.video_url ? 'none' : 'flex' }}
                      >
                        {item.description || '수어 동작 설명 없음'}
                      </div>
                      {wordImages[word] && (
                        <div className="flex items-center gap-2 p-2 bg-brand-soft rounded-lg mb-2">
                          <img src={wordImages[word]} alt={word} className="w-10 h-10 object-cover rounded" onError={(e) => { e.target.parentElement.style.display = 'none' }} />
                          <span className="text-xs text-ink-muted">'{word}' 뜻 이미지</span>
                        </div>
                      )}
                      <p className="font-semibold text-ink text-center mt-2">{item.word}</p>
                      {item.synonyms?.length > 0 && (
                        <p className="text-xs text-ink-muted text-center">= {item.synonyms.join(' / ')}</p>
                      )}
                      {item.category && (
                        <p className="text-xs text-brand text-center">[{item.category}]</p>
                      )}
                    </div>
                  ))}
                  {(data[word] || []).length === 0 && (
                    <p className="text-sm text-ink-muted col-span-2 py-4 text-center">검색 결과 없음</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const { user, getToken } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [wordImages, setWordImages] = useState({})
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [modalWords, setModalWords] = useState(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getHistory(getToken())
      .then(async (data) => {
        setItems(data)
        const allWords = [...new Set(
          data.flatMap(item => {
            try { return JSON.parse(item.input_words) } catch { return [] }
          })
        )]
        const settled = await Promise.allSettled(
          allWords.map(async word => {
            const r = await getImage(word)
            return [word, r.image_url]
          })
        )
        setWordImages(Object.fromEntries(
          settled.filter(e => e.status === 'fulfilled').map(e => e.value).filter(([, url]) => url)
        ))
      })
      .catch(() => setError('기록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [user, getToken])

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.size === items.length ? new Set() : new Set(items.map(i => i.id)))
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return
    try {
      await Promise.all([...selectedIds].map(id => deleteHistory(id, getToken())))
      setItems(prev => prev.filter(item => !selectedIds.has(item.id)))
      setSelectedIds(new Set())
    } catch { setError('삭제에 실패했습니다.') }
  }

  const handleDeleteAll = async () => {
    if (!window.confirm('모든 번역 기록을 삭제할까요?')) return
    try {
      await deleteAllHistory(getToken())
      setItems([])
      setSelectedIds(new Set())
    } catch { setError('삭제에 실패했습니다.') }
  }

  const handleDeleteOne = async (id) => {
    try {
      await deleteHistory(id, getToken())
      setItems(prev => prev.filter(item => item.id !== id))
      setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next })
    } catch { setError('삭제에 실패했습니다.') }
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <p className="text-6xl">🔒</p>
        <p className="text-xl font-bold text-ink">로그인이 필요합니다</p>
        <p className="text-sm text-ink-muted">번역 기록은 로그인 후 이용할 수 있어요</p>
        <Link to="/login" className="inline-block bg-brand text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors">
          로그인하기
        </Link>
      </div>
    )
  }

  if (loading) return <div className="text-center py-20 text-ink-muted">불러오는 중...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-10">
      {modalWords && (
        <SignModal words={modalWords} wordImages={wordImages} onClose={() => setModalWords(null)} />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-ink">
          번역 기록
          <span className="text-sm font-normal text-ink-muted ml-2">({items.length}개)</span>
        </h2>
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <button onClick={toggleSelectAll} className="text-sm text-ink-muted hover:text-brand transition-colors">
              {selectedIds.size === items.length ? '전체 해제' : '전체 선택'}
            </button>
            <span className="text-divider">|</span>
            <button onClick={handleDeleteAll} className="text-sm text-ink-muted hover:text-red-500 transition-colors">
              전체 삭제
            </button>
          </div>
        )}
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-brand-soft border border-brand rounded-xl px-4 py-3">
          <span className="text-sm font-semibold text-brand">{selectedIds.size}개 선택됨</span>
          <div className="flex gap-2">
            <button onClick={() => setSelectedIds(new Set())} className="text-sm text-ink-muted hover:text-ink px-3 py-1.5 rounded-lg border border-divider bg-surface transition-colors">
              취소
            </button>
            <button onClick={handleDeleteSelected} className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors">
              삭제
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      {items.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="text-5xl">📋</p>
          <p className="text-ink-muted font-medium">저장된 번역 기록이 없습니다</p>
          <p className="text-sm text-ink-muted">번역 후 자동으로 기록이 저장됩니다</p>
        </div>
      ) : (
        items.map((item) => {
          let words = []
          try { words = JSON.parse(item.input_words) } catch { words = [item.input_words] }
          const isSelected = selectedIds.has(item.id)

          return (
            <div
              key={item.id}
              className={`bg-surface border rounded-2xl p-5 shadow-sm transition-all ${isSelected ? 'border-brand bg-brand-soft' : 'border-divider'}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${isSelected ? 'bg-brand border-brand' : 'border-divider bg-surface'}`}
                  onClick={() => toggleSelect(item.id)}
                >
                  {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                </div>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setModalWords(words)}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span>{item.translation_type === 'webcam' ? '📷' : '⌨️'}</span>
                    <span className="text-xs font-medium text-brand bg-brand-soft px-2 py-0.5 rounded-full">
                      {item.translation_type === 'webcam' ? '웹캠 번역' : '텍스트 번역'}
                    </span>
                    <span className="text-xs text-ink-muted ml-auto">{formatDate(item.created_at)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {words.map((word, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-page-bg border border-divider rounded-xl px-2 py-1">
                        {wordImages[word] && (
                          <img src={wordImages[word]} alt={word} className="w-6 h-6 object-cover rounded" onError={(e) => { e.target.style.display = 'none' }} />
                        )}
                        <span className="text-xs text-ink">{word}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-ink font-medium leading-snug">{item.result}</p>
                  <p className="text-xs text-brand mt-2">탭하면 수어 동작 보기 →</p>
                </div>

                <button
                  onClick={() => handleDeleteOne(item.id)}
                  className="flex-shrink-0 text-ink-muted hover:text-red-500 transition-colors p-1 text-lg"
                  aria-label="삭제"
                >
                  🗑️
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
