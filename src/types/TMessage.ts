export type TMessage = {
  text?: string;
  imageUrl?: string;
  dateTime: Date;
  isOwn: boolean;
  isRead?: boolean;
};
