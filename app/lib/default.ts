export default interface Transaction {
  id: number;
  amount: number;
  senderId: number;
  receiverId: number;
  sender: { user: { username: string } };
  receiver: { user: { username: string } };
  createdAt: string;
}
