interface IChangePasswordDTO {
  username: string;
  password: string;
  new_password: string;
}

interface IUserProfile {
  role: string;
  username: string;
  full_name: string;
  avatar_url: string;
  news_bookmarks: string[];
  vital_list: string[];
  interested_list: string[];
}

export type { IChangePasswordDTO, IUserProfile}