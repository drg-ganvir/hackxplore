import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckboxItem } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { HackathonType, UserSkill } from "@/types";
import { skillsOptions, interestOptions } from "@/data/mockData";

interface HackathonFiltersProps {
  onFilterChange: (filters: {
    types: HackathonType[];
    mode: string;
    prizePoolMin: number;
    prizePoolMax: number;
    timeframe: string;
    skills: UserSkill[];
  }) => void;
  isMobile?: boolean;
}

export function HackathonFilters({ onFilterChange, isMobile = false }: HackathonFiltersProps) {
  const [selectedTypes, setSelectedTypes] = useState<HackathonType[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>("all");
  const [prizePool, setPrizePool] = useState([0, 100000]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");
  const [selectedSkills, setSelectedSkills] = useState<UserSkill[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({
      types: selectedTypes,
      mode: selectedMode,
      prizePoolMin: prizePool[0],
      prizePoolMax: prizePool[1],
      timeframe: selectedTimeframe,
      skills: selectedSkills,
    });
    
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSelectedMode("all");
    setPrizePool([0, 100000]);
    setSelectedTimeframe("all");
    setSelectedSkills([]);
    
    onFilterChange({
      types: [],
      mode: "all",
      prizePoolMin: 0,
      prizePoolMax: 100000,
      timeframe: "all",
      skills: [],
    });
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const typedType = type as HackathonType;
    if (checked) {
      setSelectedTypes([...selectedTypes, typedType]);
    } else {
      setSelectedTypes(selectedTypes.filter(t => t !== typedType));
    }
  };

  const handleSkillToggle = (skill: string) => {
    const typedSkill = skill as UserSkill;
    const isSelected = selectedSkills.includes(typedSkill);
    
    if (isSelected) {
      setSelectedSkills(selectedSkills.filter(s => s !== typedSkill));
    } else {
      setSelectedSkills([...selectedSkills, typedSkill]);
    }
  };

  const filterContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Hackathon Type</h3>
        <div className="grid grid-cols-1 gap-2">
          {interestOptions.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <CheckboxItem
                id={`type-${type}`}
                checked={selectedTypes.includes(type as HackathonType)}
                onCheckedChange={(checked) => handleTypeChange(type, !!checked)}
              />
              <Label htmlFor={`type-${type}`} className="text-sm font-normal">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Event Mode</h3>
        <RadioGroup
          value={selectedMode}
          onValueChange={setSelectedMode}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="mode-all" value="all" />
            <Label htmlFor="mode-all" className="text-sm font-normal">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="mode-online" value="online" />
            <Label htmlFor="mode-online" className="text-sm font-normal">Online</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="mode-in-person" value="in-person" />
            <Label htmlFor="mode-in-person" className="text-sm font-normal">In-Person</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="mode-hybrid" value="hybrid" />
            <Label htmlFor="mode-hybrid" className="text-sm font-normal">Hybrid</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Prize Pool</h3>
        <div className="px-2">
          <Slider
            min={0}
            max={100000}
            step={1000}
            value={prizePool}
            onValueChange={setPrizePool}
            className="mb-4"
          />
          <div className="flex justify-between">
            <span className="text-sm">${prizePool[0].toLocaleString()}</span>
            <span className="text-sm">${prizePool[1].toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Time Frame</h3>
        <RadioGroup
          value={selectedTimeframe}
          onValueChange={setSelectedTimeframe}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="time-all" value="all" />
            <Label htmlFor="time-all" className="text-sm font-normal">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="time-upcoming" value="upcoming" />
            <Label htmlFor="time-upcoming" className="text-sm font-normal">Upcoming</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="time-past" value="past" />
            <Label htmlFor="time-past" className="text-sm font-normal">Past</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skillsOptions.map((skill) => {
            const isSelected = selectedSkills.includes(skill as UserSkill);
            return (
              <Badge
                key={skill}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer ${isSelected ? 'bg-primary hover:bg-primary/80' : 'hover:bg-primary/20'}`}
                onClick={() => handleSkillToggle(skill)}
              >
                {skill}
              </Badge>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleClearFilters}>
          Clear Filters
        </Button>
        <Button onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );

  return isMobile ? (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        {filterContent}
        <SheetFooter className="mt-4">
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <div className="w-full lg:max-w-xs">
      <div className="sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
        
        <div className="space-y-2">
          {selectedTypes.length > 0 || selectedMode !== "all" || selectedTimeframe !== "all" || selectedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTypes.map((type) => (
                <Badge key={type} variant="secondary" className="flex items-center gap-1">
                  {type}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedTypes(selectedTypes.filter((t) => t !== type))}
                  />
                </Badge>
              ))}
              
              {selectedMode !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedMode}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedMode("all")}
                  />
                </Badge>
              )}
              
              {selectedTimeframe !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedTimeframe}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedTimeframe("all")}
                  />
                </Badge>
              )}
              
              {selectedSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedSkills(selectedSkills.filter((s) => s !== skill))}
                  />
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
        
        <div className="space-y-2">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted">
              <h3 className="text-lg font-medium">Hackathon Type</h3>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2 space-y-2">
              <div className="grid grid-cols-1 gap-2">
                {interestOptions.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <CheckboxItem
                      id={`type-${type}`}
                      checked={selectedTypes.includes(type as HackathonType)}
                      onCheckedChange={(checked) => handleTypeChange(type, !!checked)}
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm font-normal">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Separator />
          
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted">
              <h3 className="text-lg font-medium">Event Mode</h3>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2 space-y-2">
              <RadioGroup
                value={selectedMode}
                onValueChange={setSelectedMode}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="mode-all" value="all" />
                  <Label htmlFor="mode-all" className="text-sm font-normal">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="mode-online" value="online" />
                  <Label htmlFor="mode-online" className="text-sm font-normal">Online</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="mode-in-person" value="in-person" />
                  <Label htmlFor="mode-in-person" className="text-sm font-normal">In-Person</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="mode-hybrid" value="hybrid" />
                  <Label htmlFor="mode-hybrid" className="text-sm font-normal">Hybrid</Label>
                </div>
              </RadioGroup>
            </CollapsibleContent>
          </Collapsible>
          
          <Separator />
          
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted">
              <h3 className="text-lg font-medium">Prize Pool</h3>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2 space-y-2">
              <div className="px-2">
                <Slider
                  min={0}
                  max={100000}
                  step={1000}
                  value={prizePool}
                  onValueChange={setPrizePool}
                  className="mb-4"
                />
                <div className="flex justify-between">
                  <span className="text-sm">${prizePool[0].toLocaleString()}</span>
                  <span className="text-sm">${prizePool[1].toLocaleString()}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Separator />
          
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted">
              <h3 className="text-lg font-medium">Time Frame</h3>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2 space-y-2">
              <RadioGroup
                value={selectedTimeframe}
                onValueChange={setSelectedTimeframe}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="time-all" value="all" />
                  <Label htmlFor="time-all" className="text-sm font-normal">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="time-upcoming" value="upcoming" />
                  <Label htmlFor="time-upcoming" className="text-sm font-normal">Upcoming</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="time-past" value="past" />
                  <Label htmlFor="time-past" className="text-sm font-normal">Past</Label>
                </div>
              </RadioGroup>
            </CollapsibleContent>
          </Collapsible>
          
          <Separator />
          
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted">
              <h3 className="text-lg font-medium">Skills</h3>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2 space-y-2">
              <div className="flex flex-wrap gap-2">
                {skillsOptions.map((skill) => {
                  const isSelected = selectedSkills.includes(skill as UserSkill);
                  return (
                    <Badge
                      key={skill}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer ${isSelected ? 'bg-primary hover:bg-primary/80' : 'hover:bg-primary/20'}`}
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </Badge>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        <div className="mt-6">
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
