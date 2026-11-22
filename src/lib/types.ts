
export type NftStatus = "Issued" | "Expired" | "Revoked" | "Pending";

export type CredentialType = "Diploma" | "Certificate" | "Deed" | "Rental Agreement" | "ID" | "License" | "Other";

export interface NftMetadata {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  issuer: string;
  ownerAddress?: string;
  contractAddress?: string; 
  credentialType?: CredentialType;
  issuedDate: string;
  expiryDate?: string;
  status: NftStatus;
  documentIpfsHash?: string; 
  studentName?: string;
  degreeName?: string;
  propertyAddress?: string;
  documentType?: string;
  publicVerificationLink: string;
}

// User Management Types
export type UserRole = "proof_owner" | "proof_issuer" | "site_admin";
export type UserStatus = "active" | "suspended" | "pending_verification";

export interface AppUser {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string; // ISO date string
  lastLogin?: string; // ISO date string
}
