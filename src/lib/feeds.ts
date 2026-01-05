export type FeedDef = {
  id: string;
  name: string;
  url: string;
};

export const FEEDS: FeedDef[] = [
  { id: "f1", name: "Formula1.com", url: "https://www.formula1.com/en/latest/all.xml" },
  { id: "autosport", name: "Autosport", url: "https://www.autosport.com/rss/f1/news/" },
  { id: "racefans", name: "RaceFans", url: "https://www.racefans.net/feed/" },
  { id: "therace", name: "The Race", url: "https://www.the-race.com/rss/" },
  { id: "fia", name: "FIA Press Releases", url: "https://www.fia.com/rss/press-release" },
  { id: "racers", name: "Racers", url: "https://racer.com/f1/feed" },
  { id: "f1technical", name: "F1 Technical", url: "https://www.f1technical.net/rss/news.xml" },
  { id: "kymillman", name: "KyMillman.com", url: "https://www.kymillman.com/feed" },
  { id: "gpfans", name: "GPFans", url: "https://www.gpfans.com/en/rss.xml" },
];

export const FEED_DEFAULT_IMAGES: Record<string, string> = {
  f1: "https://www.formula1.com/etc/designs/fom-website/social/f1-default-share.jpg",
  autosport: "https://www.autosport.com/images/autosport-logo.png",
  racefans: "/sources/racefansdotnet.jpg",
  therace: "https://www.the-race.com/wp-content/uploads/2021/03/the-race-logo.png",
  fia: "https://www.fia.com/sites/default/files/fia_logo_square.png",
  racers: "/sources/racefansdotnet.jpg",
  f1technical: "https://f1tcdn.net/images/banners/f1t_logo2.gif",
  kymillman: "https://www.kymillman.com/wp-content/uploads/2024/11/f1-rain-race-shot.jpg",
  gpfans: "/sources/racefansdotnet.jpg",
};