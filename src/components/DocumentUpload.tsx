import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, FileText, Plane, Hotel, Camera, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  onBack: () => void;
  onSave: (details: BookingDetails) => void;
  itemType: 'flight' | 'hotel' | 'activity' | 'restaurant';
  itemTitle: string;
}

export interface BookingDetails {
  id: string;
  type: 'flight' | 'hotel' | 'activity' | 'restaurant';
  title: string;
  provider: string;
  bookingReference: string;
  cost: number;
  details: string;
  documentUrl?: string;
  confirmationNumber?: string;
  checkIn?: string;
  checkOut?: string;
  flightNumber?: string;
  departure?: string;
  arrival?: string;
  notes?: string;
}

export function DocumentUpload({ onBack, onSave, itemType, itemTitle }: DocumentUploadProps) {
  const { toast } = useToast();
  const [details, setDetails] = useState<Partial<BookingDetails>>({
    type: itemType,
    title: itemTitle,
    provider: '',
    bookingReference: '',
    cost: 0,
    details: '',
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server
      const mockUrl = URL.createObjectURL(file);
      setDetails(prev => ({ ...prev, documentUrl: mockUrl }));
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully",
      });
    }
  };

  const handleSave = () => {
    if (!details.provider || !details.bookingReference || !details.cost) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const bookingDetails: BookingDetails = {
      id: Date.now().toString(),
      type: itemType,
      title: itemTitle,
      provider: details.provider || '',
      bookingReference: details.bookingReference || '',
      cost: details.cost || 0,
      details: details.details || '',
      documentUrl: details.documentUrl,
      confirmationNumber: details.confirmationNumber,
      checkIn: details.checkIn,
      checkOut: details.checkOut,
      flightNumber: details.flightNumber,
      departure: details.departure,
      arrival: details.arrival,
      notes: details.notes,
    };

    onSave(bookingDetails);
    toast({
      title: "Details saved",
      description: "Your booking details have been saved successfully",
    });
  };

  const getIcon = () => {
    switch (itemType) {
      case 'flight': return Plane;
      case 'hotel': return Hotel;
      case 'activity': return Camera;
      case 'restaurant': return Utensils;
    }
  };

  const Icon = getIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky/10 to-sand/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-soft border-b border-border/50 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <div>
              <h1 className="font-bold text-lg text-deep-blue">Add Details</h1>
              <p className="text-sm text-muted-foreground">{itemTitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Document Upload */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              <Upload className="h-5 w-5 text-primary" />
              Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
              <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-3">
                Upload your e-ticket, booking confirmation, or receipt
              </p>
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="document-upload"
              />
              <Label
                htmlFor="document-upload"
                className="cursor-pointer inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Label>
              {details.documentUrl && (
                <p className="text-sm text-mint mt-2">✓ Document uploaded</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-deep-blue">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-deep-blue font-medium">Provider/Company *</Label>
              <Input
                placeholder="e.g., Air India, Marriott, Local Tour Guide"
                value={details.provider}
                onChange={(e) => setDetails(prev => ({ ...prev, provider: e.target.value }))}
                className="mt-2 bg-white/70 border-border/50"
              />
            </div>
            <div>
              <Label className="text-deep-blue font-medium">Booking Reference *</Label>
              <Input
                placeholder="e.g., PNR, Booking ID, Confirmation Number"
                value={details.bookingReference}
                onChange={(e) => setDetails(prev => ({ ...prev, bookingReference: e.target.value }))}
                className="mt-2 bg-white/70 border-border/50"
              />
            </div>
            <div>
              <Label className="text-deep-blue font-medium">Cost (INR) *</Label>
              <Input
                type="number"
                placeholder="Enter cost in INR"
                value={details.cost}
                onChange={(e) => setDetails(prev => ({ ...prev, cost: Number(e.target.value) }))}
                className="mt-2 bg-white/70 border-border/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Specific Details */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-deep-blue">Specific Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {itemType === 'flight' && (
              <>
                <div>
                  <Label className="text-deep-blue font-medium">Flight Number</Label>
                  <Input
                    placeholder="e.g., AI101"
                    value={details.flightNumber}
                    onChange={(e) => setDetails(prev => ({ ...prev, flightNumber: e.target.value }))}
                    className="mt-2 bg-white/70 border-border/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-deep-blue font-medium">Departure</Label>
                    <Input
                      placeholder="e.g., DEL 14:30"
                      value={details.departure}
                      onChange={(e) => setDetails(prev => ({ ...prev, departure: e.target.value }))}
                      className="mt-2 bg-white/70 border-border/50"
                    />
                  </div>
                  <div>
                    <Label className="text-deep-blue font-medium">Arrival</Label>
                    <Input
                      placeholder="e.g., BOM 16:45"
                      value={details.arrival}
                      onChange={(e) => setDetails(prev => ({ ...prev, arrival: e.target.value }))}
                      className="mt-2 bg-white/70 border-border/50"
                    />
                  </div>
                </div>
              </>
            )}
            
            {itemType === 'hotel' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-deep-blue font-medium">Check-in</Label>
                    <Input
                      type="datetime-local"
                      value={details.checkIn}
                      onChange={(e) => setDetails(prev => ({ ...prev, checkIn: e.target.value }))}
                      className="mt-2 bg-white/70 border-border/50"
                    />
                  </div>
                  <div>
                    <Label className="text-deep-blue font-medium">Check-out</Label>
                    <Input
                      type="datetime-local"
                      value={details.checkOut}
                      onChange={(e) => setDetails(prev => ({ ...prev, checkOut: e.target.value }))}
                      className="mt-2 bg-white/70 border-border/50"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <Label className="text-deep-blue font-medium">Additional Notes</Label>
              <Textarea
                placeholder="Any additional details or special instructions..."
                value={details.notes}
                onChange={(e) => setDetails(prev => ({ ...prev, notes: e.target.value }))}
                className="mt-2 bg-white/70 border-border/50"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border/50 p-4 z-10">
        <Button 
          onClick={handleSave}
          className="w-full h-12"
          variant="premium"
          size="lg"
        >
          Save Details
        </Button>
      </div>
    </div>
  );
}