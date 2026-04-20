export interface Post {
    id?: string;
    title: string;
    content: string; // Markdown
    createdAt: string;
    updatedAt: string;
    authorId: string;
}
