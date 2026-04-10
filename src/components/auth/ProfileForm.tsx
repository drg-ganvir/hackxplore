import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { skillsOptions, interestOptions } from "@/data/mockData";
import { UserSkill, HackathonType } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  bio: z.string().optional(),
  skills: z.array(z.string()).min(1, { message: "Select at least one skill" }),
  interests: z.array(z.string()).min(1, { message: "Select at least one interest" }),
  preferredRole: z.string().optional(),
  lookingFor: z.enum(["hackathons", "internships", "both"]),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
});

interface ProfileFormProps {
  onComplete?: () => void;
}

export function ProfileForm({ onComplete }: ProfileFormProps) {
  const { profile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<UserSkill[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<HackathonType[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || "",
      bio: profile?.bio || "",
      skills: profile?.skills || [],
      interests: profile?.interests || [],
      preferredRole: profile?.preferredRole || "",
      lookingFor: profile?.lookingFor || "both",
      githubUrl: profile?.githubUrl || "",
      linkedinUrl: profile?.linkedinUrl || "",
      portfolioUrl: profile?.portfolioUrl || "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        bio: profile.bio || "",
        skills: profile.skills,
        interests: profile.interests,
        preferredRole: profile.preferredRole || "",
        lookingFor: profile.lookingFor,
        githubUrl: profile.githubUrl || "",
        linkedinUrl: profile.linkedinUrl || "",
        portfolioUrl: profile.portfolioUrl || "",
      });
      setSelectedSkills(profile.skills || []);
      setSelectedInterests(profile.interests || []);
    }
  }, [profile, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      await updateProfile({
        name: values.name,
        bio: values.bio,
        skills: values.skills as UserSkill[],
        interests: values.interests as HackathonType[],
        preferredRole: values.preferredRole,
        lookingFor: values.lookingFor,
        githubUrl: values.githubUrl,
        linkedinUrl: values.linkedinUrl,
        portfolioUrl: values.portfolioUrl,
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const toggleSkill = (skill: string) => {
    const currentSkills = form.getValues().skills as UserSkill[];
    const typedSkill = skill as UserSkill;
    const isSelected = currentSkills.includes(typedSkill);
    
    let updatedSkills: UserSkill[];
    if (isSelected) {
      updatedSkills = currentSkills.filter(s => s !== typedSkill);
    } else {
      updatedSkills = [...currentSkills, typedSkill];
    }
    
    form.setValue("skills", updatedSkills, { shouldValidate: true });
    setSelectedSkills(updatedSkills);
  };
  
  const toggleInterest = (interest: string) => {
    const currentInterests = form.getValues().interests as HackathonType[];
    const typedInterest = interest as HackathonType;
    const isSelected = currentInterests.includes(typedInterest);
    
    let updatedInterests: HackathonType[];
    if (isSelected) {
      updatedInterests = currentInterests.filter(i => i !== typedInterest);
    } else {
      updatedInterests = [...currentInterests, typedInterest];
    }
    
    form.setValue("interests", updatedInterests, { shouldValidate: true });
    setSelectedInterests(updatedInterests);
  };

  return (
    <Card className="w-full max-w-4xl border-primary/20 glass-card">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>Help us personalize your experience and connect you with the right opportunities</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preferredRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Frontend Developer" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormDescription>
                      What role do you typically take in hackathons?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us a bit about yourself" 
                      {...field} 
                      className="bg-background/50"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={() => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skillsOptions.map((skill) => {
                      const isSelected = selectedSkills.includes(skill as UserSkill);
                      return (
                        <Badge
                          key={skill}
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer ${isSelected ? 'bg-primary hover:bg-primary/80' : 'hover:bg-primary/20'}`}
                          onClick={() => toggleSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      );
                    })}
                  </div>
                  <FormDescription>
                    Select the skills you're proficient in
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {interestOptions.map((interest) => {
                      const isSelected = selectedInterests.includes(interest as HackathonType);
                      return (
                        <Badge
                          key={interest}
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer ${isSelected ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'hover:bg-secondary/20'}`}
                          onClick={() => toggleInterest(interest)}
                        >
                          {interest}
                        </Badge>
                      );
                    })}
                  </div>
                  <FormDescription>
                    Select the areas you're interested in for hackathons
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lookingFor"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>I'm Looking For</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="hackathons" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Hackathons
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="internships" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Internships
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="both" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Both Hackathons and Internships
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="portfolioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourportfolio.com" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
