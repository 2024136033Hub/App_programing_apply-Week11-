import { useState, useEffect } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import SubtitleDisplay from '../components/SubtitleDisplay'
import { searchSign, getImage, translateWords, addHistory, proxyMediaUrl } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const FAVORITES_KEY = 'suda_favorites'

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
  } catch {
    return []
  }
}

function saveFavorites(items) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(items))
}

export default function TextInputPage() {
  const { user, getToken } = useAuth()
  const [query, setQuery] = useState('')
  const [candidates, setCandidates] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [translationResult, setTranslationResult] = useState('')
  const [nounImages, setNounImages] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [favorites, setFavorites] = useState(loadFavorites)
  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  const isFavorite = (word) => favorites.some(f => f.word === word)

  const toggleFavorite = (item, nounImageUrl) => {
    setFavorites(prev =>
      isFavorite(item.word)
        ? prev.filter(f => f.word !== item.word)
        : [...prev, { word: item.word, video_url: item.video_url, description: item.description, category: item.category, synonyms: item.synonyms, noun_image_url: nounImageUrl || null }]
    )
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setCandidates([])
    setNounImages({})
    try {
      const signData = await searchSign(query)
      setCandidates(signData.results)
      const settled = await Promise.allSettled(
        signData.results.map(async (item, idx) => {
          const imgData = await getImage(item.word)
          return [`${item.word}__${idx}`, imgData.image_url]
        })
      )
      setNounImages(Object.fromEntries(
        settled.filter(e => e.status === 'fulfilled').map(e => e.value).filter(([, url]) => url)
      ))
    } catch {
      setError('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectWord = (item) => {
    setSelectedItems(prev => [...prev, item])
  }

  const handleRemoveWord = (index) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleTranslate = async () => {
    if (selectedItems.length === 0) return
    setLoading(true)
    setError('')
    try {
      const words = selectedItems.map(i => i.word)
      const data = await translateWords(words)
      setTranslationResult(data.result)
      if (user) {
        addHistory(
          { translation_type: 'text', input_words: JSON.stringify(words), result: data.result },
          getToken()
        ).catch(() => {})
      }
    } catch (err) {
      setError(`번역 오류: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translationResult)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-36">
      <h2 className="text-2xl font-bold text-ink">텍스트 입력 번역</h2>
      <p className="text-ink-muted text-sm">
        수어 단어를 검색해 후보 중에서 선택한 뒤 번역 버튼을 누르세요.
      </p>

      {/* 검색창 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="단어 검색 (예: 사과, 병원, 감사합니다)"
          className="flex-1 border border-divider rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand bg-surface text-ink"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-brand text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50"
        >
          검색
        </button>
      </div>

      {/* 즐겨찾기 아코디언 */}
      {favorites.length > 0 && (
        <div className="border border-divider rounded-xl overflow-hidden">
          <button
            onClick={() => setShowFavorites(prev => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 bg-accent-soft hover:bg-yellow-100 transition-colors"
          >
            <span className="font-semibold text-ink flex items-center gap-2">
              ⭐ 즐겨찾기
              <span className="text-sm font-normal text-ink-muted">({favorites.length}개)</span>
            </span>
            <span className="text-ink-muted text-lg transition-transform duration-200" style={{ transform: showFavorites ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {showFavorites && (
            <div className="p-4 bg-surface border-t border-divider">
              <div className="grid grid-cols-2 gap-3">
                {favorites.map((fav, idx) => (
                  <div key={idx} className="bg-page-bg border border-divider rounded-xl p-3">
                    {fav.video_url ? (
                      <video
                        src={proxyMediaUrl(fav.video_url)}
                        className="w-full rounded-lg bg-page-bg mb-2"
                        controls muted playsInline
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                      />
                    ) : null}
                    <div
                      className="w-full bg-brand-soft rounded-lg p-2 text-sm text-ink leading-relaxed mb-2"
                      style={{ display: fav.video_url ? 'none' : 'flex' }}
                    >
                      {fav.description || '수어 동작 설명 없음'}
                    </div>
                    {fav.noun_image_url && (
                      <div className="flex items-center gap-2 p-2 bg-brand-soft rounded-lg mb-2">
                        <img src={fav.noun_image_url} alt={fav.word} className="w-10 h-10 object-cover rounded" onError={(e) => { e.target.parentElement.style.display = 'none' }} />
                        <span className="text-xs text-ink-muted">'{fav.word}' 뜻 이미지</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-ink text-sm">{fav.word}</p>
                      <button onClick={() => toggleFavorite(fav)} className="text-accent text-lg" title="즐겨찾기 해제">⭐</button>
                    </div>
                    <button
                      onClick={() => handleSelectWord(fav)}
                      className="w-full bg-brand text-white py-1.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
                    >
                      선택
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {/* 수어 후보 카드 목록 */}
      {candidates.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-ink mb-3">
            수어 후보 목록{' '}
            <span className="text-sm font-normal text-ink-muted">
              ({candidates.length}개 — 올바른 수어를 선택하세요)
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {candidates.map((item, idx) => (
              <div
                key={idx}
                className="border border-divider rounded-xl p-4 bg-surface shadow-sm hover:shadow-md transition-shadow"
              >
                {item.video_url ? (
                  <video
                    src={proxyMediaUrl(item.video_url)}
                    className="w-full rounded-lg bg-page-bg"
                    controls
                    muted
                    playsInline
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className="w-full bg-page-bg rounded-lg p-3 text-sm text-ink leading-relaxed"
                  style={{ display: item.video_url ? 'none' : 'flex' }}
                >
                  {item.description || '수어 동작 영상을 불러올 수 없습니다.'}
                </div>

                {nounImages[`${item.word}__${idx}`] && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-brand-soft rounded-lg">
                    <img
                      src={nounImages[`${item.word}__${idx}`]}
                      alt={item.word}
                      className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    <span className="text-xs text-ink-muted leading-tight">
                      '{item.word}' 뜻 이미지
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 mb-1">
                  <p className="font-semibold text-ink">{item.word}</p>
                  <button
                    onClick={() => toggleFavorite(item, nounImages[`${item.word}__${idx}`])}
                    className={`text-xl transition-transform hover:scale-110 ${isFavorite(item.word) ? 'text-accent' : 'text-ink-muted hover:text-accent'}`}
                    title={isFavorite(item.word) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                  >
                    {isFavorite(item.word) ? '⭐' : '☆'}
                  </button>
                </div>

                {item.synonyms?.length > 0 && (
                  <p className="text-xs text-ink-muted text-center mb-1">
                    = {item.synonyms.join(' / ')}
                  </p>
                )}
                {item.category && (
                  <p className="text-xs text-brand text-center mb-2">[{item.category}]</p>
                )}
                <button
                  onClick={() => handleSelectWord(item)}
                  className="w-full bg-brand text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
                >
                  선택
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {candidates.length === 0 && !loading && query && (
        <p className="text-center text-ink-muted py-4">검색 결과가 없습니다.</p>
      )}

      {/* 선택된 단어 시퀀스 */}
      {selectedItems.length > 0 && (
        <div className="bg-brand-soft rounded-xl p-4 border border-divider">
          <h3 className="text-base font-semibold text-ink mb-3">선택된 단어 순서</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedItems.map((item, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 bg-brand text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                {item.word}
                <button
                  onClick={() => handleRemoveWord(idx)}
                  className="hover:text-brand-soft transition-colors ml-1 text-xs"
                  aria-label="제거"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="w-full bg-brand text-white py-3 rounded-xl font-bold text-lg hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            이 수어로 문장 만들기
          </button>
        </div>
      )}

      {/* 번역 결과 카드 */}
      {translationResult && (
        <div className="bg-surface border border-divider rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-semibold text-ink mb-3">선택된 수어 동작</h3>
            <div className="grid grid-cols-2 gap-3">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="bg-page-bg rounded-xl p-3">
                  <p className="font-semibold text-ink text-center mb-2">{item.word}</p>
                  {item.video_url ? (
                    <video
                      src={proxyMediaUrl(item.video_url)}
                      className="w-full rounded-lg bg-page-bg"
                      controls
                      muted
                      playsInline
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                  ) : null}
                  <div
                    className="text-sm text-ink leading-relaxed p-2 bg-brand-soft rounded-lg"
                    style={{ display: item.video_url ? 'none' : 'block' }}
                  >
                    {item.description || '수어 동작 설명 없음'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-divider pt-4">
            <h3 className="text-base font-semibold text-ink-muted mb-2">번역 결과</h3>
            <p className="text-xl text-ink leading-relaxed mb-4">{translationResult}</p>
            <button
              onClick={handleCopy}
              className="bg-brand-soft text-ink px-4 py-2 rounded-lg text-sm font-medium hover:bg-divider transition-colors"
            >
              {copied ? '복사됨 ✓' : '클립보드에 복사'}
            </button>
          </div>
        </div>
      )}

      <SubtitleDisplay text={translationResult} />
    </div>
  )
}
