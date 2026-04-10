// src/services/webScrapingService.ts

// Function to scrape hackathon data from a website
export const scrapeHackathonData = async (url: string): Promise<any> => {
  try {
    // Fetch the HTML content from the URL
    const response = await fetch(url);
    const html = await response.text();

    // Get hackathon title
    const getHackathonTitle = (html: string) => {
      const titleRegex = /<title>(.*?)<\/title>/i;
      const titleMatch = html.match(titleRegex);
      return titleMatch ? titleMatch[1] : 'Untitled Hackathon';
    };

    // Get hackathon description
    const getHackathonDescription = (html: string) => {
      const descriptionRegex = /<meta name="description" content="(.*?)"/i;
      const descriptionMatch = html.match(descriptionRegex);
      return descriptionMatch ? descriptionMatch[1] : 'No description available.';
    };

    // Get hackathon mode
    const getHackathonMode = (html: string) => {
      if (html.includes('online') || html.includes('remote') || html.includes('virtual')) {
        return "Online";
      } else if (html.includes('hybrid')) {
        return "Hybrid";
      } else {
        return "In-person";
      }
    };

    // Extract relevant data using regex or DOM parsing
    const title = getHackathonTitle(html);
    const description = getHackathonDescription(html);
    const mode = getHackathonMode(html);

    // Return the scraped data
    return {
      title,
      description,
      mode,
      url
    };
  } catch (error) {
    console.error('Error scraping hackathon data:', error);
    return null;
  }
};
