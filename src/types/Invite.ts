
export type InviteStatus = "PENDING" | "EXPIRED" | "ACCEPTED" | "REJECTED";

export interface Invite {
  id: string;
  status: InviteStatus;
  email: string;
  cpf: string;
  // access?: Access;
  // accessPatient?: AccessPatient;
  // workspace: Workspace;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}