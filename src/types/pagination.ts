export interface PathPagination {
  paginate: (posts: string[], opts: { pageSize: number }) => Promise<any>;
}
