import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  Course, 
  CreateCourseForm, 
  CourseProgress, 
  FashionShow, 
  VirtualDesign, 
  Achievement, 
  Certification,
  UserProfile,
  AIRecommendation,
  DiscussionPost,
  UserTier,
  UserApprovalInfo,
  ApprovalStatus,
  CoursePurchase,
  ShoppingItem
} from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

// Admin Queries
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery<UserApprovalInfo[]>({
    queryKey: ['approvals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userPrincipal, status }: { userPrincipal: string; status: ApprovalStatus }) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(userPrincipal);
      return actor.setApproval(principal, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      toast.success('User approval status updated!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update approval: ${error.message}`);
    },
  });
}

// Course Queries
export function useGetCourses() {
  const { actor, isFetching } = useActor();

  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.get_courses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCourse(courseId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Course | null>({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!actor || !courseId) return null;
      return actor.get_course(courseId);
    },
    enabled: !!actor && !isFetching && !!courseId,
  });
}

export function useCreateCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: CreateCourseForm) => {
      if (!actor) throw new Error('Actor not available');
      return actor.create_course(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create course: ${error.message}`);
    },
  });
}

export function useUpdateCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, form }: { courseId: string; form: CreateCourseForm }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.update_course(courseId, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update course: ${error.message}`);
    },
  });
}

export function useDeleteCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.delete_course(courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete course: ${error.message}`);
    },
  });
}

// Course Purchase Queries
export function useGetPurchasedCourses() {
  const { actor, isFetching } = useActor();

  return useQuery<CoursePurchase[]>({
    queryKey: ['purchasedCourses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.get_purchased_courses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useHasPurchasedCourse(courseId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasPurchasedCourse', courseId],
    queryFn: async () => {
      if (!actor || !courseId) return false;
      return actor.has_purchased_course(courseId);
    },
    enabled: !!actor && !isFetching && !!courseId,
  });
}

// Stripe Checkout
export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ items, successUrl, cancelUrl }: { 
      items: ShoppingItem[]; 
      successUrl: string; 
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCheckoutSession(items, successUrl, cancelUrl);
    },
    onError: (error: Error) => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });
}

export function useConfirmCheckoutSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, courseId }: { sessionId: string; courseId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.confirmCheckoutSession(sessionId, courseId);
    },
    onSuccess: (_, variables) => {
      // Invalidate purchase-related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['purchasedCourses'] });
      queryClient.invalidateQueries({ queryKey: ['hasPurchasedCourse', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['hasPurchasedCourse'] });
    },
    onError: (error: Error) => {
      toast.error(`Payment confirmation failed: ${error.message}`);
    },
  });
}

// PayPal Payment
export function useCreatePaypalPayment() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ courseId, sessionId }: { courseId: string; sessionId: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createPaypalPayment(courseId, sessionId);
      // Return the sessionId for the caller to use
      return { sessionId };
    },
    onError: (error: Error) => {
      toast.error(`PayPal payment creation failed: ${error.message}`);
    },
  });
}

export function useConfirmPaypalPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, courseId }: { sessionId: string; courseId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.confirmPaypalPayment(sessionId);
    },
    onSuccess: (_, variables) => {
      // Invalidate purchase-related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['purchasedCourses'] });
      queryClient.invalidateQueries({ queryKey: ['hasPurchasedCourse', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['hasPurchasedCourse'] });
    },
    onError: (error: Error) => {
      toast.error(`PayPal payment confirmation failed: ${error.message}`);
    },
  });
}

// Course Progress Queries
export function useGetMyCourseProgress(courseId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<CourseProgress | null>({
    queryKey: ['courseProgress', courseId],
    queryFn: async () => {
      if (!actor || !courseId) return null;
      return actor.get_my_course_progress(courseId);
    },
    enabled: !!actor && !isFetching && !!courseId,
  });
}

export function useUpdateCourseProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, progress }: { courseId: string; progress: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.update_course_progress(courseId, progress);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courseProgress', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['myCertifications'] });
      toast.success('Progress updated!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update progress: ${error.message}`);
    },
  });
}

// Fashion Show Queries
export function useGetFashionShows() {
  const { actor, isFetching } = useActor();

  return useQuery<FashionShow[]>({
    queryKey: ['fashionShows'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.get_fashion_shows();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFashionShow(showId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<FashionShow | null>({
    queryKey: ['fashionShow', showId],
    queryFn: async () => {
      if (!actor || !showId) return null;
      return actor.get_fashion_show(showId);
    },
    enabled: !!actor && !isFetching && !!showId,
  });
}

export function useCreateFashionShow() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { 
      title: string; 
      description: string; 
      scheduledAt: bigint; 
      collections: string[] 
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.create_fashion_show(
        params.title, 
        params.description, 
        params.scheduledAt, 
        params.collections
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fashionShows'] });
      toast.success('Fashion show created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create fashion show: ${error.message}`);
    },
  });
}

// Virtual Design Queries
export function useGetMyDesigns() {
  const { actor, isFetching } = useActor();

  return useQuery<VirtualDesign[]>({
    queryKey: ['myDesigns'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.get_my_designs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDesign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { 
      title: string; 
      materials: [string, bigint][]; 
      steps: string[] 
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.create_design(params.title, params.materials, params.steps);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDesigns'] });
      toast.success('Design created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create design: ${error.message}`);
    },
  });
}

export function useUpdateDesign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { 
      designId: string;
      title: string; 
      materials: [string, bigint][]; 
      steps: string[] 
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.update_design(params.designId, params.title, params.materials, params.steps);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDesigns'] });
      toast.success('Design updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update design: ${error.message}`);
    },
  });
}

export function useDeleteDesign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (designId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.delete_design(designId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDesigns'] });
      toast.success('Design deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete design: ${error.message}`);
    },
  });
}

// Achievement Queries
export function useGetMyAchievements() {
  const { actor, isFetching } = useActor();

  return useQuery<Achievement[]>({
    queryKey: ['myAchievements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.get_my_achievements();
    },
    enabled: !!actor && !isFetching,
  });
}

// Certification Queries
export function useGetMyCertifications() {
  const { actor, isFetching } = useActor();

  return useQuery<Certification[]>({
    queryKey: ['myCertifications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.get_my_certifications();
    },
    enabled: !!actor && !isFetching,
  });
}

// AI Recommendations
export function useGetRecommendations() {
  const { actor, isFetching } = useActor();

  return useQuery<AIRecommendation[]>({
    queryKey: ['recommendations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.get_recommendations();
    },
    enabled: !!actor && !isFetching,
  });
}

// Discussion Board Queries
export function useGetDiscussions() {
  const { actor, isFetching } = useActor();

  return useQuery<DiscussionPost[]>({
    queryKey: ['discussions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.get_discussions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDiscussion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.create_discussion(title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      toast.success('Discussion created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create discussion: ${error.message}`);
    },
  });
}

export function useAddDiscussionReply() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.add_discussion_reply(postId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      toast.success('Reply added successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add reply: ${error.message}`);
    },
  });
}

// Mentorship Queries
export function useAddMentorship() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menteeId: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(menteeId);
      return actor.add_mentorship(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorships'] });
      toast.success('Mentorship connection established!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add mentorship: ${error.message}`);
    },
  });
}
