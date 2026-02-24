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
export interface AdmissionFormCandidate {
    lastQualification: string;
    dateOfBirth: string;
    createdAt: bigint;
    fullName: string;
    address: string;
    mobile: string;
    photo?: ExternalBlob;
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
    addGalleryItem(image: ExternalBlob, description: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNewsItem(title: string, content: string, createdAt: bigint): Promise<void>;
    deleteGalleryItem(description: string): Promise<void>;
    deleteNewsItem(title: string): Promise<void>;
    editNewsItem(title: string, content: string, createdAt: bigint): Promise<void>;
    getAllCandidates(): Promise<Array<AdmissionFormCandidate>>;
    getAllNewsItems(): Promise<Array<NewsItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGalleryItems(): Promise<Array<GalleryItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitAdmissionForm(fullName: string, dateOfBirth: string, mobile: string, lastQualification: string, address: string, photo: ExternalBlob | null): Promise<void>;
}
