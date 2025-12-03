import { Bookmark } from "lucide-react";
import { formatTime } from "@/lib/utils/duration";

// Helper function to add a bookmark at the current time
export function handleBookmark(
  currentTime: number,
  bookmarkedTimes: number[]
): number[] {
  const time = Math.floor(currentTime);
  if (!bookmarkedTimes.includes(time)) {
    return [...bookmarkedTimes, time];
  }
  return bookmarkedTimes;
}

interface BookmarksSectionProps {
  bookmarkedTimes: number[];
  onBookmarkClick: (time: number) => void;
}

export function BookmarksSection({
  bookmarkedTimes,
  onBookmarkClick,
}: BookmarksSectionProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-foreground">
        Bookmarks
      </h3>
      <div className="space-y-2 md:space-y-3 w-full">
        {bookmarkedTimes.length > 0 ? (
          bookmarkedTimes.map((time, index) => (
            <button
              key={index}
              onClick={() => onBookmarkClick(time)}
              className="w-full text-left px-3 py-2 md:px-4 md:py-3 rounded-lg bg-muted hover:bg-muted/80 transition flex items-center gap-3"
            >
              <Bookmark
                size={14}
                className="text-blue-500 flex-shrink-0"
              />
              <div>
                <span className="font-semibold text-foreground text-sm md:text-base">
                  {formatTime(time)}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  Bookmark {index + 1}
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-6 md:py-8 bg-gray-50 rounded-lg w-full">
            <Bookmark
              size={36}
              className="text-gray-400 mx-auto mb-2 md:mb-3"
            />
            <p className="text-muted-foreground">No bookmarks yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add bookmarks while watching the video!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

