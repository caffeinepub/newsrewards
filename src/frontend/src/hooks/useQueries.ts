import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Article,
  Earning,
  LeaderboardEntry,
  UserProfile,
  Withdrawal,
} from "../backend.d";
import { useActor } from "./useActor";

export function useGetArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWallet() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    balance: bigint;
    totalEarned: bigint;
    readArticles: bigint[];
    inrValue: number;
  }>({
    queryKey: ["wallet"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getWallet();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEarningsHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<Earning[]>({
    queryKey: ["earnings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEarningsHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWithdrawals() {
  const { actor, isFetching } = useActor();
  return useQuery<Withdrawal[]>({
    queryKey: ["withdrawals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWithdrawals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
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

export function useRecordArticleRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (articleId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.recordArticleRead(articleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["earnings"] });
    },
  });
}

export function useSubmitWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      accountNumber,
      ifscCode,
      coinAmount,
    }: {
      accountNumber: string;
      ifscCode: string;
      coinAmount: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitWithdrawal(accountNumber, ifscCode, coinAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("No actor");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}
