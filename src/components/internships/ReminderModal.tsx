
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, Bell } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  internshipId: string;
  internshipTitle: string;
  deadline?: string;
  company: string;
}

export function ReminderModal({
  isOpen,
  onClose,
  internshipId,
  internshipTitle,
  deadline,
  company
}: ReminderModalProps) {
  const { toast } = useToast();
  const [reminderDate, setReminderDate] = useState<Date | undefined>(
    deadline ? new Date(deadline) : new Date()
  );
  const [reminderTime, setReminderTime] = useState<string>("09:00");
  const [enableEmail, setEnableEmail] = useState(true);
  const [enableBrowser, setEnableBrowser] = useState(true);
  const [note, setNote] = useState(`Reminder for ${internshipTitle} application at ${company}`);
  
  // Get current date with time set to 00:00:00 for proper comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const handleSetReminder = () => {
    // In a real app, this would save the reminder to the user's account
    // For now, we'll just simulate it with a toast
    
    if (!reminderDate) {
      toast({
        title: "Please select a date",
        description: "You need to select a date for your reminder",
        variant: "destructive"
      });
      return;
    }
    
    const reminderDateTime = new Date(reminderDate);
    const [hours, minutes] = reminderTime.split(':').map(Number);
    reminderDateTime.setHours(hours, minutes);
    
    // Check if the reminder date is valid (not in the past)
    if (reminderDateTime < new Date()) {
      toast({
        title: "Invalid reminder time",
        description: "The reminder date and time must be in the future",
        variant: "destructive"
      });
      return;
    }
    
    // Here we would save the reminder
    // For now, just show a confirmation toast
    toast({
      title: "Reminder set successfully",
      description: `You will be reminded about "${internshipTitle}" on ${format(reminderDateTime, "PPP")} at ${reminderTime}`,
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Set Application Reminder
          </DialogTitle>
          <DialogDescription>
            Get notified before the application deadline for {internshipTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Reminder Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !reminderDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {reminderDate ? format(reminderDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={reminderDate}
                  onSelect={setReminderDate}
                  initialFocus
                  disabled={(date) => date < today}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="time">Reminder Time</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note to your reminder"
            />
          </div>
          
          <div className="grid gap-4">
            <Label>Notification Methods</Label>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="email-notifications" 
                  checked={enableEmail}
                  onCheckedChange={setEnableEmail}
                />
                <Label htmlFor="email-notifications">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="browser-notifications" 
                  checked={enableBrowser}
                  onCheckedChange={setEnableBrowser}
                />
                <Label htmlFor="browser-notifications">Browser</Label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSetReminder}>Set Reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
