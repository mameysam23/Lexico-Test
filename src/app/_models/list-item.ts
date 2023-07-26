export interface ListItem {
  id: number;
  parentId: number;
  name: string;
  children?: ListItem[];
}
