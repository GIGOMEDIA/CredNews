export type VoteValue = 'real' | 'fake';
export type CommentVerdict = 'fact' | 'fake';

export type Comment = {
  id: string;
  authorUid: string;
  authorEmail: string;
  authorVerified: boolean;
  createdAt: string;
  text: string;
  verdict: CommentVerdict | null;
  realVotes: number;
  fakeVotes: number;
  myVote: VoteValue | null;
  pending?: boolean;
};

export type CommentStats = {
  commentCount: number;
  totalVotes: number;
  realPercent: number;
  fakePercent: number;
};

export const computeStats = (comments: Comment[]): CommentStats => {
  const commentCount = comments.length;
  const realVotes = comments.reduce((sum, comment) => sum + comment.realVotes, 0);
  const fakeVotes = comments.reduce((sum, comment) => sum + comment.fakeVotes, 0);
  const totalVotes = realVotes + fakeVotes;

  return {
    commentCount,
    totalVotes,
    realPercent: totalVotes ? Math.round((realVotes / totalVotes) * 100) : 0,
    fakePercent: totalVotes ? 100 - Math.round((realVotes / totalVotes) * 100) : 0,
  };
};
