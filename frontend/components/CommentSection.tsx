'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useTokenFactory, useTokenComments } from '@/lib/hooks'
import { formatAddress, formatTimeAgo } from '@/lib/utils'
import { Send, Loader2, MessageCircle } from 'lucide-react'

interface CommentSectionProps {
  tokenAddress: `0x${string}`
}

export function CommentSection({ tokenAddress }: CommentSectionProps) {
  const [message, setMessage] = useState('')
  const { address, isConnected } = useAccount()
  const { addComment, isPending, isConfirming } = useTokenFactory()
  const { data: comments, isLoading } = useTokenComments(tokenAddress)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !address) return

    try {
      await addComment(tokenAddress, message)
      setMessage('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  const isSubmitting = isPending || isConfirming

  return (
    <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5" />
        <h2 className="text-xl font-bold">Comments</h2>
        <span className="text-sm text-gray-400">({comments?.length || 0})</span>
      </div>

      {/* Comment Form */}
      {isConnected ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a comment..."
              maxLength={500}
              className="flex-1 bg-background-start border border-primary/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!message.trim() || isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {message.length}/500
          </div>
        </form>
      ) : (
        <div className="mb-6 text-center py-4 bg-background-start border border-primary/20 rounded-lg">
          <p className="text-gray-400">Connect your wallet to comment</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div
              key={index}
              className="bg-background-start border border-primary/20 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-primary">
                  {formatAddress(comment.author)}
                </div>
                <div className="text-xs text-gray-400">
                  {formatTimeAgo(Number(comment.timestamp))}
                </div>
              </div>
              <p className="text-gray-300">{comment.message}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  )
}
