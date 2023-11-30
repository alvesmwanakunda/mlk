export interface Chat{
  message: string;
  isReadAdmin: boolean;
  isRead: boolean;
  createdAt: Date;
  senderId?: any;
}
