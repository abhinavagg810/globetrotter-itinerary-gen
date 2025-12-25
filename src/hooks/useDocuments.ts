import { useState, useCallback } from 'react';
import { api, Document as ApiDocument } from '@/services/api';
import { toast } from 'sonner';

export interface Document {
  id: string;
  itinerary_id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  document_type: 'flight' | 'hotel' | 'activity' | 'restaurant' | 'visa' | 'insurance' | 'other';
  extracted_data: Record<string, unknown>;
  ocr_status: 'pending' | 'processing' | 'completed' | 'failed';
  ocr_confidence: number | null;
  booking_reference: string | null;
  provider_name: string | null;
  amount: number | null;
  currency: string;
  event_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface UploadDocumentParams {
  itineraryId: string;
  file: File;
  documentType: Document['document_type'];
}

// Convert API response to legacy format
const fromApiDocument = (doc: ApiDocument): Document => ({
  id: doc.id,
  itinerary_id: doc.itineraryId,
  user_id: doc.userId,
  file_name: doc.fileName,
  file_type: doc.fileType,
  file_size: doc.fileSize,
  file_url: doc.fileUrl,
  document_type: doc.documentType,
  extracted_data: doc.extractedData,
  ocr_status: doc.ocrStatus,
  ocr_confidence: doc.ocrConfidence,
  booking_reference: doc.bookingReference,
  provider_name: doc.providerName,
  amount: doc.amount,
  currency: doc.currency,
  event_date: doc.eventDate,
  created_at: doc.createdAt,
  updated_at: doc.updatedAt,
});

export function useDocuments(itineraryId?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!itineraryId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await api.getDocuments(itineraryId);

      if (error) throw new Error(error);
      setDocuments((data || []).map(fromApiDocument));
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }, [itineraryId]);

  const uploadDocument = useCallback(async ({ itineraryId, file, documentType }: UploadDocumentParams): Promise<Document | null> => {
    setIsUploading(true);
    
    try {
      const { data, error } = await api.uploadDocument(itineraryId, file, documentType);

      if (error) throw new Error(error);
      if (!data) throw new Error('Failed to upload document');

      toast.success('Document uploaded successfully');
      
      const legacyDocument = fromApiDocument(data);
      setDocuments(prev => [legacyDocument, ...prev]);
      
      return legacyDocument;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const processDocumentOCR = useCallback(async (documentId: string, _file?: File): Promise<boolean> => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await api.processDocumentOCR(documentId);

      if (error) throw new Error(error);

      if (data) {
        const legacyDocument = fromApiDocument(data);
        setDocuments(prev => prev.map(d => d.id === documentId ? legacyDocument : d));
        toast.success(`Document processed with ${data.ocrConfidence}% confidence`);
        return true;
      } else {
        toast.error('OCR processing failed');
        return false;
      }
    } catch (error) {
      console.error('Error processing document:', error);
      toast.error('Failed to process document');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const deleteDocument = useCallback(async (documentId: string): Promise<boolean> => {
    try {
      const { error } = await api.deleteDocument(documentId);

      if (error) throw new Error(error);

      setDocuments(prev => prev.filter(d => d.id !== documentId));
      toast.success('Document deleted');
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
      return false;
    }
  }, []);

  const getDocumentsByType = useCallback((type: Document['document_type']) => {
    return documents.filter(doc => doc.document_type === type);
  }, [documents]);

  return {
    documents,
    isLoading,
    isUploading,
    isProcessing,
    fetchDocuments,
    uploadDocument,
    processDocumentOCR,
    deleteDocument,
    getDocumentsByType,
  };
}
