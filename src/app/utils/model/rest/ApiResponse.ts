export type ApiResponse<T> = {
  success: boolean,
  code: string,
  message: string,
  data: T,
  traceId: string,
  errors?: string []
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pagination wrapper for API responses
 * Mirror di: org.springframework.data.domain.Page
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;          // Current page number (0-indexed)
  size: number;            // Page size
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
