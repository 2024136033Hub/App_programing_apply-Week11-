import { useRef, useState, useEffect, useCallback } from 'react'
import SubtitleDisplay from '../components/SubtitleDisplay'
import LoadingSpinner from '../components/LoadingSpinner'
import { recognizeFrame, translateWords, addHistory } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const CAPTURE_INTERVAL_MS = 3000

export default function WebcamPage() {
  const { user, getToken } = useAuth()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const intervalRef = useRef(null)
  const isRecognizingRef = useRef(false)

  const [isOn, setIsOn] = useState(false)
  const [error, setError] = useState('')
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [recognizedWords, setRecognizedWords] = useState([])
  const [lastWord, setLastWord] = useState('')
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [translationResult, setTranslationResult] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)

  const captureAndRecognize = useCallback(async () => {
    if (isRecognizingRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState < 2) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)

    const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]

    isRecognizingRef.current = true
    setIsRecognizing(true)
    try {
      const data = await recognizeFrame(base64)
      if (data.word) {
        setLastWord(data.word)
        setRecognizedWords((prev) => [...prev, data.word])
        setError('')
      }
    } catch (err) {
      setError(`프레임 인식 오류: ${err.message}`)
    } finally {
      isRecognizingRef.current = false
      setIsRecognizing(false)
    }
  }, [])

  const startCamera = useCallback(async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setIsOn(true)
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionDenied(true)
        setError('카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 접근을 허용해 주세요.')
      } else if (err.name === 'NotFoundError') {
        setError('카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해 주세요.')
      } else {
        setError('카메라를 시작할 수 없습니다. 잠시 후 다시 시도해 주세요.')
      }
    }
  }, [])

  const stopCamera = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    isRecognizingRef.current = false
    setIsOn(false)
    setIsRecognizing(false)
    setLastWord('')
  }, [])

  useEffect(() => {
    if (isOn) {
      intervalRef.current = setInterval(captureAndRecognize, CAPTURE_INTERVAL_MS)
    }
    return () => clearInterval(intervalRef.current)
  }, [isOn, captureAndRecognize])

  useEffect(() => () => stopCamera(), [stopCamera])

  const handleRemoveWord = (index) => {
    setRecognizedWords((prev) => prev.filter((_, i) => i !== index))
  }

  const handleTranslate = async () => {
    if (recognizedWords.length === 0) return
    setIsTranslating(true)
    setError('')
    try {
      const data = await translateWords(recognizedWords)
      setTranslationResult(data.result)
      if (user) {
        addHistory(
          { translation_type: 'webcam', input_words: JSON.stringify(recognizedWords), result: data.result },
          getToken()
        ).catch(() => {})
      }
    } catch {
      setError('번역 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleReset = () => {
    setRecognizedWords([])
    setTranslationResult('')
    setLastWord('')
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translationResult)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-36">
      <h2 className="text-2xl font-bold text-ink">웹캠 실시간 번역</h2>
      <p className="text-ink-muted text-sm">
        카메라 앞에서 수어 동작을 취하면 Gemini AI가 3초마다 인식하여 한국어 문장으로 번역합니다.
      </p>

      {/* 웹캠 뷰 */}
      <div className="relative w-full aspect-video bg-ink rounded-2xl overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isOn ? 'block' : 'hidden'}`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {!isOn && (
          <div className="text-center space-y-3">
            <span className="text-6xl">📷</span>
            <p className="text-lg font-medium text-brand-soft">
              {permissionDenied ? '카메라 권한 필요' : '카메라 꺼짐'}
            </p>
            {!permissionDenied && (
              <p className="text-sm text-ink-muted">아래 버튼으로 카메라를 켜세요</p>
            )}
          </div>
        )}

        {isOn && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
            {isRecognizing ? (
              <>
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                인식 중...
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                감지 대기 중
              </>
            )}
          </div>
        )}

        {isOn && lastWord && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <div className="bg-brand/80 text-white px-4 py-2 rounded-full text-sm font-semibold">
              인식: {lastWord}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="flex justify-center gap-3">
        {isOn ? (
          <button
            onClick={stopCamera}
            className="bg-red-500 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-red-600 transition-colors"
          >
            카메라 끄기
          </button>
        ) : (
          <button
            onClick={startCamera}
            disabled={permissionDenied}
            className="bg-brand text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            카메라 켜기
          </button>
        )}
        {recognizedWords.length > 0 && (
          <button
            onClick={handleReset}
            className="bg-surface border border-divider text-ink px-5 py-3 rounded-xl font-semibold hover:bg-page-bg transition-colors"
          >
            초기화
          </button>
        )}
      </div>

      {/* 인식된 단어 시퀀스 */}
      {recognizedWords.length > 0 && (
        <div className="bg-brand-soft rounded-xl p-4 border border-divider">
          <h3 className="text-base font-semibold text-ink mb-3">
            인식된 수어 단어{' '}
            <span className="text-sm font-normal text-ink-muted">
              (잘못 인식된 단어는 ✕로 제거하세요)
            </span>
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {recognizedWords.map((word, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 bg-brand text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                {word}
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
            disabled={isTranslating}
            className="w-full bg-brand text-white py-3 rounded-xl font-bold text-lg hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {isTranslating ? '번역 중...' : '이 수어로 문장 만들기'}
          </button>
          {isTranslating && <LoadingSpinner />}
        </div>
      )}

      {/* 번역 결과 */}
      {translationResult && (
        <div className="bg-surface border border-divider rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-semibold text-ink-muted mb-2">번역 결과</h3>
          <p className="text-xl text-ink leading-relaxed mb-4">{translationResult}</p>
          <button
            onClick={handleCopy}
            className="bg-brand-soft text-ink px-4 py-2 rounded-lg text-sm font-medium hover:bg-divider transition-colors"
          >
            {copied ? '복사됨 ✓' : '클립보드에 복사'}
          </button>
        </div>
      )}

      <SubtitleDisplay text={translationResult} />
    </div>
  )
}
