import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Mail, UserMinus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface TripMate {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalPaid: number;
  totalOwed: number;
  isOwner?: boolean;
}

interface TripMateManagerProps {
  tripMates: TripMate[];
  onAddTripMate: (tripMate: Omit<TripMate, 'id' | 'totalPaid' | 'totalOwed'>) => void;
  onRemoveTripMate: (id: string) => void;
}

export function TripMateManager({ tripMates, onAddTripMate, onRemoveTripMate }: TripMateManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMate, setNewMate] = useState({ name: '', email: '' });
  const { toast } = useToast();

  const handleAddMate = () => {
    if (!newMate.name.trim() || !newMate.email.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter both name and email",
        variant: "destructive"
      });
      return;
    }

    if (tripMates.some(mate => mate.email === newMate.email)) {
      toast({
        title: "Duplicate email",
        description: "This email is already added",
        variant: "destructive"
      });
      return;
    }

    onAddTripMate({
      name: newMate.name.trim(),
      email: newMate.email.trim().toLowerCase()
    });

    setNewMate({ name: '', email: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Trip mate added",
      description: `${newMate.name} has been added to the trip`
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getBalanceStatus = (mate: TripMate) => {
    const balance = mate.totalPaid - mate.totalOwed;
    if (balance > 0) return { text: `Gets back $${balance.toFixed(2)}`, color: 'bg-green-100 text-green-800' };
    if (balance < 0) return { text: `Owes $${Math.abs(balance).toFixed(2)}`, color: 'bg-red-100 text-red-800' };
    return { text: 'Settled up', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-deep-blue">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Trip Mates ({tripMates.length})
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Mate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Trip Mate</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newMate.name}
                    onChange={(e) => setNewMate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={newMate.email}
                    onChange={(e) => setNewMate(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddMate} className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invite
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tripMates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No trip mates added yet</p>
              <p className="text-sm">Add friends to share and split expenses</p>
            </div>
          ) : (
            tripMates.map((mate) => {
              const balanceStatus = getBalanceStatus(mate);
              
              return (
                <div key={mate.id} className="flex items-center justify-between p-3 rounded-lg bg-white/70 hover:bg-white/90 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(mate.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-deep-blue">{mate.name}</p>
                        {mate.isOwner && (
                          <Badge variant="secondary" className="text-xs">Owner</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{mate.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <Badge className={`text-xs ${balanceStatus.color}`}>
                        {balanceStatus.text}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Paid: ${mate.totalPaid.toFixed(2)} | Owes: ${mate.totalOwed.toFixed(2)}
                      </p>
                    </div>
                    
                    {!mate.isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveTripMate(mate.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}