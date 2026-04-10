import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckboxItem } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
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
import { UserSkill } from "@/types";
import { skillsOptions } from "@/data/mockData";

interface InternshipFiltersProps {
  onFilterChange: (filters: {
    skills: UserSkill[];
    isRemote: boolean | undefined;
    stipendMin: number;
    stipendMax: number;
    location: string;
  }) => void;
  isMobile?: boolean;
}

export function InternshipFilters({ onFilterChange, isMobile = false }: InternshipFiltersProps) {
  const [selectedSkills, setSelectedSkills] = useState<UserSkill[]>([]);
  const [isRemote, setIsRemote] = useState<boolean | undefined>(undefined);
  const [stipend, setStipend] = useState([0, 10000]);
  const [location, setLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({
      skills: selectedSkills,
      isRemote,
      stipendMin: stipend[0],
      stipendMax: stipend[1],
      location,
    });
    
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedSkills([]);
    setIsRemote(undefined);
    setStipend([0, 10000]);
    setLocation("");
    
    onFilterChange({
      skills: [],
      isRemote: undefined,
      stipendMin: 0,
      stipendMax: 10000,
      location: "",
    });
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
      
      <Separator />
      
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Remote Only</h3>
          <Switch
            checked={isRemote === true}
            onCheckedChange={(checked) => {
              if (checked) {
                setIsRemote(true);
              } else {
                setIsRemote(undefined);
              }
            }}
          />
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Monthly Stipend</h3>
        <div className="px-2">
          <Slider
            min={0}
            max={10000}
            step={100}
            value={stipend}
            onValueChange={setStipend}
            className="mb-4"
          />
          <div className="flex justify-between">
            <span className="text-sm">${stipend[0].toLocaleString()}</span>
            <span className="text-sm">${stipend[1].toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Location</h3>
        <Input
          placeholder="e.g., San Francisco, Remote"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
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
          {selectedSkills.length > 0 || isRemote !== undefined || location ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedSkills(selectedSkills.filter((s) => s !== skill))}
                  />
                </Badge>
              ))}
              
              {isRemote === true && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Remote Only
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setIsRemote(undefined)}
                  />
                </Badge>
              )}
              
              {location && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {location}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setLocation("")}
                  />
                </Badge>
              )}
            </div>
          ) : null}
        </div>
        
        <div className="space-y-2">
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
          
          <Separator />
          
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted">
              <h3 className="text-lg font-medium">Remote Only</h3>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="remote-only"
                  checked={isRemote === true}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setIsRemote(true);
                    } else {
                      setIsRemote(undefined);
                    }
                  }}
                />
                <Label htmlFor="remote-only">Show only remote opportunities</Label>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Separator />
          
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted">
              <h3 className="text-lg font-medium">Monthly Stipend</h3>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2 space-y-2">
              <div className="px-2">
                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={stipend}
                  onValueChange={setStipend}
                  className="mb-4"
                />
                <div className="flex justify-between">
                  <span className="text-sm">${stipend[0].toLocaleString()}</span>
                  <span className="text-sm">${stipend[1].toLocaleString()}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Separator />
          
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted">
              <h3 className="text-lg font-medium">Location</h3>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2 space-y-2">
              <Input
                placeholder="e.g., San Francisco, New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
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
