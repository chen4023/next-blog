import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getPostBySlug, getPublishedPosts } from '@/lib/notion';
import { notFound } from 'next/navigation';
import { formatDateSimple, extractTableOfContents, type TableOfContentsItem } from '@/lib/utils';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { TableOfContents } from '@/components/features/blog/TableOfContents';
import { H1, H2, H3, H4, H5, H6 } from '@/components/features/blog/MDXComponents';

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const result = await getPostBySlug(slug);

  if (!result) {
    notFound();
  }
  const { post, content } = result;

  // 목차 추출
  const tableOfContents = extractTableOfContents(content);

  // 이전/다음 포스트 가져오기
  const allPosts = await getPublishedPosts();
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="container py-12">
      <div className="grid grid-cols-[1fr_260px] gap-18">
        {/* 블로그 헤더 */}
        <section>
          <div className="space-y-4">
            {/* 뒤로가기 버튼 */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              목록으로 돌아가기
            </Link>

            <div className="space-y-2">
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <h1 className="text-4xl font-bold mt-6">{post.title}</h1>
            </div>

            {/* 메타 정보 */}
            <div className="text-muted-foreground flex gap-4 text-sm">
              {post.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              )}
              {post.date && (
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDateSimple(post.date)}</span>
                </div>
              )}
              {post.modifiedDate && post.modifiedDate !== post.date && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>수정: {formatDateSimple(post.modifiedDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* 커버 이미지 */}
          {post.coverImage && (
            <div className="my-8">
              <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          <Separator className="my-8" />

          {/* 블로그 본문 */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <MDXRemote
              source={content}
              components={{
                h1: H1 as any,
                h2: H2 as any,
                h3: H3 as any,
                h4: H4 as any,
                h5: H5 as any,
                h6: H6 as any,
              }}
            />
          </div>
          <Separator className="my-16" />

          {/* 이전/다음 포스트 네비게이션 */}
          <nav className="grid grid-cols-2 gap-8">
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug || prevPost.id}`}>
                <Card className="group hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                      <ChevronLeft className="h-4 w-4" />
                      <span>이전 포스트</span>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{prevPost.title}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link href={`/blog/${nextPost.slug || nextPost.id}`} className="text-right">
                <Card className="group hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-end gap-2 text-base font-medium">
                      <span>다음 포스트</span>
                      <ChevronRight className="h-4 w-4" />
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{nextPost.title}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </section>

        {/* 목차 사이드바 */}
        <aside className="relative">
          <div className="sticky top-[var(--sticky-top)]">
            <TableOfContents tableOfContents={tableOfContents} post={post} />
          </div>
        </aside>
      </div>
    </div>
  );
}
