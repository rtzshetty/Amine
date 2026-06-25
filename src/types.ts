export type SeriesType = 'Anime' | 'Movie';
export type PublishStatus = 'draft' | 'published';

export interface Series {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  type: SeriesType;
  genre: string;
  publish_status: PublishStatus;
  created_at: number;
}

export interface Episode {
  id: string;
  series_id: string;
  episode_number: number;
  episode_title: string;
  video_url: string;
  description: string;
  created_at: number;
}

export interface WatchHistory {
  series_id: string;
  episode_id: string;
  last_watched_time: number;
  updated_at: number;
}
