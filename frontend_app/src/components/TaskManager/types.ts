export type CustomTask = { 
    id: number;
    title: string;
    description: string;
    status: string;
    parentId?: number;
  };