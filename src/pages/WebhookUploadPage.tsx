import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle2, XCircle } from "lucide-react";
import { uploadFileToN8n } from "@/services/n8nService";

const WebhookUploadPage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputId = "webhook-file-input";
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; message: string }>(null);
  const webhookUrl = (import.meta as any).env?.VITE_N8N_WEBHOOK_URL || "https://dochub.app.n8n.cloud/webhook-test/upload";


  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    setIsUploading(true);
    setResult(null);

    try {
      const nowIso = new Date().toISOString();
      const uploads = await Promise.all(
        files.map(f => uploadFileToN8n(f, { uploadedAt: nowIso }))
      );
      const allOk = uploads.every(u => u.success);
      if (allOk) {
        setResult({ ok: true, message: `Uploaded ${files.length} file(s) successfully.` });
      } else {
        const firstErr = uploads.find(u => !u.success)?.error || 'Upload failed';
        setResult({ ok: false, message: firstErr });
      }
    } catch (err) {
      setResult({ ok: false, message: (err as Error).message });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Webhook Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select files to send to the configured n8n webhook.
          </p>
          <div className="text-xs text-muted-foreground -mt-2">
            Endpoint: <code className="text-foreground break-all">{webhookUrl}</code>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild disabled={isUploading}>
              <label htmlFor={inputId} className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" /> Choose Files
              </label>
            </Button>
            <Input
              id={inputId}
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.xlsx,.ppt,.pptx,image/*,text/plain,application/json"
              onChange={handleChange}
            />
            {isUploading && <span className="text-sm text-muted-foreground">Uploading…</span>}
          </div>

          {result && (
            <div className={`flex items-center gap-2 text-sm ${result.ok ? 'text-green-600' : 'text-red-600'}`}>
              {result.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <span>{result.message}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookUploadPage;


