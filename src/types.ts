export type PerformanceStatus = 'pending' | 'active' | 'completed';
export type MatchStatus = 'pending' | 'active' | 'completed';
export type ActiveView = 'forms' | 'combat' | 'idle';

export interface Performance {
  id: string;
  name: string;
  competitor: string;
  scores: Record<string, number>;
  averageScore: number;
  status: PerformanceStatus;
  order: number;
}

export interface Match {
  id: string;
  redCorner: {
    name: string;
    photoUrl: string;
  };
  blueCorner: {
    name: string;
    photoUrl: string;
  };
  winner: 'red' | 'blue' | null;
  status: MatchStatus;
}

export interface GlobalSettings {
  activeView: ActiveView;
  activeId: string | null;
  showWinnerAnimation: boolean;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
