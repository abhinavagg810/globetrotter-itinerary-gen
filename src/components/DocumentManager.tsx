import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, FileText, Plane, Hotel, Camera, Utensils, 
  Shield, FileCheck, Loader2, Trash2, Eye, Download,
  CheckCircle, AlertCircle, Clock, Sparkles
} from 'lucide-react';
import { useDocuments, Document, UploadDocumentParams } from '@/hooks/useDocuments';
import { useCurrency } from '@/contexts/CurrencyContext';
import { format } from 'date-fns';

interface DocumentManagerProps {
  itineraryId: string;
  tripName?: string;
}

export function DocumentManager({ itineraryId, tripName = 'Trip' }: DocumentManagerProps) {
  const {
    documents,
    isLoading,
    isUploading,
    isProcessing,
    fetchDocuments,
    uploadDocument,
    processDocumentOCR,
    deleteDocument,
    getDocumentsByType,
  } = useDocuments(itineraryId);

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<Document['document_type']>('flight');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const documentTypes: { value: Document['document_type']; label: string; icon: React.ElementType }[] = [
    { value: 'flight', label: 'Flight', icon: Plane },
    { value: 'hotel', label: 'Hotel', icon: Hotel },
    { value: 'activity', label: 'Activity', icon: Camera },
    { value: 'restaurant', label: 'Restaurant', icon: Utensils },
    { value: 'visa', label: 'Visa', icon: Shield },
    { value: 'insurance', label: 'Insurance', icon: FileCheck },
    { value: 'other', label: 'Other', icon: FileText },
  ];

  const getTypeIcon = (type: Document['document_type']) => {
    const docType = documentTypes.find(t => t.value === type);
    return docType?.icon || FileText;
  };

  const getStatusBadge = (status: Document['ocr_status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Processed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setShowUploadDialog(true);
    }
  };

  const handleUpload = async () => {
    if (!pendingFile) return;

    const doc = await uploadDocument({
      itineraryId,
      file: pendingFile,
      documentType: selectedType,
    });

    if (doc) {
      // Automatically process OCR
      await processDocumentOCR(doc.id, pendingFile);
    }

    setPendingFile(null);
    setShowUploadDialog(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(docId);
      setSelectedDocument(null);
    }
  };

  const renderExtractedData = (data: Record<string, unknown>) => {
    if (!data || Object.keys(data).length === 0) {
      return <p className="text-muted-foreground text-sm">No data extracted yet</p>;
    }

    const excludeKeys = ['confidence', 'extracted_text', 'error'];
    const entries = Object.entries(data).filter(([key]) => !excludeKeys.includes(key));

    return (
      <div className="space-y-2">
        {entries.map(([key, value]) => {
          if (value === null || value === undefined) return null;
          
          const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          return (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{formattedKey}:</span>
              <span className="font-medium text-right max-w-[60%] truncate">
                {typeof value === 'object' ? JSON.stringify(value) : String(value as string | number | boolean)}
              </span>
            </div>
          );
        })}
        
        {data.confidence !== undefined && (
          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">OCR Confidence:</span>
              <span className="font-medium">{String(data.confidence)}%</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-deep-blue">
              <FileText className="h-5 w-5 text-primary" />
              <span>Documents</span>
              <Badge variant="secondary">{documents.length}</Badge>
            </div>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Upload
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No documents uploaded yet</p>
              <p className="text-sm">Upload flight tickets, hotel bookings, and more</p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-9">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="flight" className="text-xs">Flights</TabsTrigger>
                <TabsTrigger value="hotel" className="text-xs">Hotels</TabsTrigger>
                <TabsTrigger value="other" className="text-xs">Other</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {documents.map(doc => {
                      const Icon = getTypeIcon(doc.document_type);
                      return (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDocument(doc)}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/70 hover:bg-white/90 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-deep-blue text-sm truncate">{doc.file_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {getStatusBadge(doc.ocr_status)}
                                {doc.amount && (
                                  <span className="text-xs text-muted-foreground">
                                    {formatPrice(doc.amount)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="flight" className="mt-4">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {getDocumentsByType('flight').map(doc => {
                      const Icon = getTypeIcon(doc.document_type);
                      return (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDocument(doc)}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/70 hover:bg-white/90 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-deep-blue text-sm truncate">{doc.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.provider_name || 'Flight document'}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(doc.ocr_status)}
                        </div>
                      );
                    })}
                    {getDocumentsByType('flight').length === 0 && (
                      <p className="text-center py-4 text-muted-foreground text-sm">No flight documents</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="hotel" className="mt-4">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {getDocumentsByType('hotel').map(doc => {
                      const Icon = getTypeIcon(doc.document_type);
                      return (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDocument(doc)}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/70 hover:bg-white/90 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-deep-blue text-sm truncate">{doc.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.provider_name || 'Hotel document'}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(doc.ocr_status)}
                        </div>
                      );
                    })}
                    {getDocumentsByType('hotel').length === 0 && (
                      <p className="text-center py-4 text-muted-foreground text-sm">No hotel documents</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="other" className="mt-4">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {documents
                      .filter(d => !['flight', 'hotel'].includes(d.document_type))
                      .map(doc => {
                        const Icon = getTypeIcon(doc.document_type);
                        return (
                          <div
                            key={doc.id}
                            onClick={() => setSelectedDocument(doc)}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/70 hover:bg-white/90 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-deep-blue text-sm truncate">{doc.file_name}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {doc.document_type}
                                </p>
                              </div>
                            </div>
                            {getStatusBadge(doc.ocr_status)}
                          </div>
                        );
                      })}
                    {documents.filter(d => !['flight', 'hotel'].includes(d.document_type)).length === 0 && (
                      <p className="text-center py-4 text-muted-foreground text-sm">No other documents</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Selected File</p>
              <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm truncate">{pendingFile?.name}</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Document Type</p>
              <Select value={selectedType} onValueChange={(v) => setSelectedType(v as Document['document_type'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-primary/5 rounded-lg">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary">AI-Powered OCR</p>
                  <p className="text-xs text-muted-foreground">
                    We'll automatically extract booking details from your document
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                className="flex-1"
                disabled={isUploading || isProcessing}
              >
                {(isUploading || isProcessing) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Upload & Process
              </Button>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Detail Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedDocument && (() => {
                const Icon = getTypeIcon(selectedDocument.document_type);
                return <Icon className="h-5 w-5 text-primary" />;
              })()}
              Document Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-4">
              {/* File Info */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium truncate">{selectedDocument.file_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="capitalize">
                    {selectedDocument.document_type}
                  </Badge>
                  {getStatusBadge(selectedDocument.ocr_status)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Uploaded {format(new Date(selectedDocument.created_at), 'PPp')}
                </p>
              </div>

              {/* Extracted Data */}
              <div>
                <p className="text-sm font-medium mb-2">Extracted Information</p>
                <div className="p-3 bg-white/70 rounded-lg">
                  {renderExtractedData(selectedDocument.extracted_data)}
                </div>
              </div>

              {/* Quick Info */}
              {(selectedDocument.booking_reference || selectedDocument.amount) && (
                <div className="grid grid-cols-2 gap-3">
                  {selectedDocument.booking_reference && (
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">Reference</p>
                      <p className="font-medium">{selectedDocument.booking_reference}</p>
                    </div>
                  )}
                  {selectedDocument.amount && (
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-medium">
                        {formatPrice(selectedDocument.amount)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(selectedDocument.file_url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                {selectedDocument.ocr_status !== 'completed' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => processDocumentOCR(selectedDocument.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Process OCR
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(selectedDocument.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
