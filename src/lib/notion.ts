import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { Post, TagFilterItem } from '@/types/blog';

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
    slug: props.Slug.rich_text[0]?.plain_text ?? props.id,
  };
}

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
const n2m = new NotionToMarkdown({ notionClient: notion });

// 모든 포스트 조회
export const getPublishedPosts = async (tagFilter?: string): Promise<Post[]> => {
  const baseFilter = {
    property: 'Status',
    select: {
      equals: 'Published',
    },
  };

  const filters = tagFilter
    ? {
        and: [
          baseFilter,
          {
            property: 'Tags',
            multi_select: {
              contains: tagFilter,
            },
          },
        ],
      }
    : baseFilter;

  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: filters,
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });
  return response.results.map(mapNotionToPost);
};

/**
 * 단일 포스트 조회 (slug 또는 id로)
 */
export const getPostBySlug = async (
  slug: string
): Promise<{ post: Post; content: string } | null> => {
  try {
    // 먼저 slug로 검색
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'Status',
            select: {
              equals: 'Published',
            },
          },
          {
            property: 'Slug',
            rich_text: {
              equals: slug,
            },
          },
        ],
      },
    });
    if (response.results.length > 0) {
      const mdblocks = await n2m.pageToMarkdown(response.results[0].id);
      const { parent } = n2m.toMarkdownString(mdblocks);
      return { post: mapNotionToPost(response.results[0]), content: parent };
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch post by slug:', error);
    return null;
  }
};

/**
 * 모든 태그와 각 태그별 포스트 수 가져오기
 */
export const getTagStats = async (): Promise<TagFilterItem[]> => {
  try {
    const allPosts = await getPublishedPosts();

    // 태그별 카운트 계산
    const tagCounts: Record<string, number> = {};

    allPosts.forEach((post) => {
      post.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // 전체 태그 추가
    const tagStats: TagFilterItem[] = [
      {
        id: 'all',
        name: '전체',
        count: allPosts.length,
      },
      ...Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a) // 포스트 수 기준 내림차순 정렬
        .map(([name, count]) => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          count,
        })),
    ];

    return tagStats;
  } catch (error) {
    console.error('Failed to fetch tag stats:', error);
    // 에러 시 기본 태그 반환
    return [
      {
        id: 'all',
        name: '전체',
        count: 0,
      },
    ];
  }
};
