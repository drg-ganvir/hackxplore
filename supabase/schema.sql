
-- Create the necessary tables and policies

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    name TEXT,
    avatar_url TEXT,
    skills TEXT[],
    interests TEXT[],
    preferred_role TEXT,
    looking_for TEXT,
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT
);

-- Create teams table
CREATE TABLE public.teams (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    name TEXT NOT NULL,
    hackathon_id TEXT NOT NULL,
    description TEXT NOT NULL,
    skills_needed TEXT[] NOT NULL,
    creator_id UUID REFERENCES auth.users(id) NOT NULL,
    max_members INTEGER NOT NULL DEFAULT 4,
    is_open BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create team members table
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    team_id UUID REFERENCES public.teams(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
    UNIQUE(team_id, user_id)
);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('hackathon', 'internship')),
    UNIQUE(user_id, item_id, item_type)
);

-- Set up Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Create policies for teams
CREATE POLICY "Anyone can view teams" 
    ON public.teams FOR SELECT 
    TO authenticated
    USING (true);

CREATE POLICY "Creators can insert teams" 
    ON public.teams FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their teams" 
    ON public.teams FOR UPDATE 
    TO authenticated
    USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their teams" 
    ON public.teams FOR DELETE 
    TO authenticated
    USING (auth.uid() = creator_id);

-- Create policies for team members
CREATE POLICY "Anyone can view team members" 
    ON public.team_members FOR SELECT 
    TO authenticated
    USING (true);

CREATE POLICY "Users can request to join teams" 
    ON public.team_members FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Team creators can update membership status" 
    ON public.team_members FOR UPDATE 
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.teams WHERE 
        teams.id = team_members.team_id AND 
        teams.creator_id = auth.uid()
    ));

-- Create policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" 
    ON public.bookmarks FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add bookmarks" 
    ON public.bookmarks FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
    ON public.bookmarks FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);

-- Create an on-login trigger to automatically create profiles
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
