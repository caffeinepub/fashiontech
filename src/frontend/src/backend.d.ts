import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface FashionShow {
    id: Id;
    title: string;
    description: string;
    collections: Array<string>;
    scheduledAt: Timestamp;
}
export interface DiscussionReply {
    content: string;
    createdAt: Timestamp;
    author: Principal;
}
export interface CreateCourseForm {
    title: string;
    tier: CourseTier;
    description: string;
    modules: Array<string>;
}
export interface Quiz {
    answers: Array<string>;
    questions: Array<string>;
}
export interface CourseDescription {
    id: Id;
    title: string;
    description: string;
    isFree: boolean;
    created_at: Timestamp;
    priceTier?: PriceTier;
    modules: Array<CourseModule>;
}
export interface DiscussionPost {
    id: Id;
    title: string;
    content: string;
    createdAt: Timestamp;
    author: Principal;
    replies: Array<DiscussionReply>;
}
export interface Course {
    id: Id;
    title: string;
    free: boolean;
    description: string;
    created_at: Timestamp;
    modules: Array<string>;
}
export interface CourseModule {
    id: Id;
    title: string;
    supplementalMaterial: Array<Resource>;
    quizPassingScore?: bigint;
    resources: Array<Resource>;
    quiz?: Quiz;
    description: string;
    isFree: boolean;
    level: CourseLevel;
    priceTier?: PriceTier;
    videoUrl?: string;
}
export interface Achievement {
    id: Id;
    title: string;
    userId: Principal;
    earnedAt: Timestamp;
    criteria: Array<string>;
    points: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CoursePurchase {
    paymentStatus: PaymentStatus;
    userId: Principal;
    tier: CourseTier;
    purchasedAt: Timestamp;
    courseId: Id;
}
export interface VirtualDesign {
    id: Id;
    title: string;
    userId: Principal;
    createdAt: Timestamp;
    steps: Array<string>;
    materials: Array<[string, bigint]>;
}
export type Complete = boolean;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface Certification {
    id: Id;
    userId: Principal;
    issuedAt: Timestamp;
    courseId: Id;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface AIRecommendation {
    recommendationId: Id;
    reason: string;
}
export type Progress = bigint;
export interface Resource {
    id: Id;
    url: string;
    title: string;
    description: string;
    resourceType: Variant_video_tool_article;
}
export type Id = string;
export interface CourseProgress {
    userId: Principal;
    completed: Complete;
    lastUpdated: Timestamp;
    progress: Progress;
    courseId: Id;
}
export interface UserProfile {
    userTier: UserTier;
    interests: Array<string>;
    name: string;
    learningPath: Array<Id>;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum CourseLevel {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced",
    professional = "professional"
}
export enum PaymentStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UserTier {
    premium = "premium",
    free = "free",
    paid = "paid"
}
export enum Variant_video_tool_article {
    video = "video",
    tool = "tool",
    article = "article"
}
export interface backendInterface {
    add_discussion_reply(postId: Id, content: string): Promise<void>;
    add_mentorship(mentee: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    confirmCheckoutSession(sessionId: string, courseId: Id): Promise<void>;
    confirmPaypalPayment(sessionId: string): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createPaypalPayment(courseId: string, sessionId: string): Promise<void>;
    create_achievement(title: string, points: bigint, criteria: Array<string>): Promise<Achievement>;
    create_certification(userId: Principal, courseId: Id): Promise<Certification>;
    create_course(form: CreateCourseForm): Promise<Course>;
    create_design(title: string, materials: Array<[string, bigint]>, steps: Array<string>): Promise<VirtualDesign>;
    create_discussion(title: string, content: string): Promise<DiscussionPost>;
    create_fashion_show(title: string, description: string, scheduledAt: Timestamp, collections: Array<string>): Promise<FashionShow>;
    delete_course(courseId: Id): Promise<void>;
    delete_design(designId: Id): Promise<void>;
    delete_fashion_show(showId: Id): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    get_course(courseId: Id): Promise<Course | null>;
    get_course_descriptions(): Promise<Array<CourseDescription>>;
    get_course_modules(): Promise<Array<CourseModule>>;
    get_courses(): Promise<Array<Course>>;
    get_design(designId: Id): Promise<VirtualDesign | null>;
    get_discussions(): Promise<Array<DiscussionPost>>;
    get_fashion_show(showId: Id): Promise<FashionShow | null>;
    get_fashion_shows(): Promise<Array<FashionShow>>;
    get_my_achievements(): Promise<Array<Achievement>>;
    get_my_certifications(): Promise<Array<Certification>>;
    get_my_course_progress(courseId: Id): Promise<CourseProgress | null>;
    get_my_designs(): Promise<Array<VirtualDesign>>;
    get_purchased_courses(): Promise<Array<CoursePurchase>>;
    get_recommendations(): Promise<Array<AIRecommendation>>;
    get_user_achievements(user: Principal): Promise<Array<Achievement>>;
    get_user_certifications(user: Principal): Promise<Array<Certification>>;
    get_user_course_progress(user: Principal, courseId: Id): Promise<CourseProgress | null>;
    has_purchased_course(courseId: Id): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    purchase_course(courseId: Id, tier: CourseTier): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    update_course(courseId: Id, form: CreateCourseForm): Promise<void>;
    update_course_progress(courseId: Id, progress: Progress): Promise<void>;
    update_design(designId: Id, title: string, materials: Array<[string, bigint]>, steps: Array<string>): Promise<void>;
    update_fashion_show(showId: Id, title: string, description: string, scheduledAt: Timestamp, collections: Array<string>): Promise<void>;
    update_purchase_status(userId: Principal, courseId: Id, status: PaymentStatus): Promise<void>;
}
