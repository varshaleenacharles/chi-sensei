import { useState } from "react";
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
  onAddComment: (documentId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
}

const CommentThread = ({ documentId, comments, userRole, userDepartment, onAddComment }: CommentThreadProps) => {
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

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
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide' : 'Show'}
          </Button>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-muted pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`text-xs ${getDepartmentColor(comment.departmentName)}`}>
                    {comment.departmentName}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {comment.author} • {comment.timestamp}
                  </span>
                </div>
                <p className="text-sm text-foreground">{comment.message}</p>
              </div>
            ))}
            
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                No comments yet. Start the conversation!
              </p>
            )}
          </div>

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
        </CardContent>
      )}
    </Card>
  );
};

export default CommentThread;