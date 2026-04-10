
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// Mock data for bookmarks
const mockBookmarksData = [
  {
    id: "bookmark-1",
    user_id: "user-1",
    item_id: "hackathon-1",
    item_type: "hackathon",
    created_at: "2023-05-15T10:30:00Z"
  },
  {
    id: "bookmark-2",
    user_id: "user-1",
    item_id: "internship-3",
    item_type: "internship",
    created_at: "2023-05-16T14:20:00Z"
  },
  {
    id: "bookmark-3",
    user_id: "user-1",
    item_id: "hackathon-5",
    item_type: "hackathon",
    created_at: "2023-05-17T09:15:00Z"
  }
];

export const useBookmarks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Query to fetch bookmarks
  const { data: bookmarks = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Simulate API call to fetch bookmarks
      return mockBookmarksData;
    },
    enabled: !!user,
  });
  
  // Function to check if item is bookmarked
  const isBookmarked = (itemId: string, itemType: 'hackathon' | 'internship' | 'scholarship') => {
    return bookmarks.some(bookmark => 
      bookmark.item_id === itemId && bookmark.item_type === itemType
    );
  };
  
  // Function to toggle bookmark status
  const toggleBookmark = (itemId: string, itemType: 'hackathon' | 'internship' | 'scholarship') => {
    if (!user) return;
    
    // If already bookmarked, remove it
    if (isBookmarked(itemId, itemType)) {
      removeBookmark(itemId, itemType);
    } else {
      // Otherwise add it
      addBookmark(itemId, itemType);
    }
  };
  
  // Add bookmark function
  const addBookmark = async (itemId: string, itemType: 'hackathon' | 'internship' | 'scholarship') => {
    if (!user) return;
    
    // Optimistically update the UI
    queryClient.setQueryData(['bookmarks', user.id], (oldData: any) => {
      const newBookmark = {
        id: `bookmark-${Date.now()}`,
        user_id: user.id,
        item_id: itemId,
        item_type: itemType,
        created_at: new Date().toISOString()
      };
      return [...(oldData || []), newBookmark];
    });
    
    // Show success toast
    toast({
      title: "Bookmark added",
      description: `The ${itemType} has been added to your bookmarks.`,
    });
    
    // Here you would normally make an API call to actually save the bookmark
    console.log(`Added bookmark for ${itemType} with ID ${itemId}`);
  };
  
  // Remove bookmark function
  const removeBookmark = async (itemId: string, itemType: 'hackathon' | 'internship' | 'scholarship') => {
    if (!user) return;
    
    // Optimistically update the UI
    queryClient.setQueryData(['bookmarks', user.id], (oldData: any) => {
      return (oldData || []).filter(
        (bookmark: any) => 
          !(bookmark.item_id === itemId && bookmark.item_type === itemType)
      );
    });
    
    // Show success toast
    toast({
      title: "Bookmark removed",
      description: `The ${itemType} has been removed from your bookmarks.`,
    });
    
    // Here you would normally make an API call to actually remove the bookmark
    console.log(`Removed bookmark for ${itemType} with ID ${itemId}`);
  };
  
  return { 
    bookmarks, 
    isLoading, 
    isError, 
    isBookmarked, 
    toggleBookmark,
    addBookmark,
    removeBookmark,
    refetch 
  };
};
