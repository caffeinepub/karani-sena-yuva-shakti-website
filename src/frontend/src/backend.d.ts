import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Candidate {
    lastQualification: string;
    dateOfBirth: string;
    createdAt: bigint;
    fullName: string;
    fatherName: string;
    address: string;
    admissionID: string;
    mobile: string;
    photo?: ExternalBlob;
}
export interface AdminResponse {
    principal: Principal;
    isSuperAdmin: boolean;
}
export interface GalleryItem {
    description: string;
    image: ExternalBlob;
}
export interface NewsItem {
    title: string;
    content: string;
    createdAt: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAdmin(newAdmin: Principal): Promise<boolean>;
    addGalleryItem(image: ExternalBlob, description: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNewsItem(title: string, content: string, createdAt: bigint): Promise<void>;
    deleteGalleryItem(description: string): Promise<void>;
    deleteNewsItem(title: string): Promise<void>;
    editNewsItem(title: string, content: string, createdAt: bigint): Promise<void>;
    getAdmins(): Promise<Array<AdminResponse>>;
    getAllCandidates(): Promise<Array<Candidate>>;
    getAllNewsItems(): Promise<Array<NewsItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGalleryItems(): Promise<Array<GalleryItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeSuperAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    removeAdmin(adminToRemove: Principal): Promise<boolean>;
    resetAdminSystemForce(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitAdmissionForm(fullName: string, fatherName: string, dateOfBirth: string, mobile: string, lastQualification: string, address: string, photo: ExternalBlob | null): Promise<void>;
}
