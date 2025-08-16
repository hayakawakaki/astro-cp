export type OnlineCount = {
  onlineCount: number;
  totalOnlineCount: number;
  gmCount: number;
  vendorCount: number;
  uniqueCount: number;
};

export type ServerStatusReturn = {
  loginStatus: boolean;
  charStatus: boolean;
  mapStatus: boolean;
} & OnlineCount;
