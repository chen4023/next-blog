import { Client } from '@notionhq/client';
import { Post } from '@/types/blog';

/**
 * Notion File Object에서 url 추출
 */
function getCoverImageUrl(cover: any): string | undefined {
  if (!cover) return undefined;
  if (cover.type === 'external') return cover.external.url;
  if (cover.type === 'file' || cover.type === 'file_upload') return cover.file?.url;
  return undefined;
}

/**
 * Notion API 응답 객체를 Post 타입으로 변환
 */
function mapNotionToPost(notionPage: any): Post {
  const props = notionPage.properties;
  return {
    id: notionPage.id,
    title: props.Title.title[0]?.plain_text ?? '',
    description: props.Description.rich_text[0]?.plain_text ?? '',
    coverImage: getCoverImageUrl(notionPage.cover),
    tags: props.Tags.multi_select.map((tag: any) => tag.name),
    author: props.Author.people[0]?.name ?? '',
    date: props.Date.date?.start ?? undefined,
    modifiedDate: props['Modified Date'].date?.start ?? undefined,
    slug: props.Slug.rich_text[0]?.plain_text ?? '',
  };
}

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getPublishedPosts = async (): Promise<Post[]> => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'Status',
      select: {
        equals: 'Published',
      },
    },
    sorts: [
      {
        property: 'Modified Date',
        direction: 'descending',
      },
    ],
  });
  return response.results.map(mapNotionToPost);
};
