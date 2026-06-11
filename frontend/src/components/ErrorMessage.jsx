export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-4 text-center">
      {message || '오류가 발생했습니다. 다시 시도해주세요.'}
    </div>
  )
}
