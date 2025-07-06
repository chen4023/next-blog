import { PostCard } from '@/components/features/blog/PostCard';
import TagSection from './_components/TagSection';
import ProfileSection from './_components/ProfileSection';
import ContactSection from './_components/ContactSection';
import Link from 'next/link';
import Dropdown from '@/components/features/blog/Dropdown';
import { mockMenu } from '@/mock/blog';
import { getPublishedPosts } from '@/lib/notion';
import { Post } from '@/types/blog';

interface HomePageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const rawTag = await searchParams;
  const tag = rawTag.tag ? decodeURIComponent(rawTag.tag) : undefined;

  // 서버에서 태그 필터링된 포스트 가져오기
  const posts: Post[] = await getPublishedPosts(tag);

  return (
    // min-h-screen으로 전체 높이 보장, grid로 3개 영역 분할
    <div className="container py-8">
      <div className="grid grid-cols-[200px_1fr_220px] gap-6">
        {/*좌측 사이드바 */}
        <TagSection currentTag={tag} />
        <div className="space-y-8">
          {/* 섹션 제목 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold tracking-tight">HOME</h2>
              {tag && (
                <span className="text-muted-foreground">
                  {tag} 태그 ({posts.length}개)
                </span>
              )}
            </div>
            <Dropdown menus={mockMenu} />
          </div>
          {/* 블로그 카드 그리드 */}
          <div className="grid gap-4">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {tag ? `"${tag}" 태그의 포스트가 없습니다.` : '포스트가 없습니다.'}
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <Link href={`/blog/${post.slug || post.id}`} key={post.id}>
                  <PostCard post={post} />
                </Link>
              ))
            )}
          </div>
        </div>
        {/*우측 사이드바 */}
        <aside className="flex flex-col gap-6">
          <ProfileSection />
          <ContactSection />
        </aside>
      </div>
    </div>
  );
}
