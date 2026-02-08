import { useState } from 'react';
import { useGetDiscussions, useCreateDiscussion, useAddDiscussionReply } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MessageSquare, Plus, Send, User } from 'lucide-react';
import type { DiscussionPost } from '../../backend';

export default function CommunityTab() {
  const { data: discussions, isLoading } = useGetDiscussions();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<DiscussionPost | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-full" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Community Board</h2>
            <p className="text-muted-foreground">
              Share ideas, resources, and tips with fellow designers
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Discussion
          </Button>
        </div>

        <div className="grid gap-4">
          <img 
            src="/assets/generated/community-board.dim_800x500.jpg" 
            alt="Community collaboration"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        {!discussions || discussions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Discussions Yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to start a conversation!
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Start a Discussion
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {discussions.map((post) => (
              <DiscussionCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateDiscussionModal onClose={() => setShowCreateModal(false)} />
      )}

      {selectedPost && (
        <DiscussionDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}

function DiscussionCard({ post, onClick }: { post: DiscussionPost; onClick: () => void }) {
  const createdDate = new Date(Number(post.createdAt) / 1000000);

  return (
    <Card className="hover-lift cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
            <CardDescription className="line-clamp-2">{post.content}</CardDescription>
          </div>
          <Badge variant="secondary">
            {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{post.author.toString().slice(0, 8)}...</span>
          <span>•</span>
          <span>{createdDate.toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateDiscussionModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { mutate: createDiscussion, isPending } = useCreateDiscussion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      createDiscussion(
        { title: title.trim(), content: content.trim() },
        { onSuccess: onClose }
      );
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
          <DialogDescription>
            Share your ideas, questions, or resources with the community
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What's your discussion about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, questions, or resources..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim() || isPending}>
              {isPending ? 'Creating...' : 'Create Discussion'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DiscussionDetailModal({ post, onClose }: { post: DiscussionPost; onClose: () => void }) {
  const [replyContent, setReplyContent] = useState('');
  const { mutate: addReply, isPending } = useAddDiscussionReply();
  const { identity } = useInternetIdentity();
  const createdDate = new Date(Number(post.createdAt) / 1000000);

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      addReply(
        { postId: post.id, content: replyContent.trim() },
        {
          onSuccess: () => {
            setReplyContent('');
          }
        }
      );
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{post.title}</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <User className="h-4 w-4" />
            <span>{post.author.toString().slice(0, 8)}...</span>
            <span>•</span>
            <span>{createdDate.toLocaleDateString()}</span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground">{post.content}</p>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-lg">
              Replies ({post.replies.length})
            </h3>

            {post.replies.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No replies yet. Be the first to respond!
              </p>
            ) : (
              <div className="space-y-4">
                {post.replies.map((reply, idx) => {
                  const replyDate = new Date(Number(reply.createdAt) / 1000000);
                  return (
                    <Card key={idx}>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <User className="h-4 w-4" />
                          <span>{reply.author.toString().slice(0, 8)}...</span>
                          <span>•</span>
                          <span>{replyDate.toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm">{reply.content}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <form onSubmit={handleReply} className="border-t pt-6 space-y-4">
            <Label htmlFor="reply">Add a Reply</Label>
            <Textarea
              id="reply"
              placeholder="Share your thoughts..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
            />
            <Button type="submit" disabled={!replyContent.trim() || isPending}>
              <Send className="mr-2 h-4 w-4" />
              {isPending ? 'Sending...' : 'Send Reply'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
