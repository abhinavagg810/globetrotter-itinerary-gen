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
  address?: string;
  confirmationNumber?: string;
  checkIn?: string;
  checkOut?: string;
  flightNumber?: string;
  departure?: string;
  arrival?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  departureTime?: string;
  arrivalTime?: string;
  notes?: string;
  // Restaurant specific fields
  restaurantName?: string;
  billUrl?: string;
  totalBill?: number;
  currency?: string;
  dateTime?: string;
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
    // Validate required fields based on item type
    const commonFieldsValid = details.bookingReference && details.cost;
    let typeSpecificValid = true;
    
    if (itemType === 'restaurant') {
      typeSpecificValid = !!(details.restaurantName && details.totalBill && details.dateTime);
    } else {
      typeSpecificValid = !!details.provider;
    }
    
    if (!commonFieldsValid || !typeSpecificValid) {
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
      address: details.address,
      notes: details.notes,
      // Restaurant specific fields
      restaurantName: details.restaurantName,
      billUrl: details.billUrl,
      totalBill: details.totalBill,
      currency: details.currency,
      dateTime: details.dateTime,
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
                  <Label className="text-deep-blue font-medium">Airline Name</Label>
                  <Input
                    placeholder="e.g., Air India, IndiGo, Vistara"
                    value={details.provider}
                    onChange={(e) => setDetails(prev => ({ ...prev, provider: e.target.value }))}
                    className="mt-2 bg-white/70 border-border/50"
                  />
                </div>
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
                    <Label className="text-deep-blue font-medium">Departure Airport</Label>
                    <Input
                      placeholder="e.g., DEL"
                      value={details.departureAirport}
                      onChange={(e) => setDetails(prev => ({ ...prev, departureAirport: e.target.value }))}
                      className="mt-2 bg-white/70 border-border/50"
                    />
                  </div>
                  <div>
                    <Label className="text-deep-blue font-medium">Arrival Airport</Label>
                    <Input
                      placeholder="e.g., BOM"
                      value={details.arrivalAirport}
                      onChange={(e) => setDetails(prev => ({ ...prev, arrivalAirport: e.target.value }))}
                      className="mt-2 bg-white/70 border-border/50"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-deep-blue font-medium">Departure Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={details.departureTime}
                      onChange={(e) => setDetails(prev => ({ ...prev, departureTime: e.target.value }))}
                      className="mt-2 bg-white/70 border-border/50"
                    />
                  </div>
                  <div>
                    <Label className="text-deep-blue font-medium">Arrival Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={details.arrivalTime}
                      onChange={(e) => setDetails(prev => ({ ...prev, arrivalTime: e.target.value }))}
                      className="mt-2 bg-white/70 border-border/50"
                    />
                  </div>
                </div>
              </>
            )}
            
            {itemType === 'hotel' && (
              <>
                <div>
                  <Label className="text-deep-blue font-medium">Hotel Name</Label>
                  <Input
                    placeholder="e.g., Marriott Grand Hotel"
                    value={details.provider}
                    onChange={(e) => setDetails(prev => ({ ...prev, provider: e.target.value }))}
                    className="mt-2 bg-white/70 border-border/50"
                  />
                </div>
                <div>
                  <Label className="text-deep-blue font-medium">Address</Label>
                  <Textarea
                    placeholder="Full hotel address..."
                    value={details.address}
                    onChange={(e) => setDetails(prev => ({ ...prev, address: e.target.value }))}
                    className="mt-2 bg-white/70 border-border/50"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-deep-blue font-medium">Check-in Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={details.checkIn}
                      onChange={(e) => setDetails(prev => ({ ...prev, checkIn: e.target.value }))}
                      className="mt-2 bg-white/70 border-border/50"
                    />
                  </div>
                  <div>
                    <Label className="text-deep-blue font-medium">Check-out Date & Time</Label>
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

            {itemType === 'restaurant' && (
              <>
                <div>
                  <Label className="text-deep-blue font-medium">Restaurant Name *</Label>
                  <Input
                    placeholder="e.g., The Royal Palace Restaurant"
                    value={details.restaurantName}
                    onChange={(e) => setDetails(prev => ({ ...prev, restaurantName: e.target.value }))}
                    className="mt-2 bg-white/70 border-border/50"
                  />
                </div>
                <div>
                  <Label className="text-deep-blue font-medium">Address</Label>
                  <Textarea
                    placeholder="Full restaurant address..."
                    value={details.address}
                    onChange={(e) => setDetails(prev => ({ ...prev, address: e.target.value }))}
                    className="mt-2 bg-white/70 border-border/50"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-deep-blue font-medium">Total Bill (Currency)</Label>
                    <Input
                      placeholder="e.g., USD, INR, EUR"
                      value={details.currency}
                      onChange={(e) => setDetails(prev => ({ ...prev, currency: e.target.value }))}
                      className="mt-2 bg-white/70 border-border/50"
                    />
                  </div>
                  <div>
                    <Label className="text-deep-blue font-medium">Total Bill (Amount) *</Label>
                    <Input
                      type="number"
                      placeholder="Enter bill amount"
                      value={details.totalBill}
                      onChange={(e) => setDetails(prev => ({ ...prev, totalBill: Number(e.target.value) }))}
                      className="mt-2 bg-white/70 border-border/50"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-deep-blue font-medium">Date & Time *</Label>
                  <Input
                    type="datetime-local"
                    value={details.dateTime}
                    onChange={(e) => setDetails(prev => ({ ...prev, dateTime: e.target.value }))}
                    className="mt-2 bg-white/70 border-border/50"
                  />
                </div>
                
                {/* Upload Bill */}
                <div>
                  <Label className="text-deep-blue font-medium">Upload Bill</Label>
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center mt-2">
                    <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your restaurant bill or receipt
                    </p>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const mockUrl = URL.createObjectURL(file);
                          setDetails(prev => ({ ...prev, billUrl: mockUrl }));
                        }
                      }}
                      className="hidden"
                      id="bill-upload"
                    />
                    <Label
                      htmlFor="bill-upload"
                      className="cursor-pointer inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-md hover:bg-secondary/90 transition-colors text-sm"
                    >
                      <Upload className="h-3 w-3" />
                      Choose File
                    </Label>
                    {details.billUrl && (
                      <p className="text-sm text-mint mt-2">✓ Bill uploaded</p>
                    )}
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