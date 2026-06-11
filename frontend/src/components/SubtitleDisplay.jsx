export default function SubtitleDisplay({ text }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-white text-center p-5 min-h-16">
      <p className="text-2xl font-semibold leading-relaxed">
        {text || '번역 결과가 여기에 표시됩니다'}
      </p>
    </div>
  )
}
