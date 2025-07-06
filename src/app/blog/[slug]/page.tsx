import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getPostBySlug, getPublishedPosts } from '@/lib/notion';
import { notFound } from 'next/navigation';
import { formatDateSimple } from '@/lib/utils';
import Image from 'next/image';

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }
  console.log(post);

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
            {post.description && (
              <p className="lead text-xl text-muted-foreground">{post.description}</p>
            )}
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

        {/* 사이드바 */}
        <aside className="relative">
          <div className="sticky top-[var(--sticky-top)]">
            <div className="bg-muted/30 space-y-4 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold">포스트 정보</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">작성자:</span>
                  <p className="font-medium">{post.author || '미상'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">작성일:</span>
                  <p className="font-medium">{formatDateSimple(post.date)}</p>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">태그:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
