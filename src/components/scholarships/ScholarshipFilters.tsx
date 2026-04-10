
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScholarshipType } from "@/types";
import { scholarshipTypes, eligibilityOptions } from "@/data/mockData";

interface FilterProps {
  onFilterChange: (filters: any) => void;
  isMobile?: boolean;
}

export function ScholarshipFilters({ onFilterChange, isMobile = false }: FilterProps) {
  const [types, setTypes] = useState<ScholarshipType[]>([]);
  const [amountRange, setAmountRange] = useState([0, 50000]);
  const [deadlineType, setDeadlineType] = useState("all");
  const [provider, setProvider] = useState("");
  const [eligibility, setEligibility] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filtersCount, setFiltersCount] = useState(0);
  
  // Update filter count
  useEffect(() => {
    let count = 0;
    if (types.length > 0) count++;
    if (amountRange[0] > 0 || amountRange[1] < 50000) count++;
    if (deadlineType !== "all") count++;
    if (provider) count++;
    if (eligibility.length > 0) count++;
    
    setFiltersCount(count);
  }, [types, amountRange, deadlineType, provider, eligibility]);
  
  // Send filters to parent component
  useEffect(() => {
    onFilterChange({
      types,
      amountMin: amountRange[0],
      amountMax: amountRange[1],
      deadlineType,
      provider,
      eligibility,
    });
  }, [types, amountRange, deadlineType, provider, eligibility, onFilterChange]);
  
  const handleToggleType = (type: ScholarshipType) => {
    if (types.includes(type)) {
      setTypes(types.filter(t => t !== type));
    } else {
      setTypes([...types, type]);
    }
  };

  const handleToggleEligibility = (criterion: string) => {
    if (eligibility.includes(criterion)) {
      setEligibility(eligibility.filter(c => c !== criterion));
    } else {
      setEligibility([...eligibility, criterion]);
    }
  };
  
  const handleReset = () => {
    setTypes([]);
    setAmountRange([0, 50000]);
    setDeadlineType("all");
    setProvider("");
    setEligibility([]);
  };
  
  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Scholarship Type */}
      <div className="space-y-2">
        <Label className="font-medium">Scholarship Type</Label>
        <div className="flex flex-wrap gap-2">
          {scholarshipTypes.map((type) => (
            <Badge
              key={type}
              variant={types.includes(type as ScholarshipType) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleToggleType(type as ScholarshipType)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Amount Range */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="font-medium">Amount Range</Label>
          <span className="text-xs text-muted-foreground">
            ${amountRange[0].toLocaleString()} - ${amountRange[1].toLocaleString()}
          </span>
        </div>
        <Slider
          value={amountRange}
          min={0}
          max={50000}
          step={1000}
          onValueChange={setAmountRange}
          className="py-4"
        />
      </div>
      
      {/* Deadline */}
      <div className="space-y-2">
        <Label className="font-medium">Deadline</Label>
        <RadioGroup value={deadlineType} onValueChange={setDeadlineType}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="deadline-all" />
            <Label htmlFor="deadline-all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upcoming" id="deadline-upcoming" />
            <Label htmlFor="deadline-upcoming">Upcoming (next 30 days)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="urgent" id="deadline-urgent" />
            <Label htmlFor="deadline-urgent">Urgent (less than 7 days)</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Provider */}
      <div className="space-y-2">
        <Label htmlFor="provider" className="font-medium">Provider</Label>
        <Input
          id="provider"
          placeholder="e.g. Google, Microsoft"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        />
      </div>
      
      {/* Eligibility Criteria */}
      <div className="space-y-2">
        <Label className="font-medium">Eligibility Criteria</Label>
        <ScrollArea className="h-48 w-full rounded-md border p-2">
          <div className="space-y-2">
            {eligibilityOptions.map((criterion) => (
              <div key={criterion} className="flex items-center space-x-2">
                <Checkbox 
                  id={`eligibility-${criterion}`} 
                  checked={eligibility.includes(criterion)}
                  onCheckedChange={() => handleToggleEligibility(criterion)}
                />
                <label
                  htmlFor={`eligibility-${criterion}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {criterion}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Reset Button */}
      {filtersCount > 0 && (
        <Button variant="ghost" onClick={handleReset} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      )}
    </div>
  );
  
  // Mobile view (dialog)
  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {filtersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filtersCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <FiltersContent />
        </DialogContent>
      </Dialog>
    );
  }
  
  // Desktop view (sidebar)
  return (
    <Card className="w-full max-w-xs h-fit sticky top-24">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className={`space-y-6 ${isOpen ? 'block' : 'hidden md:block'}`}>
          <FiltersContent />
        </div>
      </CardContent>
    </Card>
  );
}
