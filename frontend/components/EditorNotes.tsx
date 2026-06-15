import { AlertCircle, PenTool, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface Props {
  article: any
  showInternally?: boolean
}

export function EditorNotes({ article, showInternally = false }: Props) {
  const hasEditorContent =
    article.editorNotes ||
    article.correctionsApplied?.length > 0 ||
    article.reviewedBy ||
    article.linkedFactChecks?.length > 0

  if (!hasEditorContent) return null

  return (
    <div className="mt-12 pt-8 border-t-2 border-gold/30 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <PenTool size={20} className="text-gold" />
        <h2 className="text-xl font-bold text-ink">Editorial Information</h2>
      </div>

      {/* Corrections Applied */}
      {article.correctionsApplied && article.correctionsApplied.length > 0 && (
        <div>
          <h3 className="font-semibold text-ink mb-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600" />
            Corrections & Updates
          </h3>
          <ul className="space-y-2.5">
            {article.correctionsApplied.map((correction: any, i: number) => (
              <li key={i} className="bg-amber-50 border-l-4 border-amber-600 p-3 rounded-r">
                <p className="text-xs text-amber-700 font-semibold mb-1">
                  {format(new Date(correction.date), 'd MMMM yyyy, h:mm a')}
                </p>
                <p className="text-sm text-amber-900">{correction.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Editor Review Info */}
      {article.reviewedBy && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-blue-600" />
            <h3 className="font-semibold text-blue-900">Editorial Review</h3>
          </div>
          <p className="text-sm text-blue-800">
            Reviewed by <strong>{article.reviewedBy.name}</strong>
            {article.reviewedBy.role && ` (${article.reviewedBy.role})`}
          </p>
          {article.updatedAt && (
            <p className="text-xs text-blue-700 mt-1">
              Last updated {format(new Date(article.updatedAt), 'd MMMM yyyy, h:mm a')}
            </p>
          )}
        </div>
      )}

      {/* Editor Notes - Internal only */}
      {showInternally && article.editorNotes && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-purple-600 rounded-full"></span>
            Internal Editor Notes
          </h3>
          <p className="text-sm text-purple-800 whitespace-pre-wrap">{article.editorNotes}</p>
          <p className="text-xs text-purple-700 mt-2 italic">(Only visible to editors)</p>
        </div>
      )}

      {/* Article Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-gray-50 rounded-lg p-4">
        {article.wordCount && (
          <div>
            <p className="text-gray-600">Word Count</p>
            <p className="font-semibold text-gray-900">{article.wordCount}</p>
          </div>
        )}
        {article.contentType && (
          <div>
            <p className="text-gray-600">Type</p>
            <p className="font-semibold text-gray-900 capitalize">{article.contentType}</p>
          </div>
        )}
        {article.readingTime && (
          <div>
            <p className="text-gray-600">Reading Time</p>
            <p className="font-semibold text-gray-900">{article.readingTime} min</p>
          </div>
        )}
        <div>
          <p className="text-gray-600">Published</p>
          <p className="font-semibold text-gray-900">
            {format(new Date(article.publishedAt), 'd MMM yyyy')}
          </p>
        </div>
        {article.sourcesUsed?.length > 0 && (
          <div>
            <p className="text-gray-600">Sources</p>
            <p className="font-semibold text-gray-900">{article.sourcesUsed.length}</p>
          </div>
        )}
        {article.linkedFactChecks?.length > 0 && (
          <div>
            <p className="text-gray-600">Fact-Checks</p>
            <p className="font-semibold text-gray-900">{article.linkedFactChecks.length}</p>
          </div>
        )}
      </div>
    </div>
  )
}
