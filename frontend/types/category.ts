export type Category = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string | null;
    icon?: string;
    color?: string;
    itemsCount: number;
    tags: string[];
    isActive: boolean;
    updatedAt: string; // ISO
  };
  