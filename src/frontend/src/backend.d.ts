import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    name: string;
    totalCoinsEarned: bigint;
}
export interface Withdrawal {
    id: bigint;
    status: string;
    ifscCode: string;
    coins: bigint;
    timestamp: bigint;
    accountNumber: string;
}
export interface Earning {
    title: string;
    coins: bigint;
    articleId: bigint;
    timestamp: bigint;
}
export interface Article {
    id: bigint;
    title: string;
    duration: bigint;
    summary: string;
    imageUrl: string;
    category: Category;
}
export interface UserProfile {
    name: string;
}
export enum Category {
    entertainment = "entertainment",
    tech = "tech",
    business = "business",
    sports = "sports",
    politics = "politics"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getArticles(): Promise<Array<Article>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEarningsHistory(): Promise<Array<Earning>>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWallet(): Promise<{
        balance: bigint;
        totalEarned: bigint;
        readArticles: Array<bigint>;
        inrValue: number;
    }>;
    getWithdrawals(): Promise<Array<Withdrawal>>;
    isCallerAdmin(): Promise<boolean>;
    recordArticleRead(articleId: bigint): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitWithdrawal(accountNumber: string, ifscCode: string, coinAmount: bigint): Promise<boolean>;
}
