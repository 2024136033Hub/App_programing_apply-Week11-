import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { translateWords, addHistory, proxyMediaUrl } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import SubtitleDisplay from '../components/SubtitleDisplay'

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

export default function FavoritesPage() {
  const { user, getToken } = useAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState(loadFavorites)
  const [selectedItems, setSelectedItems] = useState([])
  const [translationResult, setTranslationResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  const removeFavorite = (word) => {
    setFavorites(prev => prev.filter(f => f.word !== word))
    setSelectedItems(prev => prev.filter(i => i.word !== word))
  }

  const handleSelectWord = (item) => {
    setSelectedItems(prev => [...prev, item])
  }

  const handleRemoveSelected = (index) => {
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

  if (favorites.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <p className="text-6xl">☆</p>
        <p className="text-xl font-bold text-ink">즐겨찾기가 없습니다</p>
        <p className="text-sm text-ink-muted">
          텍스트 번역에서 수어 후보 카드의 ☆ 버튼을 눌러 즐겨찾기를 추가하세요.
        </p>
        <button
          onClick={() => navigate('/text')}
          className="inline-block bg-brand text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors"
        >
          텍스트 번역으로 이동
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-36">
      <h2 className="text-2xl font-bold text-ink">즐겨찾기</h2>
      <p className="text-ink-muted text-sm">
        자주 쓰는 수어 단어를 선택해 바로 번역할 수 있습니다.
      </p>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
      )}

      {/* 즐겨찾기 카드 목록 */}
      <div className="grid grid-cols-2 gap-3">
        {favorites.map((fav, idx) => (
          <div key={idx} className="border border-divider rounded-xl p-4 bg-surface shadow-sm">
            {fav.video_url ? (
              <video
                src={proxyMediaUrl(fav.video_url)}
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
              style={{ display: fav.video_url ? 'none' : 'flex' }}
            >
              {fav.description || '수어 동작 설명 없음'}
            </div>

            {fav.noun_image_url && (
              <div className="mt-2 flex items-center gap-2 p-2 bg-brand-soft rounded-lg">
                <img
                  src={fav.noun_image_url}
                  alt={fav.word}
                  className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                  onError={(e) => { e.target.parentElement.style.display = 'none' }}
                />
                <span className="text-xs text-ink-muted">'{fav.word}' 뜻 이미지</span>
              </div>
            )}
            <div className="flex items-center justify-between mt-3 mb-2">
              <p className="font-semibold text-ink">{fav.word}</p>
              <button
                onClick={() => removeFavorite(fav.word)}
                className="text-accent hover:text-ink-muted transition-colors text-lg"
                title="즐겨찾기 해제"
              >
                ⭐
              </button>
            </div>

            {fav.synonyms?.length > 0 && (
              <p className="text-xs text-ink-muted text-center mb-1">
                = {fav.synonyms.join(' / ')}
              </p>
            )}
            {fav.category && (
              <p className="text-xs text-brand text-center mb-2">[{fav.category}]</p>
            )}
            <button
              onClick={() => handleSelectWord(fav)}
              className="w-full bg-brand text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
            >
              선택
            </button>
          </div>
        ))}
      </div>

      {/* 선택된 단어 */}
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
                  onClick={() => handleRemoveSelected(idx)}
                  className="hover:text-brand-soft transition-colors ml-1 text-xs"
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
            {loading ? '번역 중...' : '이 수어로 문장 만들기'}
          </button>
        </div>
      )}

      {/* 번역 결과 */}
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
