import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send } from "lucide-react";
import { Comment } from "./DocumentCard";

interface CommentThreadProps {
  documentId: string;
  comments: Comment[];
  userRole: string;
  userDepartment: string;
  allowedDepartments?: string[];
  commentsResolved?: boolean;
  onAddComment: (documentId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  onResolve?: (documentId: string) => void;
  onReply?: (documentId: string, parentId: string, message: string, userRole: string, userDepartment: string) => void;
}

const CommentThread = ({ documentId, comments, userRole, userDepartment, allowedDepartments = [], commentsResolved = false, onAddComment, onResolve, onReply }: CommentThreadProps) => {
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const canView = allowedDepartments.length === 0 || allowedDepartments.includes(userDepartment);
  const canPost = canView && !commentsResolved;
  const isManagerOrDirector = /Manager|Director|System Admin/i.test(userRole);

  const commentsByParent = useMemo(() => {
    const roots: Comment[] = [];
    const children: Record<string, Comment[]> = {};
    for (const c of comments) {
      if (c.parentId) {
        if (!children[c.parentId]) children[c.parentId] = [];
        children[c.parentId].push(c);
      } else {
        roots.push(c);
      }
    }
    return { roots, children };
  }, [comments]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      departmentName: userDepartment,
      author: `${userRole} (${userDepartment})`,
      message: newComment.trim()
    };

    onAddComment(documentId, comment);
    setNewComment("");
  };

  const handleSubmitReply = () => {
    if (!replyToId || !replyText.trim() || !onReply) return;
    onReply(documentId, replyToId, replyText.trim(), userRole, userDepartment);
    setReplyText("");
    setReplyToId(null);
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      'Finance': 'bg-finance text-white',
      'Projects': 'bg-projects text-white', 
      'Systems & Operations': 'bg-systems text-white',
      'Legal': 'bg-legal text-white',
      'Health & Safety': 'bg-safety text-white'
    };
    return colors[department as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">Inter-Departmental Comments</span>
            <Badge variant="secondary" className="text-xs">
              {comments.length}
            </Badge>
            {commentsResolved && (
              <Badge className="text-xs bg-status-completed text-white">Resolved</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isManagerOrDirector && !commentsResolved && canView && onResolve && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResolve(documentId)}
              >
                Resolve
              </Button>
            )}
            <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide' : 'Show'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3 mb-4">
            {canView ? (
              commentsByParent.roots.map((comment) => (
                <div key={comment.id} className="border-l-2 border-muted pl-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getDepartmentColor(comment.departmentName)}`}>
                        {comment.departmentName}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {comment.author} • {comment.timestamp}
                      </span>
                    </div>
                    {isManagerOrDirector && !commentsResolved && canView && (
                      <Button size="sm" variant="ghost" onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}>
                        {replyToId === comment.id ? 'Cancel' : 'Reply'}
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{comment.message}</p>
                  {!!commentsByParent.children[comment.id]?.length && (
                    <div className="mt-2 space-y-2">
                      {commentsByParent.children[comment.id].map(child => (
                        <div key={child.id} className="ml-4 border-l-2 border-muted pl-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`text-xs ${getDepartmentColor(child.departmentName)}`}>
                              {child.departmentName}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {child.author} • {child.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{child.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {replyToId === comment.id && (
                    <div className="mt-2 space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="min-h-[60px]"
                      />
                      <div className="flex justify-end">
                        <Button size="sm" onClick={handleSubmitReply} disabled={!replyText.trim()}>
                          <Send className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                Your department is not tagged for this document.
              </p>
            )}
            
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                No comments yet. Start the conversation!
              </p>
            )}
          </div>

          {canPost && (
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment for your department..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Posting as: {userRole} ({userDepartment})
                </span>
                <Button 
                  size="sm" 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Post Comment
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default CommentThread;