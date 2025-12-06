import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export function useDocuments(itineraryId?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!itineraryId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('itinerary_id', itineraryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data as Document[]);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${itineraryId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('trip-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('trip-documents')
        .getPublicUrl(fileName);

      // Create document record
      const { data: document, error: insertError } = await supabase
        .from('documents')
        .insert({
          itinerary_id: itineraryId,
          user_id: user.id,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_url: publicUrl,
          document_type: documentType,
          ocr_status: 'pending',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast.success('Document uploaded successfully');
      
      // Update local state
      setDocuments(prev => [document as Document, ...prev]);
      
      return document as Document;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const processDocumentOCR = useCallback(async (documentId: string, file?: File): Promise<boolean> => {
    setIsProcessing(true);
    
    try {
      const doc = documents.find(d => d.id === documentId);
      if (!doc) throw new Error('Document not found');

      let fileBase64: string | undefined;
      
      // Convert file to base64 if provided
      if (file) {
        fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const { data, error } = await supabase.functions.invoke('process-document-ocr', {
        body: {
          documentId,
          fileUrl: doc.file_url,
          documentType: doc.document_type,
          fileBase64,
        },
      });

      if (error) throw error;

      // Refresh documents to get updated OCR data
      await fetchDocuments();
      
      if (data.success) {
        toast.success(`Document processed with ${data.confidence}% confidence`);
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
  }, [documents, fetchDocuments]);

  const deleteDocument = useCallback(async (documentId: string): Promise<boolean> => {
    try {
      const doc = documents.find(d => d.id === documentId);
      if (!doc) throw new Error('Document not found');

      // Delete from storage
      const filePath = doc.file_url.split('/trip-documents/')[1];
      if (filePath) {
        await supabase.storage.from('trip-documents').remove([filePath]);
      }

      // Delete record
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      setDocuments(prev => prev.filter(d => d.id !== documentId));
      toast.success('Document deleted');
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
      return false;
    }
  }, [documents]);

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
